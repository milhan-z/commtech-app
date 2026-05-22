import type { ChecklistItem, Participant, RundownEvent, SheetRow } from "@/types";
import { parseChecklist } from "@/lib/parseChecklist";
import { parseParticipants } from "@/lib/parseParticipants";
import { parseRundownRows } from "@/lib/parseRundown";

export const mockRundownRows: SheetRow[] = [
  ["Start", "End", "Duration (minutes)", "Agenda", "Speaker", "Location", "PIC", "JOB", "Volunteer", "Resource", "Notes"],
  ["Day 1 (Monday, 9 Feb 2026)"],
  ["08:30", "09:00", 30, "Briefing panitia", "-", "-", "Noel + Shafa", "Briefing", "ALL", "", ""],
  ["09:00", "09:30", 30, "Panitia jemput peserta dan persiapan ruangan", "", "", "", "Jemput Bougenville", "Dinar, Daniel", "", ""],
  ["", "", "", "", "", "", "", "Jemput Kenongo", "Dave", "", ""],
  ["", "", "", "", "", "", "", "Standby rektorat", "Tim yang tiba duluan", "", ""],
  ["10:00", "12:00", 120, "Opening Ceremony", "", "Rektorat", "Noel + Shafa", "", "", "", ""],
  ["09:30", "10:00", 30, "Registration", "", "Lobby Rektorat", "Shafa", "MC 1", "Shafa", "Script, Cue card", "Pemberian kain batik"],
  ["10:00", "10:05", 5, "Pembukaan oleh MC", "", "Rektorat", "Shafa", "MC 2", "Marvel S15", "Script, Cue card", ""],
  ["10:05", "10:10", 5, "Pemutaran video ITS Profile", "", "Rektorat", "Noel", "Operator", "Noel", "Laptop", ""],
  ["10:10", "10:20", 10, "Sambutan Koordinator Panitia", "Noel", "Rektorat", "Noel", "Runner", "Daniel", "", ""],
  ["12:00", "13:00", 60, "Lunch", "-", "Kantin", "Dave", "Konsumsi", "Cia / Dave", "Meal box", "Pastikan vegetarian"],
  ["13:00", "16:30", 210, "Campus Tour", "", "Perpus dan DTI", "Dave, Hilman", "Dokumentasi", "Hilman", "Kamera", ""],
  ["", "", "", "", "", "", "", "Transportasi", "Daniel", "Bus", "Standby 15 menit sebelum selesai"],
  ["Day 2 (Tuesday, 10 Feb 2026)"],
  ["10:00", "12:00", 120, "Course 1: Sustainable Development in Developing Countries", "Bu Maria", "IE-601 TO", "Dave", "KOOR STREAM 2", "Noel", "", ""],
  ["12:00", "13:00", 60, "Lunch", "", "DTSI", "Shafa", "Konsumsi", "Shafa", "", ""],
  ["13:00", "15:00", 120, "Visit Lab Ergonomi (ESPK) - DTSI", "", "DTSI", "Cia", "Guide kelompok", "Cia, Hilman", "", "Dibagi 2 kelompok"]
];

export const mockChecklistRows: SheetRow[] = [
  ["Day", "Category", "Item", "PIC", "Status", "Priority", "Notes"],
  ["Day 1", "Registrasi", "Siapkan meja registrasi dan ID card", "Shafa", "Proses", "High", "Cek ulang nama peserta"],
  ["Day 1", "Venue", "Tes proyektor dan audio rektorat", "Noel", "Belum", "High", ""],
  ["Day 1", "Konsumsi", "Konfirmasi meal box vegetarian", "Cia", "Selesai", "Medium", "Koordinasi vendor pagi"],
  ["Day 1", "Transport", "Brief driver dan titik jemput", "Daniel", "Belum", "High", ""],
  ["Day 2", "Materi", "Cetak cue card Course 1", "Dave", "Proses", "Medium", ""]
];

export const mockParticipantRows: SheetRow[] = [
  ["No", "Full Name", "Nickname", "Nationality", "Email", "University", "Department/Position", "Group", "Hotel", "Room", "Notes"],
  [1, "Siti Nur Jazmina Binti Mohd Faisal", "Jazmina", "Malaysia", "jazmina2402@gmail.com", "Universiti Kuala Lumpur (UniKL) Malaysia", "Electrical and Electronics Technology", "Group 1", "Wisma Bougenville", "8-A", ""],
  [2, "Nur Zatul Alea Binti Zamri", "Zatul", "Malaysia", "nurzatulalea27@gmail.com", "Universiti Kuala Lumpur (UniKL) Malaysia", "Electrical and Electronics Technology", "Group 1", "Wisma Bougenville", "8-B", ""],
  [3, "Cyren Viloria Cacas", "Cyren", "Philippines", "22101148@slc-sflu.edu.ph", "Saint Louis College Philippines", "Elementary Education", "Group 2", "88 Embong Malang", "10-A", "Candid"],
  [4, "Jehoshaphat L. Rombaoa", "Jeho", "Philippines", "jehoshaphat198@gmail.com", "Tarlac Agricultural University", "Development Communication", "Group 3", "Wisma Bougenville", "12-B", ""],
  [5, "Takashi Tsuchiya", "Takashi", "Japan", "e2458240@soka-u.jp", "Soka University Japan", "Information System Engineering", "Group 4", "Kenongo", "", ""]
];

export const mockRundown: RundownEvent[] = parseRundownRows(mockRundownRows);
export const mockChecklist: ChecklistItem[] = parseChecklist(mockChecklistRows);
export const mockParticipants: Participant[] = parseParticipants(mockParticipantRows);
