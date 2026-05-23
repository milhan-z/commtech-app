import type { JobAssignment, RundownEvent, SheetRow } from "@/types";
import { minutesBetween, parseExcelTime, toJakartaDateTime } from "@/lib/time";
import { splitPeople, text } from "@/lib/utils";

const monthMap: Record<string, string> = {
  jan: "01",
  january: "01",
  januari: "01",
  feb: "02",
  february: "02",
  februari: "02",
  mar: "03",
  march: "03",
  maret: "03",
  apr: "04",
  april: "04",
  may: "05",
  mei: "05",
  jun: "06",
  june: "06",
  juni: "06",
  jul: "07",
  july: "07",
  juli: "07",
  aug: "08",
  august: "08",
  agustus: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  oktober: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
  desember: "12"
};

function parseDay(rowText: string): { label: string; date?: string } | null {
  const lower = rowText.toLowerCase();
  if (!/\bday\s*\d+/.test(lower) && !/\d{1,2}\s+[a-zA-Z]+\s+20\d{2}/.test(lower)) {
    return null;
  }

  const dayLabel = rowText.match(/day\s*\d+/i)?.[0] || rowText;
  const dateMatch = rowText.match(/(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})/);
  if (!dateMatch) return { label: dayLabel.trim() };
  const month = monthMap[dateMatch[2].toLowerCase()];
  if (!month) return { label: dayLabel.trim() };
  return {
    label: `${dayLabel.trim()} (${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]})`,
    date: `${dateMatch[3]}-${month}-${dateMatch[1].padStart(2, "0")}`
  };
}

function isHeaderRow(row: SheetRow): boolean {
  const joined = row.map(text).join(" ").toLowerCase();
  return joined.includes("start") && joined.includes("end");
}

function hasJob(row: SheetRow): boolean {
  return Boolean(text(row[7]) || text(row[8]) || text(row[9]) || text(row[10]));
}

function timeToMinutes(time?: string): number | undefined {
  if (!time) return undefined;
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;
  return hours * 60 + minutes;
}

function shouldStartParent(row: SheetRow, startTime?: string, endTime?: string, durationMinutes?: number): boolean {
  return Boolean(startTime && endTime && text(row[3]) && !hasJob(row) && durationMinutes && durationMinutes >= 45);
}

function belongsToParent(parent: RundownEvent | undefined, event: RundownEvent): parent is RundownEvent {
  if (!parent || !parent.date || parent.date !== event.date || !event.startTime) return false;
  const eventStart = timeToMinutes(event.startTime);
  const parentStart = timeToMinutes(parent.startTime);
  const parentEnd = timeToMinutes(parent.endTime);
  if (eventStart === undefined || parentStart === undefined || parentEnd === undefined) return false;

  const startsNearParent = eventStart >= parentStart - 45;
  const startsBeforeParentEnds = eventStart < parentEnd;
  return startsNearParent && startsBeforeParentEnds && event.id !== parent.id;
}

function makeJob(row: SheetRow, eventId: string, index: number): JobAssignment | null {
  const job = text(row[7]);
  const volunteer = text(row[8]);
  const resource = text(row[9]);
  const notes = text(row[10]);
  if (!job && !volunteer && !resource && !notes) return null;
  return {
    id: `${eventId}-job-${index}`,
    job: job || "Tugas pendukung",
    volunteer,
    volunteers: splitPeople(volunteer),
    resource,
    notes,
    startTime: parseExcelTime(row[0]),
    endTime: parseExcelTime(row[1])
  };
}

export function parseRundownRows(rows: SheetRow[]): RundownEvent[] {
  const events: RundownEvent[] = [];
  let currentDay = "CommTECH Insight 2026";
  let currentDate: string | undefined;
  let lastEvent: RundownEvent | undefined;
  let activeParent: RundownEvent | undefined;

  rows.forEach((row, rowIndex) => {
    const firstCell = text(row[0]);
    const joined = row.map(text).filter(Boolean).join(" ");
    const day = parseDay(joined || firstCell);

    if (day && !parseExcelTime(row[0])) {
      currentDay = day.label;
      currentDate = day.date;
      lastEvent = undefined;
      activeParent = undefined;
      return;
    }

    if (isHeaderRow(row)) return;

    const startTime = parseExcelTime(row[0]);
    const endTime = parseExcelTime(row[1]);
    const agenda = text(row[3]);
    const speaker = text(row[4]);
    const location = text(row[5]);
    const pic = text(row[6]);
    const notes = text(row[10]);
    const durationMinutes = Number(row[2]) || minutesBetween(startTime, endTime);

    if ((startTime || endTime || agenda) && agenda) {
      const eventStartMinutes = timeToMinutes(startTime);
      const activeParentEndMinutes = timeToMinutes(activeParent?.endTime);
      if (
        activeParent &&
        (activeParent.date !== currentDate ||
          (eventStartMinutes !== undefined &&
            activeParentEndMinutes !== undefined &&
            eventStartMinutes >= activeParentEndMinutes))
      ) {
        activeParent = undefined;
      }

      const id = `rd-${rowIndex + 1}`;
      const event: RundownEvent = {
        id,
        dayLabel: currentDay,
        date: currentDate,
        startTime: startTime || lastEvent?.startTime,
        endTime: endTime || lastEvent?.endTime,
        durationMinutes,
        agenda,
        speaker,
        location: location || activeParent?.location,
        pic: pic || activeParent?.pic,
        notes,
        jobs: [],
        children: []
      };

      const job = makeJob(row, id, 0);
      if (job) event.jobs.push(job);

      if (belongsToParent(activeParent, event) && event.agenda !== activeParent.agenda) {
        activeParent.isParent = true;
        activeParent.children.push(event);
      }

      events.push(event);
      lastEvent = event;

      if (shouldStartParent(row, startTime, endTime, durationMinutes)) {
        activeParent = event;
      } else if (activeParent && !belongsToParent(activeParent, event)) {
        activeParent = undefined;
      }
      return;
    }

    if (lastEvent && hasJob(row)) {
      const job = makeJob(row, lastEvent.id, lastEvent.jobs.length);
      if (job) lastEvent.jobs.push(job);
    }
  });

  return groupJobsWithAgenda(events);
}

export function groupJobsWithAgenda(events: RundownEvent[]): RundownEvent[] {
  return events.map((event) => ({
    ...event,
    jobs: event.jobs.length
      ? event.jobs
      : [
          {
            id: `${event.id}-job-default`,
            job: "Koordinasi agenda",
            volunteer: event.pic,
            volunteers: splitPeople(event.pic),
            notes: event.notes
          }
        ],
    children: event.children.map((child) => ({
      ...child,
      jobs: child.jobs.length
        ? child.jobs
        : [
            {
              id: `${child.id}-job-default`,
              job: "Koordinasi sub-agenda",
              volunteer: child.pic || event.pic,
              volunteers: splitPeople(child.pic || event.pic),
              notes: child.notes
            }
          ]
    }))
  }));
}

export function detectCurrentEvent(events: RundownEvent[], now: Date) {
  const sorted = [...events]
    .filter((event) => event.date && event.startTime)
    .sort((a, b) => {
      const aDate = toJakartaDateTime(a.date, a.startTime)?.getTime() || 0;
      const bDate = toJakartaDateTime(b.date, b.startTime)?.getTime() || 0;
      return aDate - bDate;
    });

  const current = sorted.find((event) => {
    const start = toJakartaDateTime(event.date, event.startTime);
    const end = toJakartaDateTime(event.date, event.endTime);
    return start && end && now >= start && now <= end;
  });

  const next = sorted.find((event) => {
    const start = toJakartaDateTime(event.date, event.startTime);
    return start && start > now;
  });

  const previous = [...sorted].reverse().find((event) => {
    const end = toJakartaDateTime(event.date, event.endTime);
    return end && end < now;
  });

  return {
    current: current || next,
    previous,
    next: current ? next : sorted.find((event) => event.id !== next?.id && (toJakartaDateTime(event.date, event.startTime)?.getTime() || 0) > now.getTime())
  };
}

export function getAllRundownNames(events: RundownEvent[]): string[] {
  const names = new Set<string>();
  events.forEach((event) => {
    splitPeople(event.pic).forEach((name) => names.add(name));
    event.jobs.forEach((job) => job.volunteers.forEach((name) => names.add(name)));
  });
  return [...names].sort((a, b) => a.localeCompare(b));
}
