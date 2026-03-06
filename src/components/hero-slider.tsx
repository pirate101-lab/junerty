"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    title: "Manage Tasks Effortlessly",
    subtitle: "Kanban boards, list views, priorities & due dates — all in one place",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
  },
  {
    title: "Earn While You Work",
    subtitle: "Built-in wallet, M-Pesa integration & referral bonuses",
    gradient: "from-purple-600 via-pink-600 to-rose-600",
  },
  {
    title: "Collaborate & Grow",
    subtitle: "Real-time analytics, team assignments & progress tracking",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full">
      {/* Slides */}
      <div className="relative overflow-hidden rounded-2xl">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "transition-all duration-700 ease-in-out",
              i === current
                ? "relative opacity-100 translate-x-0"
                : "absolute inset-0 opacity-0 translate-x-8"
            )}
          >
            <div
              className={cn(
                "rounded-2xl bg-gradient-to-r p-8 sm:p-12 text-white",
                slide.gradient
              )}
            >
              <h3 className="text-2xl sm:text-3xl font-bold">{slide.title}</h3>
              <p className="mt-3 text-base sm:text-lg text-white/80 max-w-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
