"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MS_PER_DAY, buildWeekBuckets } from "@/lib/utils";

export async function getDashboardMetrics() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const now = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * MS_PER_DAY);
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [
    totalTasks,
    completedTasks,
    tasksByStatus,
    recentTasks,
    userCount,
    overdueTasks,
    referrals,
    tasksLast7Days,
    todaySubmissions,
    userSubmissionTaskIds,
  ] = await Promise.all([
    prisma.task.count({
      where: {
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
    }),
    prisma.task.count({
      where: {
        status: "DONE",
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: {
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
      _count: true,
    }),
    prisma.task.findMany({
      where: {
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { name: true, email: true } },
        createdBy: { select: { name: true } },
      },
    }),
    prisma.user.count(),
    prisma.task.count({
      where: {
        dueDate: { lt: now },
        status: { not: "DONE" },
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
    }),
    prisma.user.findMany({
      where: { referredById: userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.task.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
      select: { createdAt: true, status: true },
    }),
    // Count today's transcription submissions
    prisma.transcriptionSubmission.count({
      where: { userId, createdAt: { gte: todayStart } },
    }),
    // IDs of tasks user already submitted
    prisma.transcriptionSubmission.findMany({
      where: { userId },
      select: { taskId: true },
    }),
  ]);

  // Get 10 random video tasks not yet done by this user
  const excludeIds = userSubmissionTaskIds.map((s) => s.taskId);
  const availableCount = await prisma.mediaTask.count({
    where: { isActive: true, id: { notIn: excludeIds } },
  });

  let assignedVideos: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    streamUrl: string;
    category: string | null;
    rewardCoins: number;
  }[] = [];

  if (availableCount > 0) {
    const take = Math.min(10, availableCount);
    const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, availableCount - take)));
    assignedVideos = await prisma.mediaTask.findMany({
      where: { isActive: true, id: { notIn: excludeIds } },
      skip,
      take,
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        streamUrl: true,
        category: true,
        rewardCoins: true,
      },
    });
  }

  const statusMap = Object.fromEntries(
    tasksByStatus.map((s) => [s.status, s._count])
  );

  // Build weekly activity chart data (last 7 days)
  const weekBuckets = buildWeekBuckets();
  const weekData = weekBuckets.map((b) => ({ ...b, tasks: 0, completed: 0 }));

  tasksLast7Days.forEach((t) => {
    const dateStr = new Date(t.createdAt).toDateString();
    const slot = weekData.find((w) => w.dateStr === dateStr);
    if (slot) {
      slot.tasks += 1;
      if (t.status === "DONE") slot.completed += 1;
    }
  });

  return {
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    tasksByStatus: {
      TODO: statusMap.TODO ?? 0,
      IN_PROGRESS: statusMap.IN_PROGRESS ?? 0,
      IN_REVIEW: statusMap.IN_REVIEW ?? 0,
      DONE: statusMap.DONE ?? 0,
    },
    recentTasks,
    userCount,
    overdueTasks,
    referrals,
    weekData: weekData.map(({ day, tasks, completed }) => ({ day, tasks, completed })),
    assignedVideos,
    todaySubmissions,
    dailyLimit: 10,
  };
}
