import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
// Bazadan real vaqtda o'qishi va PUT/POST qabul qilishi uchun dinamik bo'lishi shart:
// aks holda Next.js route'ni statik qilib qo'yadi va 405 qaytaradi.
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db.prepare("SELECT * FROM social_profiles").all();
  return NextResponse.json(items);
}

export async function PUT(request) {
  const body = await request.json();
  const {
    network = "",
    display_name = "",
    handle = "",
    avatar_url = "",
    followers = "",
    profile_url = "",
    page_url = "",
  } = body || {};
  if (!network) {
    return NextResponse.json({ error: "Tarmoq nomi talab qilinadi" }, { status: 400 });
  }
  await db
    .prepare(
      `INSERT INTO social_profiles (network, display_name, handle, avatar_url, followers, profile_url, page_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(network) DO UPDATE SET
         display_name=excluded.display_name,
         handle=excluded.handle,
         avatar_url=excluded.avatar_url,
         followers=excluded.followers,
         profile_url=excluded.profile_url,
         page_url=excluded.page_url`
    )
    .run(network, display_name, handle, avatar_url, followers, profile_url, page_url);
  const updated = await db
    .prepare("SELECT * FROM social_profiles WHERE network = ?")
    .get(network);
  return NextResponse.json(updated);
}
