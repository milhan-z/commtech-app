const DEFAULT_TZ = process.env.APP_TIMEZONE || "Asia/Jakarta";

export function parseExcelTime(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  const raw = String(value).trim();
  if (!raw) return undefined;
  const formulaTime = raw.match(/TIME\(\s*([0-9]*)\s*,\s*([0-9]+)\s*,?\s*([0-9]*)\s*\)/i);
  if (formulaTime) return undefined;
  const match = raw.match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return undefined;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function formatDatePill(date = new Date(), timeZone = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date);
}

export function toJakartaDateTime(date: string | undefined, time: string | undefined): Date | undefined {
  if (!date || !time) return undefined;
  return new Date(`${date}T${time}:00+07:00`);
}

export function getNowFromParam(now?: string | null): Date {
  if (now) {
    const parsed = new Date(now);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export function minutesBetween(start?: string, end?: string): number | undefined {
  if (!start || !end) return undefined;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;
  if (endMinutes < startMinutes) endMinutes += 24 * 60;
  return endMinutes - startMinutes;
}

export function compareEventToNow(date: string | undefined, start?: string, end?: string, now = new Date()) {
  const startDate = toJakartaDateTime(date, start);
  const endDate = toJakartaDateTime(date, end);
  if (!startDate || !endDate) return "upcoming" as const;
  if (now >= startDate && now <= endDate) return "live" as const;
  if (now > endDate) return "done" as const;
  return "upcoming" as const;
}
