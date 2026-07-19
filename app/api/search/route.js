import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

// Kirill harflarini lotinga o'girish — qidiruv har ikki yozuvda ishlashi uchun.
const CYR2LAT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts", ч: "ch", ш: "sh",
  щ: "sh", ъ: "", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o", ғ: "g", қ: "q", ҳ: "h",
};

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .split("")
    .map((ch) => (CYR2LAT[ch] !== undefined ? CYR2LAT[ch] : ch))
    .join("")
    .replace(/[’‘ʻʼ`']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(text, tokens, len = 110) {
  const plain = String(text || "").replace(/\s+/g, " ").trim();
  if (!plain) return "";
  const normed = norm(plain);
  let idx = -1;
  for (const t of tokens) {
    idx = normed.indexOf(t);
    if (idx !== -1) break;
  }
  // norm o'zgarishi sabab indeks taxminiy — atrofidan kesib olamiz
  const start = Math.max(0, Math.min(idx, plain.length - 1) - 30);
  const cut = plain.slice(start, start + len);
  return (start > 0 ? "…" : "") + cut + (start + len < plain.length ? "…" : "");
}

// O'zbekcha qo'shimchalarni olib tashlab, o'zak bilan ham qidiramiz
// ("safarlari" so'rovi "safar" so'zini ham topadi va aksincha).
const SUFFIXES = [
  "laridan", "larining", "laridagi", "larimiz", "lardan", "larni",
  "larga", "larda", "lari", "lar", "ning", "dagi", "dan", "da",
  "ga", "ni", "imiz", "ingiz", "moqda", "gan", "kan", "qan",
  "chi", "si", "i",
];

function stems(token) {
  const out = new Set([token]);
  let cur = token;
  for (let i = 0; i < 2; i++) {
    for (const s of SUFFIXES) {
      if (cur.endsWith(s) && cur.length - s.length >= 3) {
        cur = cur.slice(0, -s.length);
        out.add(cur);
        break;
      }
    }
  }
  return [...out];
}

// Ruscha/inglizcha so'rovlarni o'zbekchaga o'girish (natija keshlanadi).
async function queryToUzbek(q) {
  const key = q.toLowerCase().slice(0, 200);
  const cached = await db
    .prepare("SELECT translated FROM translations WHERE lang = 'q>uz' AND source = ?")
    .get(key);
  if (cached) return cached.translated;
  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=uz&dt=t&q=" +
      encodeURIComponent(q);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tr = (data?.[0] || []).map((seg) => seg?.[0] || "").join("");
    if (tr && tr.trim()) {
      await db.prepare(
        "INSERT OR REPLACE INTO translations (lang, source, translated) VALUES ('q>uz', ?, ?)"
      ).run(key, tr);
      return tr;
    }
  } catch {}
  return null;
}

function tokenize(q) {
  return norm(q).split(" ").filter((t) => t.length >= 2);
}

export async function GET(request) {
  const q = request.nextUrl.searchParams.get("q") || "";
  let tokens = tokenize(q);
  if (!tokens.length) return NextResponse.json([]);

  const matches = (...fields) => {
    const hay = norm(fields.join(" "));
    return tokens.every((t) => stems(t).some((st) => hay.includes(st)));
  };

  // Barcha jadvallarni bir marta o'qib olamiz — collect() shu massivlar ustida ishlaydi.
  const [newsRows, slideRows, mapRows, initiativeRows, travelRows, videoRows, awardRows, about] =
    await Promise.all([
      db.prepare("SELECT id, tag, title, body, date FROM news").all(),
      db.prepare("SELECT id, title, date FROM slides").all(),
      db.prepare("SELECT scope, name, visits FROM map_visits").all(),
      db.prepare("SELECT id, title, description FROM initiatives").all(),
      db.prepare("SELECT id, city, country, date_label, event, description FROM travels").all(),
      db.prepare("SELECT id, title, date FROM videos").all(),
      db.prepare("SELECT id, year, title, description FROM awards").all(),
      db.prepare("SELECT * FROM about WHERE id = 1").get(),
    ]);

  let results = collect();

  // Hech narsa topilmasa — so'rov boshqa tilda bo'lishi mumkin,
  // o'zbekchaga tarjima qilib qayta qidiramiz.
  if (!results.length && q.trim().length >= 3) {
    const uz = await queryToUzbek(q);
    if (uz && norm(uz) !== norm(q)) {
      const uzTokens = tokenize(uz);
      if (uzTokens.length) {
        tokens = uzTokens;
        results = collect();
      }
    }
  }

  return NextResponse.json(results.slice(0, 20));

  function collect() {
  const results = [];

  // Sayt bo'limlari — bo'lim nomi qidirilganda ham aynan o'sha joy ochilsin.
  const SECTIONS = [
    { title: "Mukofotlar", keywords: "mukofot mukofat nishon medal diplom award", href: "/men-haqimda#mukofot" },
    { title: "Tarjimai hol", keywords: "tarjimai hol biografiya bio hayot yoli", href: "/men-haqimda#tarjima" },
    { title: "Men haqimda", keywords: "maqom shaxsiy profil malumot", href: "/men-haqimda#maqom" },
    { title: "Mediateka", keywords: "mediateka video videolar lavha youtube", href: "/#mediateka" },
    { title: "Xorijga tashriflar", keywords: "xorij xarita dunyo davlat mamlakat tashrif", href: "/safarlar" },
    { title: "Hududlarga tashriflar", keywords: "hudud viloyat mintaqa xarita tashrif", href: "/safarlar" },
    { title: "Voqealar", keywords: "voqea yangilik xabar elon", href: "/voqealar" },
    { title: "Tashabbuslar", keywords: "tashabbus loyiha initsiativa", href: "/tashabbuslar" },
    { title: "Safarlar", keywords: "safar sayohat tashrif", href: "/safarlar" },
  ];
  for (const s of SECTIONS) {
    if (matches(s.title, s.keywords)) {
      results.push({ type: "Bo'lim", title: s.title, snippet: "", href: s.href });
    }
  }

  for (const n of newsRows) {
    if (matches(n.tag, n.title, n.body)) {
      results.push({
        type: "Voqea",
        title: n.title,
        snippet: snippet(n.body, tokens) || n.date,
        href: `/voqealar/${n.id}`,
      });
    }
  }

  for (const s of slideRows) {
    if (matches(s.title)) {
      results.push({
        type: "Bosh sahifa",
        title: s.title,
        snippet: s.date || "",
        href: "/",
      });
    }
  }

  for (const m of mapRows) {
    if (matches(m.name)) {
      results.push({
        type: "Tashrif",
        title: m.name,
        snippet: `${m.visits} marta tashrif buyurgan`,
        href: "/safarlar",
      });
    }
  }

  for (const i of initiativeRows) {
    if (matches(i.title, i.description)) {
      results.push({
        type: "Tashabbus",
        title: i.title,
        snippet: snippet(i.description, tokens),
        href: "/tashabbuslar",
      });
    }
  }

  for (const t of travelRows) {
    if (matches(t.city, t.country, t.event, t.description)) {
      results.push({
        type: "Safar",
        title: `${t.city}${t.country ? ", " + t.country : ""}`,
        snippet: snippet(t.description, tokens) || [t.date_label, t.event].filter(Boolean).join(" · "),
        href: "/safarlar",
      });
    }
  }

  for (const v of videoRows) {
    if (matches(v.title)) {
      results.push({
        type: "Video",
        title: v.title,
        snippet: v.date || "",
        href: "/#mediateka",
      });
    }
  }

  for (const a of awardRows) {
    if (matches(a.title, a.description, a.year)) {
      results.push({
        type: "Mukofot",
        title: `${a.year} — ${a.title}`,
        snippet: snippet(a.description, tokens),
        href: "/men-haqimda#mukofot",
      });
    }
  }

  if (
    about &&
    matches(
      about.full_name,
      about.direction,
      about.position,
      about.education,
      about.summary,
      about.bio_education,
      about.bio_career,
      about.bio_social
    )
  ) {
    results.push({
      type: "Sahifa",
      title: "Men haqimda",
      snippet: snippet(about.summary || about.bio_career, tokens),
      href: "/men-haqimda",
    });
  }

  return results;
  }
}
