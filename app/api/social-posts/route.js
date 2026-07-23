import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
// Bazadan real vaqtda o'qishi va PUT/POST qabul qilishi uchun dinamik bo'lishi shart:
// aks holda Next.js route'ni statik qilib qo'yadi va 405 qaytaradi.
export const dynamic = "force-dynamic";

export async function GET(request) {
  const network = new URL(request.url).searchParams.get("network");
  const items = network
    ? await db
        .prepare(
          "SELECT * FROM social_posts WHERE network = ? ORDER BY sort_order ASC, date DESC, id DESC"
        )
        .all(network)
    : await db
        .prepare(
          "SELECT * FROM social_posts ORDER BY network ASC, sort_order ASC, date DESC, id DESC"
        )
        .all();
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const {
    network = "",
    image_url = "",
    body: text = "",
    link_url = "",
    date = "",
    sort_order = 0,
  } = body || {};
  if (!network) {
    return NextResponse.json({ error: "Tarmoq tanlanishi shart" }, { status: 400 });
  }
  if (!image_url && !text) {
    return NextResponse.json(
      { error: "Kamida rasm yoki matn kiritilishi kerak" },
      { status: 400 }
    );
  }
  const result = await db
    .prepare(
      "INSERT INTO social_posts (network, image_url, body, link_url, date, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(network, image_url, text, link_url, date, sort_order);
  const created = await db
    .prepare("SELECT * FROM social_posts WHERE id = ?")
    .get(result.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
