"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  FileText,
  AlignLeft,
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

const PLAYBACK_SPEEDS = [
  { label: "0.5×", value: "0.5" },
  { label: "1×", value: "1" },
  { label: "1.5×", value: "1.5" },
  { label: "2×", value: "2" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Mock Video Player ───────────────────────────────────────────────────────

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [elapsed, setElapsed] = useState(0);
  const totalDuration = 185; // 3 min 05 s (mock)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Restart the interval whenever isPlaying or speed changes so the interval
  // always uses the correct speed value from the current render.
  useEffect(() => {
    if (!isPlaying) {
      stopTimer();
      return;
    }
    const speedMultiplier = parseFloat(speed);
    // Shorten the interval duration so elapsed time advances at the correct rate.
    const intervalMs = Math.round(1000 / speedMultiplier);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return prev + 1;
      });
    }, intervalMs);
    return () => stopTimer();
  }, [isPlaying, speed, stopTimer]);

  const handlePlayPause = () => {
    setIsPlaying((p) => !p);
  };

  const handleRewind = () => {
    setElapsed((prev) => Math.max(0, prev - 5));
  };

  const handleSpeedChange = (val: string) => {
    setSpeed(val);
    // The useEffect above will automatically restart the interval with the new speed.
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Video viewport */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
        {/* Fake video thumbnail */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 opacity-10">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-violet-600 to-indigo-800" />
            ))}
          </div>
          <div className="absolute flex flex-col items-center gap-2 text-white/40">
            <FileText className="h-12 w-12" />
            <span className="text-xs font-medium tracking-wide">
              interview_session_01.mp4
            </span>
          </div>
        </div>

        {/* Overlay play button when paused */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30">
              <Play className="h-7 w-7 translate-x-0.5 text-white" />
            </div>
          </button>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white/80">
          {formatTime(elapsed)} / {formatTime(totalDuration)}
        </div>

        {/* Speed badge */}
        <div className="absolute top-3 left-3 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white/80">
          {speed}×
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={totalDuration}
          value={elapsed}
          onChange={(e) => setElapsed(Number(e.target.value))}
          aria-label="Seek"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRewind}
            aria-label="Rewind 5 seconds"
            title="Rewind 5 s"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            size="icon"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 translate-x-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Select value={speed} onValueChange={handleSpeedChange}>
            <SelectTrigger className="h-8 w-[80px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAYBACK_SPEEDS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timestamp shortcut hint */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Current: <strong className="font-mono">{formatTime(elapsed)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Transcription Editor ────────────────────────────────────────────────────

function TranscriptionEditor() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const trimmed = text.trim();
  const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const charCount = text.length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlignLeft className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Transcription Editor</h2>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {wordCount} words · {charCount} chars
        </span>
      </div>

      {/* Editor area */}
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-xl border transition-all duration-200",
          isFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
        )}
      >
        {/* Placeholder shown when empty and unfocused */}
        {text === "" && !isFocused && (
          <div className="pointer-events-none absolute inset-0 flex flex-col gap-2 p-4 text-muted-foreground/50">
            <p className="text-sm">Start typing your transcription here…</p>
            <p className="text-xs">
              Tip: Use the player controls to play/pause and adjust speed while
              you type.
            </p>
          </div>
        )}
        <textarea
          className="h-full min-h-[320px] w-full resize-none bg-card p-4 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Transcription text"
          spellCheck
        />
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setText("")}
          disabled={text === ""}
        >
          Clear
        </Button>
        <Button size="sm" disabled={trimmed === ""}>
          Submit Transcription
        </Button>
      </div>
    </div>
  );
}

// ─── Transcription Workspace ─────────────────────────────────────────────────

export function TranscriptionWorkspace() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left – Media panel */}
      <section
        aria-label="Media player"
        className="dashboard-card rounded-xl border border-border bg-card p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="stat-icon-purple flex h-7 w-7 items-center justify-center rounded-lg">
            <Play className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-semibold">Media Player</h2>
        </div>
        <VideoPlayer />
      </section>

      {/* Right – Editor panel */}
      <section
        aria-label="Transcription editor"
        className="dashboard-card flex flex-col rounded-xl border border-border bg-card p-5"
      >
        <TranscriptionEditor />
      </section>
    </div>
  );
}
