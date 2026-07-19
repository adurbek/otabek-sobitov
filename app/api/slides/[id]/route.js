import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const item = await db.prepare("SELECT * FROM slides WHERE id = ?").get(params.id);
  if (!item) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { title = "", date = "", image_url = "", sort_order = 0 } = body || {};
  await db.prepare(
    "UPDATE slides SET title=?, date=?, image_url=?, sort_order=? WHERE id=?"
  ).run(title, date, image_url, sort_order, params.id);
  const updated = await db.prepare("SELECT * FROM slides WHERE id = ?").get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  await db.prepare("DELETE FROM slides WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
