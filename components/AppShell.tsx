"use client";

import { RefreshCw } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { formatDatePill } from "@/lib/time";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  title,
  eyebrow = "CommTECH Insight 2026",
  onRefresh,
  refreshing,
  rightAction,
  date
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  rightAction?: React.ReactNode;
  date?: Date;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-32 pt-7">
      <header className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-black text-white">
            CI
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
            <div className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-sm">
              {formatDatePill(date)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rightAction}
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white shadow-sm"
              aria-label="Refresh data"
            >
              <RefreshCw className={cn("h-5 w-5", refreshing && "animate-spin")} />
            </button>
          ) : null}
        </div>
      </header>
      {title ? <h1 className="mb-6 font-serif text-5xl leading-[0.95] tracking-normal">{title}</h1> : null}
      {children}
      <BottomNav />
    </main>
  );
}
