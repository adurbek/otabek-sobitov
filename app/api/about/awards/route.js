import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const awards = await db.prepare("SELECT * FROM awards ORDER BY sort_order ASC, year DESC").all();
  return NextResponse.json(awards);
}

export async function POST(request) {
  const body = await request.json();
  const { year = "", title = "", description = "", image_url = "", link_url = "", sort_order = 0 } = body || {};
  if (!year || !title) {
    return NextResponse.json({ error: "Yil va nomi talab qilinadi" }, { status: 400 });
  }
  const result = await db
    .prepare("INSERT INTO awards (year, title, description, image_url, link_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
    .run(year, title, description, image_url, link_url, sort_order);
  const created = await db.prepare("SELECT * FROM awards WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
