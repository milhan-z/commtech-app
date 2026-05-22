import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSheetRows } from "@/lib/googleSheets";
import { mockParticipants } from "@/lib/mockData";
import { parseParticipants } from "@/lib/parseParticipants";

export const revalidate = 60;

export async function GET() {
  const hasPin = Boolean(process.env.STAFF_PIN);
  const isAuthed = (await cookies()).get("staff_auth")?.value === "1";
  if (hasPin && !isAuthed) {
    return NextResponse.json({ participants: [], protected: true, source: "mock", refreshedAt: new Date().toISOString() }, { status: 401 });
  }

  const rows = await getSheetRows("List Peserta", "A:Z");
  const participants = rows?.length ? parseParticipants(rows) : mockParticipants;

  return NextResponse.json(
    {
      participants,
      protected: Boolean(process.env.STAFF_PIN),
      source: rows?.length ? "google" : "mock",
      refreshedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30"
      }
    }
  );
}
