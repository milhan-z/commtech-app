"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear, getWeekDays, getWeekOffsetForDate } from "@/lib/time";
import { cn } from "@/lib/utils";

interface WeekStripProps {
  /** Currently selected date as "YYYY-MM-DD" */
  selectedDate?: string;
  /** Auto-navigate the strip to this date's week (e.g. first event date from API) */
  centerDate?: string;
  /** Date used as "today", useful for ?now= testing */
  referenceDate?: Date;
  onSelect?: (date: string) => void;
}

export function WeekStrip({ selectedDate, centerDate, referenceDate, onSelect }: WeekStripProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Auto-navigate to the week containing centerDate when it first arrives
  useEffect(() => {
    if (centerDate) {
      setWeekOffset(getWeekOffsetForDate(centerDate, referenceDate));
    }
  }, [centerDate, referenceDate]);

  const days = getWeekDays(undefined, weekOffset, referenceDate);
  const centerDay = days[3];
  const monthLabel = formatMonthYear(centerDay.date);

  return (
    <div className="mb-6">
      {/* Month label + navigation */}
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setWeekOffset((w) => w - 1)}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/8 transition-colors"
          aria-label="Minggu sebelumnya"
        >
          <ChevronLeft className="h-4 w-4 text-muted" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold capitalize text-muted">{monthLabel}</span>
          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="rounded-full bg-ink/8 px-2.5 py-0.5 text-[10px] font-black text-ink transition-colors hover:bg-ink/15"
            >
              Hari ini
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setWeekOffset((w) => w + 1)}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/8 transition-colors"
          aria-label="Minggu berikutnya"
        >
          <ChevronRight className="h-4 w-4 text-muted" />
        </button>
      </div>

      {/* Day strip */}
      <div className="flex items-end justify-between">
        {days.map((day) => {
          const dateStr = day.date.toLocaleDateString("en-CA");
          const isSelected = selectedDate === dateStr;
          const isActive = isSelected || (day.isToday && !selectedDate && weekOffset === 0);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelect?.(dateStr)}
              className="flex flex-1 flex-col items-center gap-1 focus:outline-none"
            >
              <span
                className={cn(
                  "text-[10px] font-semibold capitalize transition-colors",
                  isActive ? "text-ink" : day.isToday ? "text-accent font-black" : "text-muted"
                )}
              >
                {day.isToday ? "Hari ini" : day.dayShort}
              </span>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-all duration-150",
                  isActive
                    ? "bg-ink text-white shadow-md scale-110"
                    : day.isToday
                    ? "ring-2 ring-ink/30 text-ink"
                    : "text-ink/50 hover:bg-ink/8"
                )}
              >
                {day.dayNum}
              </div>
              {/* today dot when viewing another week */}
              {day.isToday && !isActive ? (
                <span className="h-1 w-1 rounded-full bg-accent" />
              ) : (
                <span className="h-1 w-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
