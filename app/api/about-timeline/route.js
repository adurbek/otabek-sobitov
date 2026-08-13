import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db
    .prepare("SELECT * FROM about_timeline ORDER BY sort_order ASC, year DESC, id ASC")
    .all();
  return NextResponse.json(items);
}

export async function POST(request) {
  const payload = await request.json();
  const { year = "", title = "", text = "", sort_order = 0 } = payload || {};
  const result = await db
    .prepare(
      "INSERT INTO about_timeline (year, title, text, sort_order) VALUES (?, ?, ?, ?)"
    )
    .run(year, title, text, sort_order);
  const created = await db
    .prepare("SELECT * FROM about_timeline WHERE id = ?")
    .get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
