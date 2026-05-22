# CommTECH Insight 2026 Staff App

Mobile-first PWA untuk panitia CommTECH Insight 2026. App ini memakai Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, lucide-react, Google Sheets API server-side, dan mock fallback saat kredensial Google belum disetel.

## Fitur

- Halaman Today untuk agenda yang sedang berlangsung, agenda sebelumnya/berikutnya, job panitia, filter Tugasku/Lokasi/PIC, dan detail drawer.
- Halaman Checklist dengan progress, grouping kategori/divisi, status lokal, dan optional write-back ke Google Sheets.
- Halaman Peserta dengan pencarian instant, filter country/group/university, dan detail drawer.
- Halaman Guide untuk kontak penting, lokasi, dress code, aturan cepat, dan quick links.
- Staff PIN gate opsional lewat `STAFF_PIN`.
- PWA manifest dengan theme color warm off-white.

## Setup Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Jika Google credentials belum ada, app otomatis memakai mock data dari `lib/mockData.ts`.

## Environment Variables

Buat `.env.local`:

```env
GOOGLE_SHEET_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
APP_TIMEZONE=Asia/Jakarta
STAFF_PIN=
NEXT_PUBLIC_SHEET_URL=
NEXT_PUBLIC_WHATSAPP_URL=
```

`STAFF_PIN` boleh kosong. Jika diisi, semua halaman internal akan diarahkan ke `/login`.

Sheet production yang dipakai:

```txt
GOOGLE_SHEET_ID=1b_5LQxsGMChR5nLI7h2AoaR0hKvLX3DBLxHcTJk7zhY
```

## Google Service Account

1. Buka Google Cloud Console.
2. Buat project atau pilih project yang ada.
3. Enable **Google Sheets API**.
4. Buat **Service Account**.
5. Buat key JSON untuk service account tersebut.
6. Copy nilai berikut ke env:
   - `client_email` ke `GOOGLE_CLIENT_EMAIL`
   - `private_key` ke `GOOGLE_PRIVATE_KEY`
7. Share Google Sheet ke email service account sebagai Viewer, atau Editor jika ingin write-back checklist.

Di Vercel, paste `GOOGLE_PRIVATE_KEY` apa adanya. Jika perlu, ubah newline menjadi `\n`; app akan mengubahnya kembali di server.

## Struktur Sheet Rundown

Parser utama membaca tab `02 RD 2026` dengan layout manusiawi:

| Kolom | Isi |
| --- | --- |
| A | Start |
| B | End |
| C | Duration minutes |
| D | Agenda |
| E | Speaker |
| F | Location |
| G | PIC |
| H | JOB |
| I | Volunteer |
| J | Resource |
| K | Notes |

Parser mendukung:

- Separator hari seperti `Day 1 (Monday, 9 Feb 2026)`.
- Waktu format Google/Excel number, `08:30`, `10.00`, atau string formatted value.
- Baris parent agenda dan sub-agenda.
- Baris JOB/Volunteer/Resource/Notes tanpa Start/End, yang ditempel ke agenda sebelumnya.
- Nilai kosong karena merged/repeated cells dengan konteks agenda sebelumnya.

Untuk testing waktu saat ini:

```txt
/?now=2026-02-09T10:15:00+07:00
```

## Checklist

App membaca tab `Prep`, lalu fallback ke `List Kebutuhan`. Header dideteksi dinamis dari nama kolom seperti task/item/kebutuhan, PIC/owner, status, priority, dan notes.

Status yang dikenali:

- `Belum`
- `Proses`
- `Selesai`

Jika service account punya akses edit, status bisa dikirim balik server-side ke Google Sheets. Jika tidak, UI tetap bekerja dalam mode lihat saja/lokal.

## Peserta

App membaca tab `List Peserta`. Header row dideteksi otomatis dari kolom yang mirip:

- name/full name/nama
- university/institution
- country/nationality
- email
- phone/whatsapp
- group/kelompok
- hotel/room
- arrival/departure
- notes

Jika `STAFF_PIN` aktif, API peserta juga menolak request tanpa cookie login.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import project di Vercel.
3. Set env vars di Project Settings.
4. Deploy.

Build command default:

```bash
npm run build
```

Output framework: Next.js.

## Catatan Lokal Windows

Di mesin ini, native SWC Windows sempat ditolak oleh runtime lokal, jadi dependency `@next/swc-wasm-nodejs` disertakan sebagai fallback build lokal. Vercel biasanya memakai native SWC Linux dan tidak membutuhkan langkah khusus.
