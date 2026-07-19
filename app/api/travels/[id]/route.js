import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const item = await db.prepare("SELECT * FROM travels WHERE id = ?").get(params.id);
  if (!item) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { city = "", country = "", date_label = "", event = "", description = "", image_url = "", sort_order = 0 } = body || {};
  await db.prepare(
    "UPDATE travels SET city=?, country=?, date_label=?, event=?, description=?, image_url=?, sort_order=? WHERE id=?"
  ).run(city, country, date_label, event, description, image_url, sort_order, params.id);
  const updated = await db.prepare("SELECT * FROM travels WHERE id = ?").get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  await db.prepare("DELETE FROM travels WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
