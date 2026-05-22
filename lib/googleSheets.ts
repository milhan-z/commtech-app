import "server-only";

import { google } from "googleapis";
import type { SheetRow } from "@/types";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function hasGoogleConfig() {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

function privateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

async function sheetsClient() {
  if (!hasGoogleConfig()) return null;
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey(),
    scopes: SCOPES
  });
  return google.sheets({ version: "v4", auth });
}

export async function getSheetRows(sheetName: string, range = "A:Z"): Promise<SheetRow[] | null> {
  const sheets = await sheetsClient();
  if (!sheets || !process.env.GOOGLE_SHEET_ID) return null;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${sheetName}'!${range}`,
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING"
  });

  return (response.data.values || []) as SheetRow[];
}

export async function updateChecklistStatus(sheetName: string, rowIndex: number, columnLetter: string, status: string) {
  const sheets = await sheetsClient();
  if (!sheets || !process.env.GOOGLE_SHEET_ID) {
    return { ok: false, reason: "readonly" as const };
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${sheetName}'!${columnLetter}${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[status]]
    }
  });

  return { ok: true };
}
