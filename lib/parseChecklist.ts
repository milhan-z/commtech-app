import type { ChecklistItem, ChecklistStatus, Priority, SheetRow } from "@/types";
import { text } from "@/lib/utils";

const statusMap: Record<string, ChecklistStatus> = {
  belum: "Belum",
  todo: "Belum",
  proses: "Proses",
  progress: "Proses",
  "in progress": "Proses",
  selesai: "Selesai",
  done: "Selesai"
};

function normalizeStatus(value: string): ChecklistStatus {
  return statusMap[value.toLowerCase()] || "Belum";
}

function normalizePriority(value: string): Priority {
  const lower = value.toLowerCase();
  if (lower.includes("high") || lower.includes("tinggi")) return "High";
  if (lower.includes("low") || lower.includes("rendah")) return "Low";
  return "Medium";
}

function findHeader(rows: SheetRow[]) {
  let bestIndex = -1;
  let bestScore = 0;
  rows.forEach((row, index) => {
    const lower = row.map(text).map((cell) => cell.toLowerCase());
    const score = [
      lower.some((cell) => /item|task|kebutuhan|agenda|persiapan/.test(cell)),
      lower.some((cell) => /pic|owner|volunteer|penanggung/.test(cell)),
      lower.some((cell) => /status|done|progress/.test(cell)),
      lower.some((cell) => /notes|note|keterangan|catatan/.test(cell))
    ].filter(Boolean).length;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestScore >= 2 ? bestIndex : -1;
}

function columnIndex(headers: string[], patterns: RegExp[], fallback: number) {
  const found = headers.findIndex((header) => patterns.some((pattern) => pattern.test(header)));
  return found >= 0 ? found : fallback;
}

export function parseChecklist(rows: SheetRow[]): ChecklistItem[] {
  const headerIndex = findHeader(rows);
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex].map(text).map((header) => header.toLowerCase());
  const itemIndex = columnIndex(headers, [/item/, /task/, /kebutuhan/, /persiapan/, /agenda/], 1);
  const categoryIndex = columnIndex(headers, [/category/, /division/, /divisi/, /kategori/], 0);
  const ownerIndex = columnIndex(headers, [/pic/, /owner/, /volunteer/, /penanggung/], 2);
  const statusIndex = columnIndex(headers, [/status/, /progress/], 3);
  const priorityIndex = columnIndex(headers, [/priority/, /prioritas/], 4);
  const notesIndex = columnIndex(headers, [/notes/, /catatan/, /keterangan/], 5);
  const dayIndex = columnIndex(headers, [/day/, /hari/, /tanggal/, /date/], 0);

  return rows.slice(headerIndex + 1).flatMap((row, offset) => {
    const item = text(row[itemIndex]);
    if (!item) return [];
    return {
      id: `check-${headerIndex + offset + 2}`,
      rowIndex: headerIndex + offset + 2,
      day: text(row[dayIndex]),
      category: text(row[categoryIndex]),
      item,
      owner: text(row[ownerIndex]),
      status: normalizeStatus(text(row[statusIndex])),
      priority: normalizePriority(text(row[priorityIndex])),
      notes: text(row[notesIndex])
    };
  });
}
