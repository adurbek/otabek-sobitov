import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const items = db.prepare("SELECT * FROM travels ORDER BY sort_order ASC, id DESC").all();
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const { city = "", country = "", date_label = "", event = "", description = "", image_url = "", sort_order = 0 } = body || {};
  if (!city) {
    return NextResponse.json({ error: "Shahar nomi talab qilinadi" }, { status: 400 });
  }
  const result = db
    .prepare(
      "INSERT INTO travels (city, country, date_label, event, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(city, country, date_label, event, description, image_url, sort_order);
  const created = db.prepare("SELECT * FROM travels WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
