import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isPublicAdminPath = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin");
  const isAdminApi =
    pathname.startsWith("/api/news") ||
    pathname.startsWith("/api/initiatives") ||
    pathname.startsWith("/api/travels") ||
    pathname.startsWith("/api/map-visits") ||
    pathname.startsWith("/api/videos") ||
    pathname.startsWith("/api/slides") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/about");

  if (!isAdminArea && !isAdminApi) return NextResponse.next();
  if (isPublicAdminPath) return NextResponse.next();

  // Public GET requests to content APIs are allowed (used by the public pages).
  if (isAdminApi && request.method === "GET") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/news/:path*", "/api/initiatives/:path*", "/api/travels/:path*", "/api/map-visits", "/api/map-visits/:path*", "/api/videos/:path*", "/api/slides/:path*", "/api/upload/:path*", "/api/upload", "/api/about/:path*"],
};
