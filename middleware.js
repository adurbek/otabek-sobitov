import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/auth";

// Maxfiy admin login yo'li (Vercel env orqali beriladi). O'rnatilmagan bo'lsa
// eski /admin/login ishlab turadi (lockout bo'lmasligi uchun).
const ADMIN_LOGIN_PATH = (process.env.ADMIN_LOGIN_PATH || "").replace(/^\/+|\/+$/g, "");

function withNoIndex(res) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1) Maxfiy login yo'li → ichki /admin/login sahifasiga rewrite qilinadi.
  if (
    ADMIN_LOGIN_PATH &&
    (pathname === `/${ADMIN_LOGIN_PATH}` || pathname === `/${ADMIN_LOGIN_PATH}/`)
  ) {
    return withNoIndex(NextResponse.rewrite(new URL("/admin/login", request.url)));
  }

  const isAdminArea = pathname.startsWith("/admin");
  const isAdminApi =
    pathname.startsWith("/api/news") ||
    pathname.startsWith("/api/initiatives") ||
    pathname.startsWith("/api/travels") ||
    pathname.startsWith("/api/travel-images") ||
    pathname.startsWith("/api/map-visits") ||
    pathname.startsWith("/api/videos") ||
    pathname.startsWith("/api/slides") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/social-profiles") ||
    pathname.startsWith("/api/social-posts") ||
    pathname.startsWith("/api/translations") ||
    pathname.startsWith("/api/about");

  // Admin bilan bog'liq bo'lmagan barcha so'rovlar erkin o'tadi.
  if (!isAdminArea && !isAdminApi) return NextResponse.next();

  // 2) /admin/login to'g'ridan-to'g'ri ochilmasin — maxfiy yo'l o'rnatilgan bo'lsa
  //    bosh sahifaga yuboriladi (admin butunlay yashiriladi).
  if (pathname === "/admin/login") {
    if (ADMIN_LOGIN_PATH) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return withNoIndex(NextResponse.next());
  }

  // Kontent API'lariga public GET so'rovlariga ruxsat (public sahifalar ishlatadi).
  if (isAdminApi && request.method === "GET") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
    }
    // Autentifikatsiyasiz admin sahifasi — bosh sahifaga (login oshkor qilinmaydi).
    return NextResponse.redirect(new URL("/", request.url));
  }

  return withNoIndex(NextResponse.next());
}

// Middleware barcha sahifa/API yo'llarida ishlaydi (statik fayllar bundan mustasno),
// chunki maxfiy login yo'li dinamik va statik matcher'ga sig'maydi.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|woff2?)).*)",
  ],
};
