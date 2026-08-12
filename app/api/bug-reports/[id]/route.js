import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return token ? Boolean(await verifySessionToken(token)) : false;
}

// Admin: xabar holatini yangilash (masalan 'new' -> 'done').
export async function PATCH(request, { params }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const status = body?.status === "done" ? "done" : "new";
  await db.prepare("UPDATE bug_reports SET status = ? WHERE id = ?").run(status, params.id);
  const updated = await db.prepare("SELECT * FROM bug_reports WHERE id = ?").get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  await db.prepare("DELETE FROM bug_reports WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
