"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { src: "/slide-1.jpg", alt: "SYNTHGRAPHIX Slide 1" },
  { src: "/slide-2.jpg", alt: "SYNTHGRAPHIX Slide 2" },
  { src: "/slide-3.jpg", alt: "SYNTHGRAPHIX Slide 3" },
  { src: "/slide-4.jpg", alt: "SYNTHGRAPHIX Slide 4" },
];

const AUTO_PLAY_MS = 2000;

export function DashboardSlider() {
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const loadedCount = useRef(0);

  useEffect(() => {
    let cancelled = false;
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
      img.onload = img.onerror = () => {
        loadedCount.current++;
        if (!cancelled && loadedCount.current >= SLIDES.length) setReady(true);
      };
      if (img.complete) loadedCount.current++;
    });
    if (loadedCount.current >= SLIDES.length) setReady(true);
    return () => { cancelled = true; };
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [ready, next]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border">
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
              !ready && i === 0 ? "opacity-100" : i === current ? "opacity-100" : "opacity-0"
            )}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
