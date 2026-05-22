import type { Participant, SheetRow } from "@/types";
import { text } from "@/lib/utils";

function scoreHeader(row: SheetRow): number {
  const lower = row.map(text).map((cell) => cell.toLowerCase());
  return [
    lower.some((cell) => /full name|name|nama/.test(cell)),
    lower.some((cell) => /university|institution|universitas/.test(cell)),
    lower.some((cell) => /country|nationality|negara/.test(cell)),
    lower.some((cell) => /email/.test(cell)),
    lower.some((cell) => /phone|wa|whatsapp/.test(cell))
  ].filter(Boolean).length;
}

function findHeaderRow(rows: SheetRow[]) {
  let bestIndex = 0;
  let bestScore = 0;
  rows.slice(0, 20).forEach((row, index) => {
    const score = scoreHeader(row);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function findIndex(headers: string[], patterns: RegExp[]) {
  return headers.findIndex((header) => patterns.some((pattern) => pattern.test(header)));
}

function value(row: SheetRow, index: number) {
  return index >= 0 ? text(row[index]) : "";
}

export function parseParticipants(rows: SheetRow[]): Participant[] {
  const headerIndex = findHeaderRow(rows);
  const headers = rows[headerIndex].map(text);
  const lower = headers.map((header) => header.toLowerCase());
  const nameIndex = findIndex(lower, [/full name/, /^name$/, /nama/]);
  const nicknameIndex = findIndex(lower, [/nickname/, /panggilan/]);
  const countryIndex = findIndex(lower, [/nationality/, /country/, /negara/]);
  const universityIndex = findIndex(lower, [/university/, /institution/, /universitas/]);
  const emailIndex = findIndex(lower, [/email/]);
  const phoneIndex = findIndex(lower, [/phone/, /whatsapp/, /\bwa\b/]);
  const groupIndex = findIndex(lower, [/group/, /kelompok/]);
  const hotelIndex = findIndex(lower, [/hotel/, /guest house/, /wisma/]);
  const roomIndex = findIndex(lower, [/room/, /kamar/]);
  const arrivalIndex = findIndex(lower, [/arrival/, /datang/]);
  const departureIndex = findIndex(lower, [/departure/, /pulang/]);
  const notesIndex = findIndex(lower, [/notes/, /catatan/, /keterangan/]);

  return rows.slice(headerIndex + 1).flatMap((row, offset) => {
    const name = value(row, nameIndex);
    if (!name || name.toLowerCase() === "full name") return [];
    const details = headers.reduce<Record<string, string>>((acc, header, index) => {
      const cell = text(row[index]);
      if (header && cell) acc[header] = cell;
      return acc;
    }, {});

    return {
      id: `participant-${headerIndex + offset + 2}`,
      rowIndex: headerIndex + offset + 2,
      name,
      nickname: value(row, nicknameIndex),
      country: value(row, countryIndex),
      university: value(row, universityIndex),
      email: value(row, emailIndex),
      phone: value(row, phoneIndex),
      group: value(row, groupIndex),
      hotel: value(row, hotelIndex),
      room: value(row, roomIndex),
      arrival: value(row, arrivalIndex),
      departure: value(row, departureIndex),
      notes: value(row, notesIndex),
      important: value(row, notesIndex),
      details
    };
  });
}
