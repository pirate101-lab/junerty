"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DAILY_TASK_LIMIT = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Start of today (UTC) */
function todayStart(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

async function requireAdmin() {
  const userId = await requireAuth();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  return userId;
}

// ---------------------------------------------------------------------------
// User actions
// ---------------------------------------------------------------------------

/**
 * Get the user's daily progress and an available task to transcribe.
 * Returns null task if daily limit reached or no tasks available.
 */
export async function getNextTask() {
  const userId = await requireAuth();
  const start = todayStart();

  // Count today's submissions
  const todayCount = await prisma.transcriptionSubmission.count({
    where: { userId, createdAt: { gte: start } },
  });

  if (todayCount >= DAILY_TASK_LIMIT) {
    return { task: null, todayCount, dailyLimit: DAILY_TASK_LIMIT, limitReached: true };
  }

  // IDs of tasks user has already submitted (any status)
  const completedTaskIds = await prisma.transcriptionSubmission.findMany({
    where: { userId },
    select: { taskId: true },
  });
  const excludeIds = completedTaskIds.map((s) => s.taskId);

  // Get total available tasks for progress info
  const totalAvailable = await prisma.mediaTask.count({
    where: { isActive: true, id: { notIn: excludeIds } },
  });

  if (totalAvailable === 0) {
    return { task: null, todayCount, dailyLimit: DAILY_TASK_LIMIT, limitReached: false, noTasks: true };
  }

  // Pick a random task the user hasn't done
  const skip = Math.floor(Math.random() * totalAvailable);
  const task = await prisma.mediaTask.findFirst({
    where: { isActive: true, id: { notIn: excludeIds } },
    skip,
    select: {
      id: true,
      title: true,
      streamUrl: true,
      thumbnailUrl: true,
      category: true,
      rewardCoins: true,
      mediaType: true,
    },
  });

  return { task, todayCount, dailyLimit: DAILY_TASK_LIMIT, limitReached: false };
}

/**
 * Submit a transcription for a media task.
 */
export async function submitTranscription(
  taskId: string,
  submittedText: string,
): Promise<{ success: boolean; error?: string }> {
  const userId = await requireAuth();

  if (!submittedText.trim()) {
    return { success: false, error: "Transcription text cannot be empty" };
  }

  // Enforce daily limit
  const todayCount = await prisma.transcriptionSubmission.count({
    where: { userId, createdAt: { gte: todayStart() } },
  });
  if (todayCount >= DAILY_TASK_LIMIT) {
    return { success: false, error: "Daily task limit reached (10/day)" };
  }

  // Check task exists
  const task = await prisma.mediaTask.findUnique({
    where: { id: taskId },
    select: { rewardCoins: true },
  });
  if (!task) return { success: false, error: "Task not found" };

  // Check not already submitted
  const existing = await prisma.transcriptionSubmission.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });
  if (existing) return { success: false, error: "Already submitted for this task" };

  await prisma.transcriptionSubmission.create({
    data: {
      taskId,
      userId,
      submittedText: submittedText.trim(),
      rewardCoins: task.rewardCoins,
      status: "PENDING_REVIEW",
    },
  });

  revalidatePath("/transcription");
  return { success: true };
}

/**
 * Fetch the current user's transcription submissions (latest 20).
 */
export async function getUserSubmissions() {
  const userId = await requireAuth();

  return prisma.transcriptionSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { task: { select: { title: true, rewardCoins: true } } },
  });
}

// ---------------------------------------------------------------------------
// Admin actions
// ---------------------------------------------------------------------------

/**
 * Fetch all submissions for admin review (latest 50).
 */
export async function getAdminSubmissions(status?: string) {
  await requireAdmin();

  const where = status ? { status: status as "PENDING_REVIEW" | "APPROVED" | "REJECTED" } : {};

  return prisma.transcriptionSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      task: { select: { title: true, rewardCoins: true } },
      user: { select: { name: true, email: true } },
    },
  });
}

/**
 * Get aggregate counts for admin dashboard.
 */
export async function getTranscriptionStats() {
  await requireAdmin();

  const [total, pending, approved, rejected] = await Promise.all([
    prisma.transcriptionSubmission.count(),
    prisma.transcriptionSubmission.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.transcriptionSubmission.count({ where: { status: "APPROVED" } }),
    prisma.transcriptionSubmission.count({ where: { status: "REJECTED" } }),
  ]);

  return { total, pending, approved, rejected };
}

/**
 * Approve a submission — credits reward to user's wallet.
 */
export async function approveSubmission(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const submission = await prisma.transcriptionSubmission.findUnique({
    where: { id: submissionId },
    include: { task: { select: { rewardCoins: true } } },
  });

  if (!submission) return { success: false, error: "Submission not found" };
  if (submission.status !== "PENDING_REVIEW") {
    return { success: false, error: "Already reviewed" };
  }

  const reward = submission.task.rewardCoins;

  // Atomically: approve submission + credit wallet + create transaction
  await prisma.$transaction([
    prisma.transcriptionSubmission.update({
      where: { id: submissionId },
      data: { status: "APPROVED", reviewedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: submission.userId },
      data: { walletBalance: { increment: reward } },
    }),
    prisma.transaction.create({
      data: {
        userId: submission.userId,
        type: "TRANSCRIPTION_REWARD",
        amount: reward,
        status: "COMPLETED",
        description: `Transcription reward: ${submission.task.rewardCoins} coins`,
        reference: `txn-${submissionId}`,
      },
    }),
  ]);

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Reject a submission.
 */
export async function rejectSubmission(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const submission = await prisma.transcriptionSubmission.findUnique({
    where: { id: submissionId },
  });
  if (!submission) return { success: false, error: "Submission not found" };
  if (submission.status !== "PENDING_REVIEW") {
    return { success: false, error: "Already reviewed" };
  }

  await prisma.transcriptionSubmission.update({
    where: { id: submissionId },
    data: { status: "REJECTED", reviewedAt: new Date() },
  });

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Get media cache info for admin.
 */
export async function getMediaCacheInfo() {
  await requireAdmin();

  const [taskCount, settings] = await Promise.all([
    prisma.mediaTask.count({ where: { isActive: true } }),
    prisma.globalSettings.findFirst({ select: { mediaCacheLastRefresh: true } }),
  ]);

  return {
    cachedVideos: taskCount,
    lastRefresh: settings?.mediaCacheLastRefresh ?? null,
  };
}

/**
 * Get image tasks for the /tasks page (thumbnails from cached media).
 * Shares the same daily limit and submission logic as transcription.
 */
export async function getImageTasks() {
  const userId = await requireAuth();
  const start = todayStart();

  const todayCount = await prisma.transcriptionSubmission.count({
    where: { userId, createdAt: { gte: start } },
  });

  if (todayCount >= DAILY_TASK_LIMIT) {
    return { tasks: [], todayCount, dailyLimit: DAILY_TASK_LIMIT, limitReached: true, noTasks: false };
  }

  const completedTaskIds = await prisma.transcriptionSubmission.findMany({
    where: { userId },
    select: { taskId: true },
  });
  const excludeIds = completedTaskIds.map((s) => s.taskId);

  const totalAvailable = await prisma.mediaTask.count({
    where: { isActive: true, id: { notIn: excludeIds } },
  });

  if (totalAvailable === 0) {
    return { tasks: [], todayCount, dailyLimit: DAILY_TASK_LIMIT, limitReached: false, noTasks: true };
  }

  const take = Math.min(10, totalAvailable);
  const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, totalAvailable - take)));

  const tasks = await prisma.mediaTask.findMany({
    where: { isActive: true, id: { notIn: excludeIds } },
    skip,
    take,
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      category: true,
      rewardCoins: true,
    },
  });

  return { tasks, todayCount, dailyLimit: DAILY_TASK_LIMIT, limitReached: false, noTasks: false };
}
