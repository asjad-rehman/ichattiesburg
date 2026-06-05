"use client";

import { useState, useEffect } from "react";
import { PrayerTimes } from "@/lib/prayer-times";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PRAYER_NAMES = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_KEYS: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentPrayer(times: PrayerTimes): number {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const minutes = PRAYER_KEYS.map((k) => timeToMinutes(times[k] || "0:0"));
  let current = -1;
  for (let i = 0; i < minutes.length; i++) {
    if (nowMin >= minutes[i]) current = i;
  }
  return current;
}

export default function PrayerTimesWidget({ prayerTimes }: { prayerTimes: PrayerTimes }) {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [nextIdx, setNextIdx] = useState(0);

  useEffect(() => {
    const update = () => {
      const cur = getCurrentPrayer(prayerTimes);
      setCurrentIdx(cur);
      setNextIdx(cur === PRAYER_KEYS.length - 1 ? 0 : cur + 1);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {PRAYER_NAMES.map((name, i) => {
        const key = PRAYER_KEYS[i];
        const isCurrent = i === currentIdx;
        const isNext = i === nextIdx;
        return (
          <div
            key={name}
            className={cn(
              "relative rounded-xl p-5 text-center border transition-all",
              isCurrent
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : isNext
                ? "bg-primary/10 border-primary/30 text-foreground"
                : "bg-card border-border text-foreground"
            )}
          >
            {isCurrent && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                NOW
              </div>
            )}
            {isNext && !isCurrent && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/30">
                NEXT
              </div>
            )}
            <div className={cn("text-xs font-medium uppercase tracking-wider mb-2",
              isCurrent ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {name}
            </div>
            <div className="text-xl font-bold">{formatTime(prayerTimes[key] || "")}</div>
          </div>
        );
      })}
    </div>
  );
}
