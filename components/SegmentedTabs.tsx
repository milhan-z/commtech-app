"use client";

import { cn } from "@/lib/utils";

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className
}: {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex rounded-full bg-[#E8E4DC] p-1", className)}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "min-h-10 flex-1 rounded-full px-3 text-sm font-bold text-ink/70 transition",
              active && "bg-white text-ink shadow-sm"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
