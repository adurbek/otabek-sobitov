import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ro'yxat: manba (source) bo'yicha guruhlangan, har biri ru/en bilan.
export async function GET(request) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim().toLowerCase();
  const rows = await db
    .prepare("SELECT * FROM translations ORDER BY source COLLATE NOCASE ASC")
    .all();

  const bySource = new Map();
  for (const r of rows) {
    if (!bySource.has(r.source)) bySource.set(r.source, { source: r.source, ru: "", en: "" });
    if (r.lang === "ru" || r.lang === "en") bySource.get(r.source)[r.lang] = r.translated;
  }

  let list = [...bySource.values()];
  if (q) {
    list = list.filter(
      (it) =>
        it.source.toLowerCase().includes(q) ||
        it.ru.toLowerCase().includes(q) ||
        it.en.toLowerCase().includes(q)
    );
  }
  return NextResponse.json(list.slice(0, 500));
}

// Bitta til uchun tarjimani saqlash/yangilash (upsert).
export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const source = String(payload?.source || "").trim();
  const lang = payload?.lang;
  const translated = String(payload?.translated ?? "").trim();

  if (!source || (lang !== "ru" && lang !== "en")) {
    return NextResponse.json({ error: "source va lang (ru/en) talab qilinadi" }, { status: 400 });
  }

  if (!translated) {
    // Bo'sh qiymat — mavjud tarjimani o'chiramiz (avto-tarjima qayta ishlaydi).
    await db
      .prepare("DELETE FROM translations WHERE lang = ? AND source = ?")
      .run(lang, source);
    return NextResponse.json({ ok: true });
  }

  await db
    .prepare(
      "INSERT INTO translations (lang, source, translated) VALUES (?, ?, ?) ON CONFLICT(lang, source) DO UPDATE SET translated = excluded.translated"
    )
    .run(lang, source, translated);
  return NextResponse.json({ ok: true });
}

// Manba bo'yicha barcha tillardagi tarjimani o'chirish.
export async function DELETE(request) {
  const source = request.nextUrl.searchParams.get("source");
  if (!source) {
    return NextResponse.json({ error: "source talab qilinadi" }, { status: 400 });
  }
  await db.prepare("DELETE FROM translations WHERE source = ?").run(source);
  return NextResponse.json({ ok: true });
}
