"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TranscriptionWorkspace } from "@/components/transcription/transcription-workspace";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Loader2, Trophy, AlertTriangle } from "lucide-react";

interface MediaTask {
  id: string;
  title: string;
  streamUrl: string;
  thumbnailUrl?: string | null;
  category: string | null;
  rewardCoins: number;
  mediaType: string;
}

interface Submission {
  id: string;
  title: string;
  rewardCoins: number;
  status: string;
  createdAt: string;
}

interface TranscriptionPageClientProps {
  initialTask: MediaTask | null;
  todayCount: number;
  dailyLimit: number;
  limitReached: boolean;
  noTasks: boolean;
  submissions: Submission[];
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  PENDING_REVIEW: { icon: <Clock className="h-3.5 w-3.5" />, label: "Pending", cls: "text-yellow-500" },
  APPROVED: { icon: <CheckCircle className="h-3.5 w-3.5" />, label: "Approved", cls: "text-green-500" },
  REJECTED: { icon: <XCircle className="h-3.5 w-3.5" />, label: "Rejected", cls: "text-red-500" },
};

export function TranscriptionPageClient({
  initialTask,
  todayCount,
  dailyLimit,
  limitReached,
  noTasks,
  submissions,
}: TranscriptionPageClientProps) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [count, setCount] = useState(todayCount);

  const handleTaskComplete = () => {
    setCount((c) => c + 1);
    setTask(null);
    // Reload page to get next task from server
    setTimeout(() => router.refresh(), 500);
  };

  // Daily limit reached
  if (limitReached || count >= dailyLimit) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Trophy className="h-16 w-16 text-primary" />
            <h2 className="text-xl font-bold">Daily Limit Reached!</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              You&apos;ve completed all {dailyLimit} tasks for today. Come back tomorrow for more earning opportunities!
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{count}/{dailyLimit}</span>
              <span className="text-muted-foreground">tasks done today</span>
            </div>
          </CardContent>
        </Card>
        <SubmissionHistory submissions={submissions} />
      </div>
    );
  }

  // No tasks available in the cache
  if (noTasks || !task) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h2 className="text-lg font-bold">No Tasks Available</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {noTasks
                ? "You've completed all available transcription tasks. New media will be loaded soon!"
                : "Loading next task..."}
            </p>
            {!noTasks && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
          </CardContent>
        </Card>
        <SubmissionHistory submissions={submissions} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TranscriptionWorkspace
        task={task}
        todayCount={count}
        dailyLimit={dailyLimit}
        onTaskComplete={handleTaskComplete}
      />
      <SubmissionHistory submissions={submissions} />
    </div>
  );
}

function SubmissionHistory({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {submissions.map((s) => {
          const cfg = statusConfig[s.status] ?? statusConfig.PENDING_REVIEW;
          return (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString()} · +{s.rewardCoins} coins
                </p>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.cls}`}>
                {cfg.icon}
                {cfg.label}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
