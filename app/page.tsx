"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, MapPin, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DetailDrawer } from "@/components/DetailDrawer";
import { JobCard } from "@/components/JobCard";
import { OrganicCard } from "@/components/OrganicCard";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { StatusBadge } from "@/components/StatusBadge";
import { TimelineCard } from "@/components/TimelineCard";
import { WeekStrip } from "@/components/WeekStrip";
import { compareEventToNow, getNowFromParam } from "@/lib/time";
import type { EventStatus, RundownEvent, RundownPayload } from "@/types";

type Filter = "Semua" | "Tugasku" | "Lokasi" | "PIC";

function timeRange(event?: RundownEvent) {
  if (!event) return "--:--";
  return `${event.startTime || "--:--"} - ${event.endTime || "--:--"}`;
}

function includesPerson(event: RundownEvent, name: string) {
  if (!name) return true;
  const haystack = [event.pic, event.agenda, ...event.jobs.flatMap((job) => [job.volunteer, job.job])].join(" ").toLowerCase();
  return haystack.includes(name.toLowerCase());
}

function AgendaDetail({ event }: { event: RundownEvent }) {
  return (
    <div className="space-y-4">
      <OrganicCard className="p-4 shadow-sm">
        <p className="text-sm font-black text-muted">{timeRange(event)}</p>
        <h3 className="mt-2 text-2xl font-black leading-tight">{event.agenda}</h3>
        <div className="mt-4 space-y-2 text-sm text-muted">
          {event.location ? <p>Lokasi: {event.location}</p> : null}
          {event.pic ? <p>PIC: {event.pic}</p> : null}
          {event.speaker ? <p>Speaker: {event.speaker}</p> : null}
          {event.notes ? <p>Catatan: {event.notes}</p> : null}
        </div>
      </OrganicCard>
      {event.children.length ? (
        <section>
          <h4 className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-muted">Sub-agenda</h4>
          <div className="space-y-2">
            {event.children.map((child) => (
              <TimelineCard key={child.id} event={child} compact />
            ))}
          </div>
        </section>
      ) : null}
      <section>
        <h4 className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-muted">Daftar tugas</h4>
        <div className="space-y-3">
          {event.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  const [payload, setPayload] = useState<RundownPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<RundownEvent | null>(null);
  const [filter, setFilter] = useState<Filter>("Semua");
  const [selectedName, setSelectedName] = useState("");
  const [expandedToday, setExpandedToday] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const todayStr = typeof window !== "undefined"
    ? new Date().toLocaleDateString("en-CA")
    : undefined;

  const nowParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("now") : null;
  const now = getNowFromParam(nowParam);

  async function loadData(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const query = typeof window !== "undefined" ? window.location.search : "";
    const response = await fetch(`/api/rundown${query}`, { cache: "no-store" });
    const data = (await response.json()) as RundownPayload;
    setPayload(data);
    // Auto-select the current/first event date so filter is immediately in sync
    if (!selectedDate) {
      const autoDate = data.current?.date || data.events[0]?.date;
      if (autoDate) setSelectedDate(autoDate);
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = payload?.current;
  const status: EventStatus = current ? compareEventToNow(current.date, current.startTime, current.endTime, now) : "done";
  // The first event date — used to auto-center WeekStrip
  const firstEventDate = current?.date || payload?.events[0]?.date;
  // Active date drives the filter: explicit selection wins, else first event date
  const activeDate = selectedDate || firstEventDate;
  const todayEvents = useMemo(() => {
    const list = (payload?.events || []).filter((event) => event.date === activeDate);
    if (filter === "Tugasku") return list.filter((event) => includesPerson(event, selectedName));
    if (filter === "Lokasi") return list.filter((event) => event.location);
    if (filter === "PIC") return list.filter((event) => event.pic);
    return list;
  }, [payload, activeDate, filter, selectedName]);

  const activeChild = current?.children.find((child) => compareEventToNow(child.date, child.startTime, child.endTime, now) === "live");
  const visibleEvents = expandedToday ? todayEvents : todayEvents.slice(0, 5);

  const pageTitle = activeDate && activeDate !== todayStr
    ? new Date(activeDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
    : "Hari ini";

  return (
    <AppShell title={pageTitle} onRefresh={() => loadData(true)} refreshing={refreshing}>
      <WeekStrip
        selectedDate={selectedDate}
        centerDate={firstEventDate}
        onSelect={setSelectedDate}
      />
      {loading ? (
        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-[2.5rem] bg-white/70" />
          <div className="h-24 animate-pulse rounded-[2rem] bg-white/70" />
        </div>
      ) : !current ? (
        <OrganicCard className="p-8 text-center">
          <h2 className="font-serif text-4xl">Hari ini selesai</h2>
          <p className="mt-3 text-muted">Belum ada agenda yang bisa ditampilkan dari sumber data.</p>
        </OrganicCard>
      ) : (
        <div className="space-y-7">
          <OrganicCard className="rounded-blob px-6 py-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <span className="rounded-full bg-ink px-4 py-2 text-sm font-black text-white">{timeRange(current)}</span>
              <StatusBadge status={status} />
            </div>
            <h2 className="font-serif text-5xl leading-[0.95]">{current.agenda}</h2>
            <div className="mt-6 space-y-2 text-muted">
              {current.location ? (
                <p className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {current.location}
                </p>
              ) : null}
              {current.pic ? (
                <p className="flex items-center gap-2">
                  <UserRound className="h-5 w-5" />
                  PIC: {current.pic}
                </p>
              ) : null}
              {current.speaker ? <p>Speaker: {current.speaker}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setSelected(current)}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white"
            >
              Detail lengkap
              <ChevronRight className="h-4 w-4" />
            </button>
          </OrganicCard>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">Job saat ini</h2>
              {payload?.source === "mock" ? <span className="rounded-full bg-accent/30 px-3 py-1 text-xs font-bold">Mock</span> : null}
            </div>
            <div className="space-y-3">
              {(activeChild?.jobs.length ? activeChild.jobs : current.jobs).map((job) => (
                <JobCard key={job.id} job={job} active={activeChild?.jobs.some((item) => item.id === job.id)} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3">
            {payload?.previous ? (
              <TimelineCard event={payload.previous} compact onClick={() => setSelected(payload.previous!)} />
            ) : null}
            {payload?.next ? <TimelineCard event={payload.next} compact onClick={() => setSelected(payload.next!)} /> : null}
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-black">Rundown hari ini</h2>
              <p className="mt-1 text-sm text-muted">Tap kartu untuk melihat detail tugas dan resource.</p>
            </div>
            <SegmentedTabs value={filter} options={["Semua", "Tugasku", "Lokasi", "PIC"]} onChange={setFilter} />
            {filter === "Tugasku" ? (
              <select
                value={selectedName}
                onChange={(event) => setSelectedName(event.target.value)}
                className="w-full rounded-full border border-border bg-white px-4 py-3 font-bold outline-none"
              >
                <option value="">Pilih nama panitia</option>
                {payload?.allNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            ) : null}
            <div className="space-y-3">
              {visibleEvents.map((event) => (
                <TimelineCard key={event.id} event={event} onClick={() => setSelected(event)} />
              ))}
            </div>
            {todayEvents.length > 5 ? (
              <button
                type="button"
                onClick={() => setExpandedToday((value) => !value)}
                className="mx-auto flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white"
              >
                {expandedToday ? "Ringkas" : "Lihat rundown lengkap hari ini"}
                <ChevronDown className="h-4 w-4" />
              </button>
            ) : null}
          </section>
        </div>
      )}

      <DetailDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} title="Detail Agenda">
        {selected ? <AgendaDetail event={selected} /> : null}
      </DetailDrawer>
    </AppShell>
  );
}
