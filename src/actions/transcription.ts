"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SubmissionStatus = "pending_review" | "approved" | "rejected";

export interface TranscriptionSubmission {
  id: string;
  task_id: string;
  user_id: string;
  submitted_text: string;
  status: SubmissionStatus;
  created_at: string;
  reviewed_at: string | null;
  /** Joined from media_tasks */
  media_tasks?: { title: string; reward_coins: number } | null;
}

// ---------------------------------------------------------------------------
// User actions
// ---------------------------------------------------------------------------

/**
 * Submit a transcription for a media task.
 * Requires an authenticated user – user_id is taken from the session,
 * not user input, to prevent spoofing.
 */
export async function submitTranscription(
  taskId: string,
  submittedText: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  if (!submittedText.trim()) {
    return { success: false, error: "Transcription text cannot be empty" };
  }

  const { error } = await getSupabaseAdmin()
    .from("transcription_submissions")
    .insert({
      task_id: taskId,
      user_id: session.user.id,
      submitted_text: submittedText.trim(),
      status: "pending_review",
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/transcription");
  return { success: true };
}

/**
 * Fetch the current user's transcription submissions (latest 20).
 */
export async function getUserSubmissions(): Promise<TranscriptionSubmission[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const { data, error } = await getSupabaseAdmin()
    .from("transcription_submissions")
    .select("*, media_tasks(title, reward_coins)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return [];
  return (data ?? []) as TranscriptionSubmission[];
}

// ---------------------------------------------------------------------------
// Admin actions
// ---------------------------------------------------------------------------

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") throw new Error("Forbidden: Admin access required");
}

/**
 * Fetch all transcription submissions for admin review (latest 50).
 * Optionally filter by status.
 */
export async function getAdminSubmissions(
  status?: SubmissionStatus,
): Promise<TranscriptionSubmission[]> {
  await requireAdmin();

  let query = getSupabaseAdmin()
    .from("transcription_submissions")
    .select("*, media_tasks(title, reward_coins)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as TranscriptionSubmission[];
}

/**
 * Get aggregate counts of submissions by status for the admin dashboard.
 */
export async function getTranscriptionStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}> {
  await requireAdmin();

  const { data, error } = await getSupabaseAdmin()
    .from("transcription_submissions")
    .select("status");

  if (error) return { total: 0, pending: 0, approved: 0, rejected: 0 };

  const rows = (data ?? []) as { status: string }[];
  const total = rows.length;
  const pending = rows.filter((r) => r.status === "pending_review").length;
  const approved = rows.filter((r) => r.status === "approved").length;
  const rejected = rows.filter((r) => r.status === "rejected").length;

  return { total, pending, approved, rejected };
}

/**
 * Approve a transcription submission.
 * The database trigger handles the payout automatically.
 */
export async function approveSubmission(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const { error } = await getSupabaseAdmin()
    .from("transcription_submissions")
    .update({ status: "approved" })
    .eq("id", submissionId)
    .eq("status", "pending_review"); // idempotency guard

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Reject a transcription submission.
 */
export async function rejectSubmission(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const { error } = await getSupabaseAdmin()
    .from("transcription_submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId)
    .eq("status", "pending_review"); // idempotency guard

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
