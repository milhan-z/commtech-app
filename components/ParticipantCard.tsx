import { Flag, GraduationCap } from "lucide-react";
import type { Participant } from "@/types";
import { OrganicCard } from "@/components/OrganicCard";

export function ParticipantCard({ participant, onClick }: { participant: Participant; onClick: () => void }) {
  return (
    <OrganicCard as="button" onClick={onClick} className="w-full p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-black leading-tight">{participant.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Flag className="h-4 w-4" />
            {participant.country || "Negara belum diisi"}
          </p>
          {participant.university ? (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="line-clamp-2">{participant.university}</span>
            </p>
          ) : null}
        </div>
        {participant.group ? (
          <span className="shrink-0 rounded-full bg-accent/30 px-3 py-1 text-xs font-black">{participant.group}</span>
        ) : null}
      </div>
    </OrganicCard>
  );
}
