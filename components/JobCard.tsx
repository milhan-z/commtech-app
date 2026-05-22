import { BriefcaseBusiness, FileText } from "lucide-react";
import type { JobAssignment } from "@/types";
import { cn } from "@/lib/utils";

export function JobCard({ job, active }: { job: JobAssignment; active?: boolean }) {
  return (
    <article
      className={cn(
        "rounded-[1.5rem] border bg-white p-4 shadow-sm",
        active ? "border-accent bg-[#FFF7DF]" : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-snug">{job.job}</h3>
          {job.volunteers.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.volunteers.map((name) => (
                <span key={name} className="rounded-full bg-ink/8 px-2.5 py-1 text-xs font-bold text-ink">
                  {name}
                </span>
              ))}
            </div>
          ) : job.volunteer ? (
            <p className="mt-1 text-sm text-muted">{job.volunteer}</p>
          ) : null}
          {job.resource ? (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-muted">
              <FileText className="h-4 w-4" />
              {job.resource}
            </p>
          ) : null}
          {job.notes ? <p className="mt-2 text-sm leading-relaxed text-muted">{job.notes}</p> : null}
        </div>
      </div>
    </article>
  );
}
