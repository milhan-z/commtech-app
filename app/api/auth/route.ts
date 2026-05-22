import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const pin = process.env.STAFF_PIN;
  if (!pin) return NextResponse.json({ ok: true, open: true });
  const body = await request.json();
  const ok = body?.pin === pin;
  const response = NextResponse.json({ ok });
  if (ok) {
    response.cookies.set("staff_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });
  }
  return response;
}
