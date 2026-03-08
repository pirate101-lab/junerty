"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveSubmission, rejectSubmission } from "@/actions/transcription";

interface Submission {
  id: string;
  submittedText: string;
  status: string;
  rewardCoins: number;
  createdAt: string;
  reviewedAt: string | null;
  task: { title: string; rewardCoins: number };
  user: { name: string | null; email: string };
}

function SubmissionRow({ submission }: { submission: Submission }) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionResult, setActionResult] = useState<string | null>(null);

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveSubmission(submission.id);
      setActionResult(result.success ? "approved" : result.error ?? "Failed");
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectSubmission(submission.id);
      setActionResult(result.success ? "rejected" : result.error ?? "Failed");
    });
  };

  const statusBadge = {
    PENDING_REVIEW: { label: "Pending", cls: "bg-yellow-500/10 text-yellow-500" },
    APPROVED: { label: "Approved", cls: "bg-green-500/10 text-green-500" },
    REJECTED: { label: "Rejected", cls: "bg-red-500/10 text-red-500" },
  }[actionResult === "approved" ? "APPROVED" : actionResult === "rejected" ? "REJECTED" : submission.status] ?? { label: submission.status, cls: "bg-muted text-muted-foreground" };

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{submission.task.title}</p>
          <p className="text-xs text-muted-foreground">
            by {submission.user.name ?? submission.user.email} ·{" "}
            {new Date(submission.createdAt).toLocaleDateString()} ·{" "}
            +{submission.rewardCoins} coins
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.cls}`}>
          {statusBadge.label}
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary hover:underline"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Hide" : "Show"} transcription
      </button>

      {expanded && (
        <div className="rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
          {submission.submittedText}
        </div>
      )}

      {submission.status === "PENDING_REVIEW" && !actionResult && (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleApprove} disabled={isPending} className="h-7 gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={handleReject} disabled={isPending} className="h-7 gap-1.5">
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      )}

      {actionResult && actionResult !== "approved" && actionResult !== "rejected" && (
        <p className="text-xs text-red-500">{actionResult}</p>
      )}
    </div>
  );
}

interface TranscriptionReviewPanelProps {
  submissions: Submission[];
}

export function TranscriptionReviewPanel({ submissions }: TranscriptionReviewPanelProps) {
  const [filter, setFilter] = useState<"all" | "PENDING_REVIEW" | "APPROVED" | "REJECTED">("all");

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  const filters: { key: typeof filter; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: null },
    { key: "PENDING_REVIEW", label: "Pending", icon: <Clock className="h-3 w-3" /> },
    { key: "APPROVED", label: "Approved", icon: <CheckCircle className="h-3 w-3" /> },
    { key: "REJECTED", label: "Rejected", icon: <XCircle className="h-3 w-3" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No submissions found</p>
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
