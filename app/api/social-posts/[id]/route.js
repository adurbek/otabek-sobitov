import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function PUT(request, { params }) {
  const payload = await request.json();
  const {
    network = "",
    image_url = "",
    body = "",
    link_url = "",
    date = "",
    sort_order = 0,
  } = payload || {};
  await db
    .prepare(
      "UPDATE social_posts SET network=?, image_url=?, body=?, link_url=?, date=?, sort_order=? WHERE id=?"
    )
    .run(network, image_url, body, link_url, date, sort_order, params.id);
  const updated = await db
    .prepare("SELECT * FROM social_posts WHERE id = ?")
    .get(params.id);
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  await db.prepare("DELETE FROM social_posts WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
