import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

// Oddiy IP-limit: har 5 daqiqada ko'pi bilan 60 ta yangi tarjima so'rovi.
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQ = 60;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_REQ;
}

async function googleTranslate(text, lang) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=" +
    lang +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const out = (data?.[0] || []).map((seg) => seg?.[0] || "").join("");
  return out || null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { lang, texts } = body || {};
  if (lang !== "ru" && lang !== "en" || !Array.isArray(texts)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const unique = [...new Set(texts.filter((t) => typeof t === "string"))]
    .map((t) => t.slice(0, 800))
    .slice(0, 80);

  const translations = {};
  const missing = [];

  const getCached = db.prepare(
    "SELECT translated FROM translations WHERE lang = ? AND source = ?"
  );
  for (const s of unique) {
    const row = await getCached.get(lang, s);
    if (row) translations[s] = row.translated;
    else missing.push(s);
  }

  if (missing.length && !limited(ip)) {
    const save = db.prepare(
      "INSERT OR REPLACE INTO translations (lang, source, translated) VALUES (?, ?, ?)"
    );
    for (const s of missing) {
      try {
        const tr = await googleTranslate(s, lang);
        if (tr && tr.trim()) {
          translations[s] = tr;
          await save.run(lang, s, tr);
        }
      } catch {}
    }
  }

  return NextResponse.json({ translations });
}
