"use client";

import { MapPin } from "lucide-react";
import type { RundownEvent } from "@/types";
import { OrganicCard } from "@/components/OrganicCard";

export function TimelineCard({
  event,
  compact,
  onClick
}: {
  event: RundownEvent;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="transition-transform duration-200 active:scale-[0.98]">
      <OrganicCard as="button" onClick={onClick} className="w-full p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="w-16 shrink-0 text-sm font-black leading-tight">
            <span>{event.startTime || "--:--"}</span>
            <span className="block text-muted">{event.endTime || "--:--"}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-black leading-snug">{event.agenda}</h3>
            {event.location ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </p>
            ) : null}
            {!compact && event.children.length ? (
              <p className="mt-2 text-xs font-bold text-muted">{event.children.length} sub-agenda</p>
            ) : null}
          </div>
        </div>
      </OrganicCard>
    </div>
  );
}
