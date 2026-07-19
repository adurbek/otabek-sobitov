import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "local";

  if (isRateLimited(`login:${ip}`)) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Iltimos, 10 daqiqadan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { username, password } = body || {};
  if (!username || !password) {
    return NextResponse.json({ error: "Login va parol talab qilinadi" }, { status: 400 });
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  const passwordMatches = user ? bcrypt.compareSync(password, user.password_hash) : false;

  if (!user || !passwordMatches) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = await createSessionToken(user.username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
  return res;
}
