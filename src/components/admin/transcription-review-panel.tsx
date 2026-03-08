"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveSubmission, rejectSubmission } from "@/actions/transcription";
import type { TranscriptionSubmission } from "@/actions/transcription";

function SubmissionStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending_review: { label: "Pending Review", cls: "badge-pending" },
    approved: { label: "Approved", cls: "badge-completed" },
    rejected: { label: "Rejected", cls: "badge-failed" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "badge-todo" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function SubmissionRow({ submission }: { submission: TranscriptionSubmission }) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(submission.status);
  const [error, setError] = useState<string | null>(null);

  const isPendingReview = localStatus === "pending_review";

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const result = await approveSubmission(submission.id);
      if (result.success) {
        setLocalStatus("approved");
      } else {
        setError(result.error ?? "Failed to approve");
      }
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      const result = await rejectSubmission(submission.id);
      if (result.success) {
        setLocalStatus("rejected");
      } else {
        setError(result.error ?? "Failed to reject");
      }
    });
  }

  const createdDate = new Date(submission.created_at).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-medium truncate">
            {submission.media_tasks?.title ?? submission.task_id}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {createdDate}
            </span>
            {submission.media_tasks?.reward_coins !== undefined && (
              <span className="font-medium text-primary">
                {submission.media_tasks.reward_coins} coins
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SubmissionStatusBadge status={localStatus} />
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expandable transcript preview */}
      {expanded && (
        <div className="rounded-lg bg-muted/40 border border-border/40 p-3">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <FileText className="h-3.5 w-3.5" />
            Submitted Transcription
          </div>
          <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
            {submission.submitted_text}
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Action buttons — only shown for pending submissions */}
      {isPendingReview && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending}
            className="h-7 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
            className="h-7 gap-1.5"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

interface TranscriptionReviewPanelProps {
  submissions: TranscriptionSubmission[];
}

export function TranscriptionReviewPanel({ submissions }: TranscriptionReviewPanelProps) {
  const [filter, setFilter] = useState<"all" | "pending_review" | "approved" | "rejected">("all");

  const filtered = filter === "all"
    ? submissions
    : submissions.filter((s) => s.status === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending_review", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No submissions found
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  );
}
