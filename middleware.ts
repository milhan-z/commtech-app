import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hasPin = Boolean(process.env.STAFF_PIN);
  const isAuthed = request.cookies.get("staff_auth")?.value === "1";
  const path = request.nextUrl.pathname;
  const isPublic =
    path.startsWith("/login") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/manifest") ||
    path.startsWith("/_next") ||
    path.includes(".");

  if (hasPin && !isAuthed && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
