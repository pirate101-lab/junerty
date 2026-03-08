"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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
    const markSlideLoaded = () => {
      loadedCount.current++;
      if (loadedCount.current >= SLIDES.length && !cancelled) {
        window.setTimeout(() => {
          if (!cancelled) setReady(true);
        }, 0);
      }
    };

    SLIDES.forEach((slide) => {
      const img = new Image();
      let counted = false;
      const handleLoad = () => {
        if (counted) return;
        counted = true;
        markSlideLoaded();
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
      img.src = slide.src;
      if (img.complete) handleLoad();
    });
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
        <div
          className="flex h-full"
          style={{
            width: `${SLIDES.length * 100}%`,
            transform: `translateX(-${current * (100 / SLIDES.length)}%)`,
            transition: ready ? "transform 0.6s ease-in-out" : "none",
          }}
        >
          {SLIDES.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding={i === 0 ? "sync" : "async"}
              className="h-full object-cover"
              style={{ width: `${100 / SLIDES.length}%` }}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
