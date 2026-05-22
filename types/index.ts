export type EventStatus = "live" | "upcoming" | "done";
export type ChecklistStatus = "Belum" | "Proses" | "Selesai";
export type Priority = "Low" | "Medium" | "High";

export type SheetCell = string | number | boolean | null | undefined;
export type SheetRow = SheetCell[];

export interface JobAssignment {
  id: string;
  job: string;
  volunteer?: string;
  volunteers: string[];
  resource?: string;
  notes?: string;
  startTime?: string;
  endTime?: string;
}

export interface RundownEvent {
  id: string;
  dayLabel: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  agenda: string;
  speaker?: string;
  location?: string;
  pic?: string;
  jobs: JobAssignment[];
  notes?: string;
  children: RundownEvent[];
  isParent?: boolean;
}

export interface ChecklistItem {
  id: string;
  rowIndex?: number;
  day?: string;
  date?: string;
  category?: string;
  item: string;
  owner?: string;
  status: ChecklistStatus;
  priority: Priority;
  notes?: string;
}

export interface Participant {
  id: string;
  rowIndex?: number;
  name: string;
  nickname?: string;
  university?: string;
  country?: string;
  email?: string;
  phone?: string;
  group?: string;
  hotel?: string;
  room?: string;
  arrival?: string;
  departure?: string;
  notes?: string;
  important?: string;
  details: Record<string, string>;
}

export interface RundownPayload {
  events: RundownEvent[];
  current?: RundownEvent;
  previous?: RundownEvent;
  next?: RundownEvent;
  allNames: string[];
  source: "google" | "mock";
  refreshedAt: string;
}
