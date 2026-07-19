import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const about = await db.prepare("SELECT * FROM about WHERE id = 1").get();
  return NextResponse.json(about);
}

export async function PUT(request) {
  const body = await request.json();
  const {
    full_name = "",
    direction = "",
    position = "",
    education = "",
    location = "",
    summary = "",
    principles = [],
    bio_education = "",
    bio_career = "",
    bio_social = "",
    photo_url = "",
    link_url = "",
  } = body || {};

  await db.prepare(
    `UPDATE about SET full_name=?, direction=?, position=?, education=?, location=?, summary=?, principles=?, bio_education=?, bio_career=?, bio_social=?, photo_url=?, link_url=? WHERE id=1`
  ).run(
    full_name,
    direction,
    position,
    education,
    location,
    summary,
    JSON.stringify(Array.isArray(principles) ? principles : []),
    bio_education,
    bio_career,
    bio_social,
    photo_url,
    link_url
  );

  const updated = await db.prepare("SELECT * FROM about WHERE id = 1").get();
  return NextResponse.json(updated);
}
