import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string): string {
  if (!time) return "";
  if (time.includes("AM") || time.includes("PM")) return time;
  if (!time.includes(":")) return time;
  const parts = time.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (isNaN(hours) || isNaN(minutes)) return time;
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Parses a "YYYY-MM-DD" date-only string as local time, avoiding the
// UTC-midnight off-by-one-day shift that `new Date(dateStr)` causes.
export function parseLocalDate(date: Date | string): Date {
  if (typeof date !== "string") return date;
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date | string): string {
  const d = parseLocalDate(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
