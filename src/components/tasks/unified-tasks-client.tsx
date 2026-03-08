"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Image,
  Video,
  Coins,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Clock,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitTranscription } from "@/actions/transcription";

// ─── Types ─────────────────────────────────────────────────────────────

interface MediaTask {
  id: string;
  title: string;
  streamUrl: string;
  thumbnailUrl?: string | null;
  category: string | null;
  rewardCoins: number;
  mediaType: string;
}

interface ImageTask {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  category: string | null;
  rewardCoins: number;
}

interface Submission {
  id: string;
  title: string;
  rewardCoins: number;
  status: string;
  createdAt: string;
}

interface UnifiedTasksClientProps {
  videoTask: MediaTask | null;
  imageTasks: ImageTask[];
  todayCount: number;
  dailyLimit: number;
  limitReached: boolean;
  noVideoTasks: boolean;
  noImageTasks: boolean;
  submissions: Submission[];
}

// ─── Category Tabs ─────────────────────────────────────────────────────

type Category = "videos" | "images";

// ─── Video Player ──────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function InlineVideoPlayer({
  streamUrl,
  title,
  thumbnailUrl,
}: {
  streamUrl: string;
  title: string;
  thumbnailUrl?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setElapsed(video.currentTime);
    const onDur = () => setDuration(video.duration || 0);
    const onEnd = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("durationchange", onDur);
    video.addEventListener("ended", onEnd);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("durationchange", onDur);
      video.removeEventListener("ended", onEnd);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [streamUrl]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const rewind = useCallback(() => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(0, v.currentTime - 5);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = val;
    setElapsed(val);
  }, []);

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900">
        <video
          ref={videoRef}
          src={streamUrl}
          poster={thumbnailUrl ?? undefined}
          className="h-full w-full object-contain"
          preload="metadata"
          playsInline
        />
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30">
              <Play className="h-6 w-6 translate-x-0.5 text-white" />
            </div>
          </button>
        )}
        <div className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white/80">
          {formatTime(elapsed)} / {formatTime(duration)}
        </div>
        <div className="absolute top-2 left-2 right-12 truncate rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
          {title}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={elapsed}
        onChange={handleSeek}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={rewind}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" className="h-7 w-7" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-px" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}

// ─── Video Task Card ───────────────────────────────────────────────────

function VideoTaskCard({
  task,
  onComplete,
}: {
  task: MediaTask;
  onComplete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handleSubmit = () => {
    if (wordCount < 5) return;
    startTransition(async () => {
      const res = await submitTranscription(task.id, text);
      setResult(res);
      if (res.success) setTimeout(onComplete, 1200);
    });
  };

  if (result?.success) {
    return (
      <Card className="overflow-hidden border-green-500/30">
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <p className="text-xs font-medium text-green-500">Submitted! +KES {task.rewardCoins} pending</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div
        className="relative aspect-video bg-zinc-900 cursor-pointer"
        onClick={() => !expanded && setExpanded(true)}
      >
        {!expanded ? (
          <>
            {task.thumbnailUrl ? (
              <img src={task.thumbnailUrl} alt={task.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Video className="h-8 w-8 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Play className="h-5 w-5 text-white translate-x-0.5" />
              </div>
            </div>
          </>
        ) : (
          <InlineVideoPlayer streamUrl={task.streamUrl} title={task.title} thumbnailUrl={task.thumbnailUrl} />
        )}
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white z-10">
          <Coins className="h-3 w-3 text-yellow-400" /> KES {task.rewardCoins}
        </span>
        {task.category && (
          <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white z-10">
            {task.category}
          </span>
        )}
      </div>
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium truncate">{task.title}</p>
        {!expanded ? (
          <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => setExpanded(true)}>
            <Play className="h-3 w-3" /> Play & Transcribe
          </Button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Listen and type what you hear in the video..."
              className="w-full min-h-[80px] rounded-lg border border-border bg-transparent p-2 text-xs outline-none focus:border-primary resize-none"
              disabled={isPending}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{wordCount} words (min 5)</span>
              {result?.error && <span className="text-[10px] text-red-500">{result.error}</span>}
            </div>
            <Button size="sm" className="w-full gap-1 text-xs" disabled={wordCount < 5 || isPending} onClick={handleSubmit}>
              {isPending ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="h-3 w-3" /> Submit Transcription</>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Image Task Card ───────────────────────────────────────────────────

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
      if (res.success) setTimeout(onComplete, 1200);
    });
  };

  if (result?.success) {
    return (
      <Card className="overflow-hidden border-green-500/30">
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <p className="text-xs font-medium text-green-500">Submitted! +KES {task.rewardCoins} pending</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video bg-zinc-900 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {task.thumbnailUrl ? (
          <img src={task.thumbnailUrl} alt={task.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image className="h-8 w-8 text-white/40" />
          </div>
        )}
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
          <Coins className="h-3 w-3 text-yellow-400" /> KES {task.rewardCoins}
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
          <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => setExpanded(true)}>
            <Image className="h-3 w-3" /> Describe Image
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
            <Button size="sm" className="w-full gap-1 text-xs" disabled={wordCount < 3 || isPending} onClick={handleSubmit}>
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

// ─── Submission History ────────────────────────────────────────────────

const statusConfig: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  PENDING_REVIEW: { icon: <Clock className="h-3.5 w-3.5" />, label: "Pending", cls: "text-yellow-500" },
  APPROVED: { icon: <CheckCircle className="h-3.5 w-3.5" />, label: "Approved", cls: "text-green-500" },
  REJECTED: { icon: <XCircle className="h-3.5 w-3.5" />, label: "Rejected", cls: "text-red-500" },
};

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
                  {new Date(s.createdAt).toLocaleDateString()} · +KES {s.rewardCoins}
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

// ─── Main Unified Tasks Client ─────────────────────────────────────────

export function UnifiedTasksClient({
  videoTask,
  imageTasks,
  todayCount,
  dailyLimit,
  limitReached,
  noVideoTasks,
  noImageTasks,
  submissions,
}: UnifiedTasksClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Category>("videos");
  const [count, setCount] = useState(todayCount);

  // For videos, we load multiple via router refresh
  const [allVideoTasks, setAllVideoTasks] = useState<MediaTask[]>(videoTask ? [videoTask] : []);
  const [loading, setLoading] = useState(false);

  // Load all 10 video tasks
  useEffect(() => {
    if (allVideoTasks.length >= 10 || limitReached || noVideoTasks) return;
    setLoading(true);
    import("@/actions/transcription").then(async (mod) => {
      const tasks: MediaTask[] = [];
      const seen = new Set(allVideoTasks.map((t) => t.id));
      // Fetch multiple tasks
      for (let i = 0; i < 12 && tasks.length < 10; i++) {
        try {
          const data = await mod.getNextTask();
          if (data.limitReached || !data.task) break;
          if (!seen.has(data.task.id)) {
            tasks.push(data.task);
            seen.add(data.task.id);
          }
        } catch { break; }
      }
      if (tasks.length > 0) {
        setAllVideoTasks((prev) => {
          const ids = new Set(prev.map((t) => t.id));
          const merged = [...prev];
          for (const t of tasks) {
            if (!ids.has(t.id)) { merged.push(t); ids.add(t.id); }
          }
          return merged.slice(0, 10);
        });
      }
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = () => {
    setCount((c) => c + 1);
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
              You&apos;ve completed all {dailyLimit} tasks for today. Come back tomorrow!
            </p>
            <div className="text-sm font-medium">{count}/{dailyLimit} tasks done today</div>
          </CardContent>
        </Card>
        <SubmissionHistory submissions={submissions} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Daily Progress Bar */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Daily Progress</span>
          <span className="text-xs text-muted-foreground">{count}/{dailyLimit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="progress-bar w-32">
            <div className="progress-bar-fill" style={{ width: `${(count / dailyLimit) * 100}%` }} />
          </div>
          <span className="text-xs font-medium">{Math.round((count / dailyLimit) * 100)}%</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 rounded-xl border border-border bg-card p-1">
        <button
          onClick={() => setTab("videos")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            tab === "videos"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Video className="h-4 w-4" />
          <span>Video Transcription</span>
          <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">KES 35-55</span>
        </button>
        <button
          onClick={() => setTab("images")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            tab === "images"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Image className="h-4 w-4" />
          <span>Image Description</span>
          <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">KES 15-30</span>
        </button>
      </div>

      {/* Content */}
      {tab === "videos" ? (
        loading && allVideoTasks.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : noVideoTasks && allVideoTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
              <h2 className="text-lg font-bold">No Video Tasks Available</h2>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                You&apos;ve completed all available video tasks. Try image tasks or check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-2">
            {allVideoTasks.map((task) => (
              <VideoTaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        )
      ) : (
        noImageTasks || imageTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
              <h2 className="text-lg font-bold">No Image Tasks Available</h2>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                You&apos;ve completed all available image tasks. Try video tasks or check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-2">
            {imageTasks.map((task) => (
              <ImageTaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        )
      )}

      {/* Submission History */}
      <SubmissionHistory submissions={submissions} />
    </div>
  );
}
