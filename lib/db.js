import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_PATH || "./data/sobitov.db";

const resolvedPath = path.isAbsolute(DB_PATH)
  ? DB_PATH
  : path.join(process.cwd(), DB_PATH);

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

// Reuse a single connection across hot-reloads in dev.
const globalForDb = globalThis;

export const db = globalForDb.__sobitovDb || new Database(resolvedPath);
if (process.env.NODE_ENV !== "production") globalForDb.__sobitovDb = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
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
    icon TEXT DEFAULT '\u25c6',
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
`);

// Add columns introduced after the initial schema to existing databases.
function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
ensureColumn("about", "photo_url", "TEXT DEFAULT ''");
ensureColumn("about", "link_url", "TEXT DEFAULT ''");
ensureColumn("awards", "image_url", "TEXT DEFAULT ''");
ensureColumn("awards", "link_url", "TEXT DEFAULT ''");
ensureColumn("travels", "image_url", "TEXT DEFAULT ''");

// Ensure a single About row (id = 1) always exists.
const aboutRow = db.prepare("SELECT id FROM about WHERE id = 1").get();
if (!aboutRow) {
  db.prepare(
    `INSERT INTO about (id, full_name, direction, position, education, location, summary, principles, bio_education, bio_career, bio_social)
     VALUES (1, '', '', '', '', '', '', '[]', '', '', '')`
  ).run();
}

export default db;
