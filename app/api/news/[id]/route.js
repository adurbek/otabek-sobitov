import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const item = db.prepare("SELECT * FROM news WHERE id = ?").get(params.id);
  if (!item) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { tag = "Voqea", date = "", title = "", body: text = "", image_url = "", sort_order = 0 } = body || {};
  db.prepare(
    "UPDATE news SET tag=?, date=?, title=?, body=?, image_url=?, sort_order=? WHERE id=?"
  ).run(tag, date, title, text, image_url, sort_order, params.id);
  const updated = db.prepare("SELECT * FROM news WHERE id = ?").get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  db.prepare("DELETE FROM news WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
