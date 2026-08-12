import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { validatePasswordStrength } from "@/lib/password";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  // Faqat tizimga kirgan admin o'zgartira oladi.
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "local";
  if (isRateLimited(`change-pw:${ip}`)) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body || {};
  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Joriy va yangi parol talab qilinadi" },
      { status: 400 }
    );
  }

  const strengthError = validatePasswordStrength(newPassword);
  if (strengthError) {
    return NextResponse.json({ error: strengthError }, { status: 400 });
  }

  const user = await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(session.username);
  if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
    return NextResponse.json({ error: "Joriy parol noto'g'ri" }, { status: 400 });
  }

  if (bcrypt.compareSync(newPassword, user.password_hash)) {
    return NextResponse.json(
      { error: "Yangi parol joriy paroldan farq qilishi kerak" },
      { status: 400 }
    );
  }

  const newHash = bcrypt.hashSync(newPassword, 12);
  await db
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(newHash, user.id);

  return NextResponse.json({ ok: true });
}
