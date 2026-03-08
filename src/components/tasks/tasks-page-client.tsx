"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Coins, Send, Loader2, CheckCircle, AlertTriangle, Trophy } from "lucide-react";
import { submitTranscription } from "@/actions/transcription";

interface ImageTask {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  category: string | null;
  rewardCoins: number;
}

function ImageTaskCard({
  task,
  onComplete,
}: {
  task: ImageTask;
  onComplete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handleSubmit = () => {
    if (wordCount < 3) return;
    startTransition(async () => {
      const res = await submitTranscription(task.id, text);
      setResult(res);
      if (res.success) {
        setTimeout(onComplete, 1200);
      }
    });
  };

  if (result?.success) {
    return (
      <Card className="overflow-hidden border-green-500/30">
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <p className="text-xs font-medium text-green-500">Submitted! +{task.rewardCoins} coins pending</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div
        className="relative aspect-video bg-zinc-900 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {task.thumbnailUrl ? (
          <img
            src={task.thumbnailUrl}
            alt={task.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image className="h-8 w-8 text-white/40" />
          </div>
        )}
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
          <Coins className="h-3 w-3 text-yellow-400" /> +{task.rewardCoins}
        </span>
        {task.category && (
          <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
            {task.category}
          </span>
        )}
      </div>
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium truncate">{task.title}</p>
        {!expanded ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs gap-1"
            onClick={() => setExpanded(true)}
          >
            <Image className="h-3 w-3" /> Describe this image
          </Button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe what you see in this image..."
              className="w-full min-h-[80px] rounded-lg border border-border bg-transparent p-2 text-xs outline-none focus:border-primary resize-none"
              disabled={isPending}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{wordCount} words (min 3)</span>
              {result?.error && <span className="text-[10px] text-red-500">{result.error}</span>}
            </div>
            <Button
              size="sm"
              className="w-full gap-1 text-xs"
              disabled={wordCount < 3 || isPending}
              onClick={handleSubmit}
            >
              {isPending ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="h-3 w-3" /> Submit Description</>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TasksPageClient() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ImageTask[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(10);
  const [limitReached, setLimitReached] = useState(false);
  const [noTasks, setNoTasks] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const { getImageTasks } = await import("@/actions/transcription");
        const data = await getImageTasks();
        setTasks(data.tasks);
        setTodayCount(data.todayCount);
        setDailyLimit(data.dailyLimit);
        setLimitReached(data.limitReached);
        setNoTasks(data.noTasks);
      } catch {
        setNoTasks(true);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const handleComplete = () => {
    setTodayCount((c) => c + 1);
    setTimeout(() => router.refresh(), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (limitReached || todayCount >= dailyLimit) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <Trophy className="h-16 w-16 text-primary" />
          <h2 className="text-xl font-bold">Daily Limit Reached!</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            You&apos;ve completed all {dailyLimit} tasks for today. Come back tomorrow!
          </p>
          <div className="text-sm font-medium">{todayCount}/{dailyLimit} tasks done today</div>
        </CardContent>
      </Card>
    );
  }

  if (noTasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h2 className="text-lg font-bold">No Tasks Available</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            You&apos;ve completed all available image tasks. New media will be loaded soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Daily Progress</span>
          <span className="text-xs text-muted-foreground">{todayCount}/{dailyLimit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="progress-bar w-32">
            <div className="progress-bar-fill" style={{ width: `${(todayCount / dailyLimit) * 100}%` }} />
          </div>
          <span className="text-xs font-medium">{Math.round((todayCount / dailyLimit) * 100)}%</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {tasks.map((task) => (
          <ImageTaskCard key={task.id} task={task} onComplete={handleComplete} />
        ))}
      </div>
    </div>
  );
}
