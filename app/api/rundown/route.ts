import { NextRequest, NextResponse } from "next/server";
import { getSheetRows } from "@/lib/googleSheets";
import { mockRundown } from "@/lib/mockData";
import { detectCurrentEvent, getAllRundownNames, parseRundownRows } from "@/lib/parseRundown";
import { getNowFromParam } from "@/lib/time";

export const revalidate = 45;

export async function GET(request: NextRequest) {
  const now = getNowFromParam(request.nextUrl.searchParams.get("now"));
  const rows = await getSheetRows("02 RD 2026", "A:K");
  const source = rows?.length ? "google" : "mock";
  const events = rows?.length ? parseRundownRows(rows) : mockRundown;
  const currentState = detectCurrentEvent(events, now);

  return NextResponse.json(
    {
      events,
      ...currentState,
      allNames: getAllRundownNames(events),
      source,
      refreshedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "s-maxage=45, stale-while-revalidate=30"
      }
    }
  );
}
