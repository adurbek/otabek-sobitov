import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function PUT(request, { params }) {
  const body = await request.json();
  const visits = Math.max(1, Number(body?.visits) || 1);
  const result = await db
    .prepare("UPDATE map_visits SET visits = ? WHERE id = ?")
    .run(visits, params.id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  const updated = await db.prepare("SELECT * FROM map_visits WHERE id = ?").get(params.id);
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const result = await db.prepare("DELETE FROM map_visits WHERE id = ?").run(params.id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
