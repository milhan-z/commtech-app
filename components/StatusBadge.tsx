import { CheckCircle2, Clock3, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventStatus } from "@/types";

const labels: Record<EventStatus, string> = {
  live: "Sedang berlangsung",
  upcoming: "Akan datang",
  done: "Selesai"
};

export function StatusBadge({ status }: { status: EventStatus }) {
  const Icon = status === "live" ? Radio : status === "done" ? CheckCircle2 : Clock3;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        status === "live" && "bg-success/15 text-[#1d7c39]",
        status === "upcoming" && "bg-accent/30 text-[#8a5a00]",
        status === "done" && "bg-ink/10 text-muted"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {labels[status]}
    </span>
  );
}
