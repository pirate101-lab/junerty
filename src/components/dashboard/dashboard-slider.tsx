"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { src: "/slide-1.jpg", alt: "SYNTHGRAPHIX Slide 1" },
  { src: "/slide-2.jpg", alt: "SYNTHGRAPHIX Slide 2" },
  { src: "/slide-3.jpg", alt: "SYNTHGRAPHIX Slide 3" },
  { src: "/slide-4.jpg", alt: "SYNTHGRAPHIX Slide 4" },
];

const AUTO_PLAY_MS = 1000;

export function DashboardSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const loadedCount = useRef(0);

  // Preload all images before starting the slider
  useEffect(() => {
    let cancelled = false;
    const images = SLIDES.map((slide) => {
      const img = new Image();
      img.src = slide.src;
      img.onload = img.onerror = () => {
        loadedCount.current++;
        if (!cancelled && loadedCount.current >= SLIDES.length) {
          setReady(true);
        }
      };
      // If already cached by browser, onload fires synchronously
      if (img.complete) {
        loadedCount.current++;
      }
      return img;
    });
    if (loadedCount.current >= SLIDES.length) setReady(true);
    return () => { cancelled = true; };
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  // Only auto-play after all images are loaded
  useEffect(() => {
    if (paused || !ready) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [paused, ready, next]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Preload hints in DOM */}
      {SLIDES.map((s) => (
        <link key={s.src} rel="preload" as="image" href={s.src} />
      ))}

      <div className="relative aspect-[16/7] sm:aspect-[16/6] w-full bg-zinc-900">
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding={i === 0 ? "sync" : "async"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              ready ? "transition-opacity duration-700" : "",
              !ready && i === 0
                ? "opacity-100"
                : i === current
                  ? "opacity-100"
                  : "opacity-0"
            )}
            draggable={false}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
