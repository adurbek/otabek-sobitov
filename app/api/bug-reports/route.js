import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return token ? Boolean(await verifySessionToken(token)) : false;
}

// Admin: barcha xato-xabarlarni ko'rish.
export async function GET(request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  const items = await db
    .prepare("SELECT * FROM bug_reports ORDER BY id DESC")
    .all();
  return NextResponse.json(items);
}

// Ochiq: foydalanuvchi xato-xabar yuboradi (rate-limit bilan).
export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(`bug:${ip}`)) {
    return NextResponse.json(
      { error: "Juda ko'p yuborildi. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const message = String(body?.message || "").trim().slice(0, 2000);
  const pageUrl = String(body?.page_url || "").trim().slice(0, 500);
  if (message.length < 3) {
    return NextResponse.json(
      { error: "Xabar juda qisqa" },
      { status: 400 }
    );
  }

  const userAgent = (request.headers.get("user-agent") || "").slice(0, 300);
  await db
    .prepare(
      "INSERT INTO bug_reports (message, page_url, user_agent) VALUES (?, ?, ?)"
    )
    .run(message, pageUrl, userAgent);

  return NextResponse.json({ ok: true }, { status: 201 });
}
