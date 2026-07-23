import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";

// Turso (bulut) yoki lokal fayl: TURSO_DATABASE_URL berilsa bulutga ulanadi,
// aks holda dev rejimida lokal SQLite fayldan o'qiydi.
const TURSO_URL = process.env.TURSO_DATABASE_URL || "";

function resolveLocalUrl() {
  const DB_PATH = process.env.DATABASE_PATH || "./data/sobitov.db";
  const resolved = path.isAbsolute(DB_PATH)
    ? DB_PATH
    : path.join(process.cwd(), DB_PATH);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return "file:" + resolved.replace(/\\/g, "/");
}

// Reuse a single connection across hot-reloads in dev.
const globalForDb = globalThis;

const client =
  globalForDb.__sobitovClient ||
  createClient(
    TURSO_URL
      ? { url: TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN }
      : { url: resolveLocalUrl() }
  );
if (process.env.NODE_ENV !== "production") globalForDb.__sobitovClient = client;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    full_name TEXT DEFAULT '',
    direction TEXT DEFAULT '',
    position TEXT DEFAULT '',
    education TEXT DEFAULT '',
    location TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    principles TEXT DEFAULT '[]',
    bio_education TEXT DEFAULT '',
    bio_career TEXT DEFAULT '',
    bio_social TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    link_url TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    link_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT DEFAULT 'Voqea',
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS initiatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    featured INTEGER DEFAULT 0,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT '◆',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS travels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    country TEXT DEFAULT '',
    date_label TEXT DEFAULT '',
    event TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lang TEXT NOT NULL,
    source TEXT NOT NULL,
    translated TEXT NOT NULL,
    UNIQUE (lang, source)
  );

  CREATE TABLE IF NOT EXISTS map_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scope TEXT NOT NULL CHECK (scope IN ('world', 'region')),
    code TEXT NOT NULL,
    name TEXT DEFAULT '',
    visits INTEGER DEFAULT 1,
    UNIQUE (scope, code)
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT DEFAULT '',
    youtube_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Bosh sahifadagi ijtimoiy tarmoq kartalari: profil sarlavhasi va postlar.
  -- Instagram lentasi embed orqali keladi, qolganlari shu jadvallardan.
  CREATE TABLE IF NOT EXISTS social_profiles (
    network TEXT PRIMARY KEY,
    display_name TEXT DEFAULT '',
    handle TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    followers TEXT DEFAULT '',
    profile_url TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS social_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    network TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    body TEXT DEFAULT '',
    link_url TEXT DEFAULT '',
    date TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

// Kartalari doim ko'rinishi uchun uchta tarmoq qatori bo'sh bo'lsa ham yaratiladi.
// Profil rasmini admin panelidan o'zgartirish mumkin; boshlang'ich qiymat sifatida
// saytdagi umumiy portret ishlatiladi.
const DEFAULT_AVATAR = "/social/avatar.jpg";
const SOCIAL_PROFILE_DEFAULTS = [
  ["facebook", "Otabek Sobitov", "otabek.sobitov.9", "https://facebook.com/otabek.sobitov.9"],
  ["telegram", "Otabek Sobitov", "@otabek_yuldashovich", "https://t.me/otabek_yuldashovich"],
  [
    "linkedin",
    "Otabek Sobitov",
    "otabek-sobitov",
    "https://www.linkedin.com/in/otabek-sobitov-136192369/",
  ],
];

// Add columns introduced after the initial schema to existing databases.
const LATE_COLUMNS = [
  ["about", "photo_url", "TEXT DEFAULT ''"],
  ["about", "link_url", "TEXT DEFAULT ''"],
  ["awards", "image_url", "TEXT DEFAULT ''"],
  ["awards", "link_url", "TEXT DEFAULT ''"],
  ["travels", "image_url", "TEXT DEFAULT ''"],
];

async function initSchema() {
  await client.executeMultiple(SCHEMA);
  for (const [table, column, definition] of LATE_COLUMNS) {
    try {
      await client.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    } catch (err) {
      if (!/duplicate column/i.test(String(err?.message))) throw err;
    }
  }
  // Ensure a single About row (id = 1) always exists.
  await client.execute("INSERT OR IGNORE INTO about (id) VALUES (1)");
  for (const [network, name, handle, url] of SOCIAL_PROFILE_DEFAULTS) {
    await client.execute({
      sql: "INSERT OR IGNORE INTO social_profiles (network, display_name, handle, profile_url, avatar_url) VALUES (?, ?, ?, ?, ?)",
      args: [network, name, handle, url, DEFAULT_AVATAR],
    });
    // Avval avatarsiz yaratilgan qatorlarga ham boshlang'ich rasmni qo'yamiz.
    await client.execute({
      sql: "UPDATE social_profiles SET avatar_url = ? WHERE network = ? AND (avatar_url IS NULL OR avatar_url = '')",
      args: [DEFAULT_AVATAR, network],
    });
  }
}

let schemaReady;
function ensureSchema() {
  if (!schemaReady) schemaReady = initSchema();
  return schemaReady;
}

function toPlainRow(columns, row) {
  const out = {};
  for (let i = 0; i < columns.length; i++) out[columns[i]] = row[i];
  return out;
}

// better-sqlite3 uslubidagi API, lekin asinxron (Turso tarmoq orqali ishlaydi):
//   await db.prepare(sql).all(...args) / .get(...args) / .run(...args)
export const db = {
  prepare(sql) {
    return {
      async all(...args) {
        await ensureSchema();
        const rs = await client.execute({ sql, args });
        return rs.rows.map((r) => toPlainRow(rs.columns, r));
      },
      async get(...args) {
        await ensureSchema();
        const rs = await client.execute({ sql, args });
        return rs.rows.length ? toPlainRow(rs.columns, rs.rows[0]) : undefined;
      },
      async run(...args) {
        await ensureSchema();
        const rs = await client.execute({ sql, args });
        return {
          changes: rs.rowsAffected,
          lastInsertRowid:
            rs.lastInsertRowid === undefined ? undefined : Number(rs.lastInsertRowid),
        };
      },
    };
  },
};

export default db;
