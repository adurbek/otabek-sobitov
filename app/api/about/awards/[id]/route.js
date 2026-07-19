import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function PUT(request, { params }) {
  const body = await request.json();
  const { year = "", title = "", description = "", image_url = "", link_url = "", sort_order = 0 } = body || {};
  db.prepare(
    "UPDATE awards SET year=?, title=?, description=?, image_url=?, link_url=?, sort_order=? WHERE id=?"
  ).run(year, title, description, image_url, link_url, sort_order, params.id);
  const updated = db.prepare("SELECT * FROM awards WHERE id = ?").get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  db.prepare("DELETE FROM awards WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
