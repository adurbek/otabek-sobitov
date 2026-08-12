import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  const payload = await request.json();
  const { image_url = "", caption = "", sort_order = 0 } = payload || {};
  await db
    .prepare(
      "UPDATE travel_images SET image_url=?, caption=?, sort_order=? WHERE id=?"
    )
    .run(image_url, caption, sort_order, params.id);
  const updated = await db
    .prepare("SELECT * FROM travel_images WHERE id = ?")
    .get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  await db.prepare("DELETE FROM travel_images WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
