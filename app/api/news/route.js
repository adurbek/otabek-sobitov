import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const news = await db.prepare("SELECT * FROM news ORDER BY sort_order ASC, date DESC, id DESC").all();
  return NextResponse.json(news);
}

export async function POST(request) {
  const body = await request.json();
  const { tag = "Voqea", date = "", title = "", body: text = "", image_url = "", sort_order = 0 } = body || {};
  if (!date || !title) {
    return NextResponse.json({ error: "Sana va sarlavha talab qilinadi" }, { status: 400 });
  }
  const result = await db
    .prepare(
      "INSERT INTO news (tag, date, title, body, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(tag, date, title, text, image_url, sort_order);
  const created = await db.prepare("SELECT * FROM news WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
