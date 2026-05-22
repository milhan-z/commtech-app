"use client";

import { getWeekDays } from "@/lib/time";
import { cn } from "@/lib/utils";

interface WeekStripProps {
  selectedDate?: string; // "YYYY-MM-DD"
  onSelect?: (date: string) => void;
}

export function WeekStrip({ selectedDate, onSelect }: WeekStripProps) {
  const days = getWeekDays();

  return (
    <div className="mb-6 flex items-end justify-between">
      {days.map((day) => {
        const dateStr = day.date.toLocaleDateString("en-CA"); // YYYY-MM-DD
        const isSelected = selectedDate === dateStr;
        const isActive = isSelected || (day.isToday && !selectedDate);

        return (
          <button
            key={dateStr}
            type="button"
            onClick={() => onSelect?.(dateStr)}
            className="flex flex-1 flex-col items-center gap-1 focus:outline-none"
          >
            <span
              className={cn(
                "text-[11px] font-semibold capitalize transition-colors",
                isActive ? "text-ink" : "text-muted"
              )}
            >
              {day.isToday ? "Hari ini" : day.dayShort}
            </span>
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-all",
                isActive
                  ? "bg-ink text-white shadow-md scale-110"
                  : "text-ink/50 hover:bg-ink/8"
              )}
            >
              {day.dayNum}
            </div>
            {/* dot indicator for today when another date is selected */}
            {day.isToday && selectedDate && selectedDate !== dateStr ? (
              <span className="h-1 w-1 rounded-full bg-accent" />
            ) : (
              <span className="h-1 w-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
