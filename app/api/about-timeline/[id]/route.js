import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  const payload = await request.json();
  const { year = "", title = "", text = "", sort_order = 0 } = payload || {};
  await db
    .prepare("UPDATE about_timeline SET year=?, title=?, text=?, sort_order=? WHERE id=?")
    .run(year, title, text, sort_order, params.id);
  const updated = await db
    .prepare("SELECT * FROM about_timeline WHERE id = ?")
    .get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  await db.prepare("DELETE FROM about_timeline WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
