"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MapPin, Phone, UsersRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DetailDrawer } from "@/components/DetailDrawer";
import { OrganicCard } from "@/components/OrganicCard";
import { ParticipantCard } from "@/components/ParticipantCard";
import { SearchInput } from "@/components/SearchInput";
import type { Participant } from "@/types";

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [group, setGroup] = useState("");
  const [university, setUniversity] = useState("");
  const [selected, setSelected] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData(refresh = false) {
    refresh ? setRefreshing(true) : setLoading(true);
    const response = await fetch("/api/participants", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setParticipants(data.participants || []);
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const countries = useMemo(() => unique(participants.map((item) => item.country || "")), [participants]);
  const groups = useMemo(() => unique(participants.map((item) => item.group || "")), [participants]);
  const universities = useMemo(() => unique(participants.map((item) => item.university || "")), [participants]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return participants.filter((participant) => {
      const haystack = [participant.name, participant.nickname, participant.country, participant.university, participant.group]
        .join(" ")
        .toLowerCase();
      return (
        (!needle || haystack.includes(needle)) &&
        (!country || participant.country === country) &&
        (!group || participant.group === group) &&
        (!university || participant.university === university)
      );
    });
  }, [participants, query, country, group, university]);

  return (
    <AppShell title="Peserta" onRefresh={() => loadData(true)} refreshing={refreshing}>
      <div className="space-y-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama, universitas, negara..." />

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <select value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-bold">
            <option value="">Country</option>
            {countries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={group} onChange={(event) => setGroup(event.target.value)} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-bold">
            <option value="">Group</option>
            {groups.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={university} onChange={(event) => setUniversity(event.target.value)} className="max-w-[180px] rounded-full border border-border bg-white px-4 py-2 text-sm font-bold">
            <option value="">University</option>
            {universities.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <p className="text-sm font-bold text-muted">{filtered.length} peserta ditemukan</p>

        {loading ? (
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-[2rem] bg-white/70" />
            <div className="h-28 animate-pulse rounded-[2rem] bg-white/70" />
          </div>
        ) : filtered.length ? (
          <div className="space-y-3">
            {filtered.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} onClick={() => setSelected(participant)} />
            ))}
          </div>
        ) : (
          <OrganicCard className="p-8 text-center">
            <h2 className="font-serif text-4xl">Tidak ketemu</h2>
            <p className="mt-3 text-muted">Coba kata kunci atau filter lain.</p>
          </OrganicCard>
        )}
      </div>

      <DetailDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} title="Detail Peserta">
        {selected ? (
          <div className="space-y-4">
            <OrganicCard className="p-5">
              <h2 className="text-2xl font-black leading-tight">{selected.name}</h2>
              <p className="mt-1 text-muted">{selected.nickname || selected.country}</p>
              <div className="mt-4 space-y-2 text-sm text-muted">
                {selected.university ? <p className="flex gap-2"><UsersRound className="h-4 w-4" />{selected.university}</p> : null}
                {selected.email ? <p className="flex gap-2"><Mail className="h-4 w-4" />{selected.email}</p> : null}
                {selected.phone ? <p className="flex gap-2"><Phone className="h-4 w-4" />{selected.phone}</p> : null}
                {selected.hotel || selected.room ? <p className="flex gap-2"><MapPin className="h-4 w-4" />{[selected.hotel, selected.room].filter(Boolean).join(" · ")}</p> : null}
              </div>
            </OrganicCard>
            <OrganicCard className="p-4">
              <h3 className="mb-3 font-black">Data lengkap</h3>
              <dl className="space-y-2 text-sm">
                {Object.entries(selected.details).map(([key, value]) => (
                  <div key={key} className="grid gap-1 border-b border-border/70 pb-2 last:border-0 sm:grid-cols-[9rem_1fr] sm:gap-3">
                    <dt className="break-words font-bold text-muted">{key}</dt>
                    <dd className="min-w-0 break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            </OrganicCard>
          </div>
        ) : null}
      </DetailDrawer>
    </AppShell>
  );
}
