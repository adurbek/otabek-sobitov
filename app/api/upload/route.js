import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Faqat JPG, PNG, WEBP yoki GIF rasm yuklash mumkin" },
      { status: 400 }
    );
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_SIZE) {
    return NextResponse.json(
      { error: "Rasm hajmi 8 MB dan oshmasligi kerak" },
      { status: 400 }
    );
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Vercel'da fayl tizimiga yozib bo'lmaydi — rasmlar Vercel Blob'da saqlanadi.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${name}`, bytes, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), bytes);

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
