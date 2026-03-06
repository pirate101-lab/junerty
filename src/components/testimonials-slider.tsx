"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah K.",
    role: "Project Manager",
    quote:
      "SYNTHGRAPHIX transformed how our team handles tasks. The Kanban board is incredibly intuitive, and the analytics help us make better decisions.",
    stars: 5,
  },
  {
    name: "Michael O.",
    role: "Team Lead",
    quote:
      "The wallet and referral system is genius. My team stays motivated, and the M-Pesa integration makes everything seamless.",
    stars: 5,
  },
  {
    name: "Grace W.",
    role: "Freelancer",
    quote:
      "Finally, a task management tool that pays you back! The referral bonuses and clean interface make SYNTHGRAPHIX my daily driver.",
    stars: 5,
  },
  {
    name: "Daniel A.",
    role: "Startup Founder",
    quote:
      "We moved our entire workflow to SYNTHGRAPHIX and haven't looked back. The support team on WhatsApp is incredibly responsive too!",
    stars: 5,
  },
  {
    name: "Lucy M.",
    role: "Product Designer",
    quote:
      "The beautiful UI and seamless experience make SYNTHGRAPHIX a joy to use. It helps me stay focused and organized every day.",
    stars: 5,
  },
];

const AUTOPLAY_INTERVAL_MS = 6000;

export function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <div className="relative w-full">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm min-h-[240px] flex flex-col justify-between transition-all duration-500">
        <div>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: t.stars }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <p className="text-base leading-relaxed text-muted-foreground italic">
            &ldquo;{t.quote}&rdquo;
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
