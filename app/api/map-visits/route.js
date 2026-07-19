import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const items = db
    .prepare("SELECT * FROM map_visits ORDER BY name ASC, id ASC")
    .all();
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const { scope, code = "", name = "", visits = 1 } = body || {};
  if (scope !== "world" && scope !== "region") {
    return NextResponse.json({ error: "Noto‘g‘ri turdagi xarita" }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: "Joy tanlanishi kerak" }, { status: 400 });
  }
  const count = Math.max(1, Number(visits) || 1);
  db.prepare(
    `INSERT INTO map_visits (scope, code, name, visits) VALUES (?, ?, ?, ?)
     ON CONFLICT (scope, code) DO UPDATE SET visits = excluded.visits, name = excluded.name`
  ).run(scope, code, name, count);
  const created = db
    .prepare("SELECT * FROM map_visits WHERE scope = ? AND code = ?")
    .get(scope, code);
  return NextResponse.json(created, { status: 201 });
}
