import { NextRequest, NextResponse } from "next/server";
import { getSheetRows } from "@/lib/googleSheets";
import { mockRundown } from "@/lib/mockData";
import { detectCurrentEvent, getAllRundownNames, parseRundownRows } from "@/lib/parseRundown";
import { getNowFromParam } from "@/lib/time";

export const revalidate = 0; // disable cache for debugging

export async function GET(request: NextRequest) {
  const now = getNowFromParam(request.nextUrl.searchParams.get("now"));
  let rows = null;
  let events = mockRundown;
  let source: "google" | "mock" = "mock";
  let error: string | undefined;

  try {
    rows = await getSheetRows("02 RD 2026", "A:K");
    if (rows?.length) {
      events = parseRundownRows(rows);
      source = "google";
    }
  } catch (caught) {
    console.error("Failed to build rundown payload, falling back to mock data.", caught);
    error = "Rundown Google Sheets belum bisa dibaca. App memakai mock data sementara.";
    events = mockRundown;
    source = "mock";
  }

  const currentState = detectCurrentEvent(events, now);

  return NextResponse.json({
    events,
    ...currentState,
    allNames: getAllRundownNames(events),
    source,
    error,
    refreshedAt: new Date().toISOString(),
    _debug: {
      rawRowCount: rows?.length ?? 0,
      parsedEventCount: events.length,
      sheetName: "02 RD 2026",
      sheetId: process.env.GOOGLE_SHEET_ID,
      firstRows: rows?.slice(0, 5) ?? [],
    }
  });
}
