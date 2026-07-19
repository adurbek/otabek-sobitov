import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const item = db.prepare("SELECT * FROM initiatives WHERE id = ?").get(params.id);
  if (!item) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { featured = 0, title = "", description = "", icon = "◆", sort_order = 0 } = body || {};
  db.prepare(
    "UPDATE initiatives SET featured=?, title=?, description=?, icon=?, sort_order=? WHERE id=?"
  ).run(featured ? 1 : 0, title, description, icon, sort_order, params.id);
  const updated = db.prepare("SELECT * FROM initiatives WHERE id = ?").get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  db.prepare("DELETE FROM initiatives WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
