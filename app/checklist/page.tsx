"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Circle, Clock3 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OrganicCard } from "@/components/OrganicCard";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import type { ChecklistItem, ChecklistStatus } from "@/types";
import { cn } from "@/lib/utils";

const statuses: ChecklistStatus[] = ["Belum", "Proses", "Selesai"];
type Filter = "Semua" | ChecklistStatus;

function statusIcon(status: ChecklistStatus) {
  if (status === "Selesai") return Check;
  if (status === "Proses") return Clock3;
  return Circle;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [filter, setFilter] = useState<Filter>("Semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const [source, setSource] = useState<"google" | "mock">("mock");

  async function loadData(refresh = false) {
    refresh ? setRefreshing(true) : setLoading(true);
    const response = await fetch("/api/checklist", { cache: "no-store" });
    const data = await response.json();
    setItems(data.items || []);
    setCanWrite(Boolean(data.canWrite && data.source === "google"));
    setSource(data.source);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => (filter === "Semua" ? items : items.filter((item) => item.status === filter)), [filter, items]);
  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
      const key = item.category || "Lainnya";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filtered]);
  const completed = items.filter((item) => item.status === "Selesai").length;
  const percent = items.length ? Math.round((completed / items.length) * 100) : 0;

  async function cycleStatus(item: ChecklistItem) {
    const next = statuses[(statuses.indexOf(item.status) + 1) % statuses.length];
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: next } : entry)));
    if (canWrite && item.rowIndex) {
      await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex: item.rowIndex, status: next })
      });
    }
  }

  return (
    <AppShell title="Persiapan Hari Ini" onRefresh={() => loadData(true)} refreshing={refreshing}>
      <div className="space-y-6">
        <OrganicCard className="p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-muted">Progress</p>
              <p className="mt-3 font-serif text-6xl leading-none">{percent}%</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{completed}/{items.length}</p>
              <p className="text-sm text-muted">tugas selesai</p>
            </div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-4 text-sm font-bold text-muted">{canWrite ? "Sinkron ke Google Sheets aktif" : "Mode lihat saja, perubahan disimpan lokal dulu"} {source === "mock" ? "(mock)" : ""}</p>
        </OrganicCard>

        <SegmentedTabs value={filter} options={["Semua", "Belum", "Proses", "Selesai"]} onChange={setFilter} />

        {loading ? (
          <div className="h-40 animate-pulse rounded-[2rem] bg-white/70" />
        ) : items.length === 0 ? (
          <OrganicCard className="p-8 text-center">
            <h2 className="font-serif text-4xl">Checklist kosong</h2>
            <p className="mt-3 text-muted">Tab Prep atau List Kebutuhan belum punya data yang bisa dibaca.</p>
          </OrganicCard>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <section key={category}>
                <h2 className="mb-3 text-lg font-black">{category}</h2>
                <div className="space-y-3">
                  {categoryItems.map((item) => {
                    const Icon = statusIcon(item.status);
                    return (
                      <button key={item.id} type="button" onClick={() => cycleStatus(item)} className="w-full text-left">
                        <OrganicCard className="p-4 shadow-sm">
                          <div className="flex gap-3">
                            <div
                              className={cn(
                                "grid h-11 w-11 shrink-0 place-items-center rounded-full",
                                item.status === "Selesai" ? "bg-success text-white" : item.status === "Proses" ? "bg-accent" : "bg-ink/8"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-black leading-snug">{item.item}</h3>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                                <span className="rounded-full bg-ink/8 px-2.5 py-1">{item.owner || "PIC belum diisi"}</span>
                                <span className="rounded-full bg-accent/30 px-2.5 py-1">{item.priority}</span>
                                <span className="rounded-full bg-white px-2.5 py-1">{item.status}</span>
                              </div>
                              {item.notes ? <p className="mt-3 text-sm text-muted">{item.notes}</p> : null}
                            </div>
                          </div>
                        </OrganicCard>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
