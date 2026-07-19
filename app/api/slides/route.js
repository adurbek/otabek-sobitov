import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const items = db
    .prepare("SELECT * FROM slides ORDER BY sort_order ASC, id DESC")
    .all();
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const { title = "", date = "", image_url = "", sort_order = 0 } = body || {};
  if (!title || !image_url) {
    return NextResponse.json(
      { error: "Sarlavha va rasm talab qilinadi" },
      { status: 400 }
    );
  }
  const result = db
    .prepare(
      "INSERT INTO slides (title, date, image_url, sort_order) VALUES (?, ?, ?, ?)"
    )
    .run(title, date, image_url, sort_order);
  const created = db
    .prepare("SELECT * FROM slides WHERE id = ?")
    .get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
