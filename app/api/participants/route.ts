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

  let rows = null;
  let participants = mockParticipants;
  let source: "google" | "mock" = "mock";
  let error: string | undefined;

  try {
    rows = await getSheetRows("List Peserta", "A:Z");
    if (rows?.length) {
      participants = parseParticipants(rows);
      source = "google";
    }
  } catch (caught) {
    console.error("Failed to build participants payload, falling back to mock data.", caught);
    error = "Data peserta Google Sheets belum bisa dibaca. App memakai mock data sementara.";
  }

  return NextResponse.json(
    {
      participants,
      protected: Boolean(process.env.STAFF_PIN),
      source,
      error,
      refreshedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30"
      }
    }
  );
}
