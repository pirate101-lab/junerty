"use client";

import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  AlignLeft,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { submitTranscription } from "@/actions/transcription";

const PLAYBACK_SPEEDS = [
  { label: "0.5×", value: "0.5" },
  { label: "0.75×", value: "0.75" },
  { label: "1×", value: "1" },
  { label: "1.25×", value: "1.25" },
  { label: "1.5×", value: "1.5" },
  { label: "2×", value: "2" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface VideoPlayerProps {
  streamUrl: string;
  title: string;
  thumbnailUrl?: string | null;
}

function VideoPlayer({ streamUrl, title, thumbnailUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setElapsed(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [streamUrl]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((err) => console.error("Play failed:", err));
    } else {
      video.pause();
    }
  }, []);

  const handleRewind = useCallback(() => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.max(0, video.currentTime - 5);
  }, []);

  const handleSpeedChange = useCallback((val: string) => {
    setSpeed(val);
    if (videoRef.current) videoRef.current.playbackRate = parseFloat(val);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = val;
    setElapsed(val);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
        <video
          ref={videoRef}
          src={streamUrl}
          poster={thumbnailUrl ?? undefined}
          className="h-full w-full object-contain"
          preload="metadata"
          playsInline
        />
        {!isPlaying && (
          <button onClick={(e) => { e.stopPropagation(); handlePlayPause(); }} aria-label="Play video" className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30">
              <Play className="h-7 w-7 translate-x-0.5 text-white" />
            </div>
          </button>
        )}
        <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white/80">
          {formatTime(elapsed)} / {formatTime(duration)}
        </div>
        <div className="absolute top-3 left-3 right-16 truncate rounded bg-black/60 px-2 py-0.5 text-xs text-white/80">
          {title}
        </div>
        <div className="absolute top-3 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white/80">
          {speed}×
        </div>
      </div>

      <div className="space-y-1">
        <input type="range" min={0} max={duration || 0} step={0.1} value={elapsed} onChange={handleSeek} aria-label="Seek" className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary" />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRewind} title="Rewind 5s"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={handlePlayPause} size="icon">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleMuteToggle} title={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Select value={speed} onValueChange={handleSpeedChange}>
            <SelectTrigger className="h-8 w-[80px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLAYBACK_SPEEDS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Current: <strong className="font-mono">{formatTime(elapsed)}</strong></span>
        </div>
      </div>
    </div>
  );
}

interface TranscriptionEditorProps {
  taskId: string;
  rewardCoins: number;
  onSubmitted: () => void;
}

function TranscriptionEditor({ taskId, rewardCoins, onSubmitted }: TranscriptionEditorProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{ success: boolean; error?: string } | null>(null);

  const trimmed = text.trim();
  const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const charCount = text.length;
  const minWords = 5;

  const handleSubmit = () => {
    if (wordCount < minWords) return;
    startTransition(async () => {
      const result = await submitTranscription(taskId, text);
      setSubmitResult(result);
      if (result.success) {
        setTimeout(() => onSubmitted(), 1500);
      }
    });
  };

  if (submitResult?.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-12">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <p className="text-sm font-medium text-green-500">Submitted successfully!</p>
        <p className="text-xs text-muted-foreground">+{rewardCoins} coins pending review</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlignLeft className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Transcription Editor</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">{wordCount} words · {charCount} chars</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">+{rewardCoins} coins</span>
        </div>
      </div>

      <div className={cn(
        "relative flex-1 overflow-hidden rounded-xl border transition-all duration-200",
        isFocused ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}>
        {text.length === 0 && !isFocused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
            <div className="text-center space-y-2 text-muted-foreground">
              <AlignLeft className="h-8 w-8 mx-auto opacity-40" />
              <p className="text-sm">Listen to the media and type what you hear</p>
              <p className="text-xs">Write at least {minWords} words</p>
            </div>
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="h-full min-h-[200px] w-full resize-none bg-transparent p-4 text-sm outline-none"
          disabled={isPending}
        />
      </div>

      {submitResult?.error && <p className="text-xs text-red-500">{submitResult.error}</p>}
      <Button onClick={handleSubmit} disabled={wordCount < minWords || isPending} className="w-full gap-2">
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
        ) : (
          <><Send className="h-4 w-4" /> Submit Transcription</>
        )}
      </Button>
    </div>
  );
}

// ─── Main Workspace ──────────────────────────────────────────────────────────

interface MediaTask {
  id: string;
  title: string;
  streamUrl: string;
  thumbnailUrl?: string | null;
  category: string | null;
  rewardCoins: number;
  mediaType: string;
}

interface TranscriptionWorkspaceProps {
  task: MediaTask;
  todayCount: number;
  dailyLimit: number;
  onTaskComplete: () => void;
}

export function TranscriptionWorkspace({ task, todayCount, dailyLimit, onTaskComplete }: TranscriptionWorkspaceProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Daily Progress</div>
          <span className="text-xs text-muted-foreground">{todayCount}/{dailyLimit} tasks completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="progress-bar w-32">
            <div className="progress-bar-fill" style={{ width: `${(todayCount / dailyLimit) * 100}%` }} />
          </div>
          <span className="text-xs font-medium">{Math.round((todayCount / dailyLimit) * 100)}%</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VideoPlayer streamUrl={task.streamUrl} title={task.title} thumbnailUrl={task.thumbnailUrl} />
        <TranscriptionEditor taskId={task.id} rewardCoins={task.rewardCoins} onSubmitted={onTaskComplete} />
      </div>
    </div>
  );
}
