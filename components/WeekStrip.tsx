"use client";

import { getWeekDays } from "@/lib/time";
import { cn } from "@/lib/utils";

export function WeekStrip() {
  const days = getWeekDays();

  return (
    <div className="mb-6 flex items-end justify-between">
      {days.map((day) => (
        <div
          key={day.date.toISOString()}
          className="flex flex-1 flex-col items-center gap-1"
        >
          <span
            className={cn(
              "text-[11px] font-semibold capitalize",
              day.isToday ? "text-ink" : "text-muted"
            )}
          >
            {day.isToday ? "Hari ini" : day.dayShort}
          </span>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-all",
              day.isToday
                ? "bg-ink text-white shadow-md"
                : "text-ink/60"
            )}
          >
            {day.dayNum}
          </div>
        </div>
      ))}
    </div>
  );
}
