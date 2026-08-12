import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const travelId = request.nextUrl.searchParams.get("travel_id");
  if (!travelId) {
    return NextResponse.json({ error: "travel_id talab qilinadi" }, { status: 400 });
  }
  const items = await db
    .prepare(
      "SELECT * FROM travel_images WHERE travel_id = ? ORDER BY sort_order ASC, id ASC"
    )
    .all(travelId);
  return NextResponse.json(items);
}

export async function POST(request) {
  const payload = await request.json();
  const { travel_id, image_url = "", caption = "", sort_order = 0 } = payload || {};
  if (!travel_id || !image_url) {
    return NextResponse.json(
      { error: "travel_id va rasm talab qilinadi" },
      { status: 400 }
    );
  }
  const result = await db
    .prepare(
      "INSERT INTO travel_images (travel_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)"
    )
    .run(travel_id, image_url, caption, sort_order);
  const created = await db
    .prepare("SELECT * FROM travel_images WHERE id = ?")
    .get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
