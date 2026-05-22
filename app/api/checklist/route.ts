import { NextRequest, NextResponse } from "next/server";
import { getSheetRows, updateChecklistStatus } from "@/lib/googleSheets";
import { mockChecklist } from "@/lib/mockData";
import { parseChecklist } from "@/lib/parseChecklist";

export const revalidate = 45;

async function checklistData() {
  const prepRows = await getSheetRows("Prep", "A:Z");
  if (prepRows?.length) return { items: parseChecklist(prepRows), source: "google", sheetName: "Prep" };
  const kebutuhanRows = await getSheetRows("List Kebutuhan", "A:Z");
  if (kebutuhanRows?.length) return { items: parseChecklist(kebutuhanRows), source: "google", sheetName: "List Kebutuhan" };
  return { items: mockChecklist, source: "mock", sheetName: null };
}

export async function GET() {
  const payload = await checklistData();
  return NextResponse.json(
    { ...payload, canWrite: Boolean(process.env.GOOGLE_SHEET_ID), refreshedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "s-maxage=45, stale-while-revalidate=30"
      }
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body?.rowIndex || !body?.status) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const payload = await checklistData();
  if (!payload.sheetName) {
    return NextResponse.json({ ok: false, reason: "readonly" });
  }

  const result = await updateChecklistStatus(payload.sheetName, Number(body.rowIndex), body.statusColumn || "E", body.status);
  return NextResponse.json(result);
}
