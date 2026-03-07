import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Build a 7-element array (oldest → newest) of labeled day buckets. */
export function buildWeekBuckets(): { day: string; dateStr: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * MS_PER_DAY);
    return { day: DAY_NAMES[d.getDay()], dateStr: d.toDateString() };
  });
}

