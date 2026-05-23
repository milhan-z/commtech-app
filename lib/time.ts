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
    const normalized = now.includes(" ") ? now.replace(" ", "+") : now;
    const parsed = new Date(normalized);
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

export interface WeekDay {
  date: Date;
  dayShort: string; // "Sen"
  dayNum: number;   // 22
  isToday: boolean;
}

// weekOffset: 0 = current week window, -1 = previous week, +1 = next week
export function getWeekDays(timeZone = DEFAULT_TZ, weekOffset = 0, baseDate = new Date()): WeekDay[] {
  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone }).format(baseDate);

  const days: WeekDay[] = [];
  const centerOffset = weekOffset * 7; // shift center day by N weeks
  for (let offset = -3; offset <= 3; offset++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + centerOffset + offset);
    const dayShort = new Intl.DateTimeFormat("id-ID", { timeZone, weekday: "short" }).format(d);
    const dayNum = Number(new Intl.DateTimeFormat("en-CA", { timeZone, day: "numeric" }).format(d));
    const dateStr = new Intl.DateTimeFormat("en-CA", { timeZone }).format(d);
    days.push({ date: d, dayShort, dayNum, isToday: dateStr === todayStr });
  }
  return days;
}

export function formatMonthYear(date: Date, timeZone = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat("id-ID", { timeZone, month: "long", year: "numeric" }).format(date);
}

/** Returns the weekOffset needed so that WeekStrip centers near the given YYYY-MM-DD date */
export function getWeekOffsetForDate(dateStr: string, baseDate = new Date()): number {
  const target = new Date(dateStr + "T12:00:00");
  const diffDays = Math.round((target.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.round(diffDays / 7);
}
