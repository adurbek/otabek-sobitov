// Run with: npm run seed
// Reads ADMIN_USERNAME / ADMIN_PASSWORD from .env.local and creates/updates the admin user.
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

// Minimal .env.local loader (avoids adding a dotenv dependency).
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error(
    "ADMIN_USERNAME va ADMIN_PASSWORD .env.local faylida ko'rsatilishi kerak."
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD kamida 8 belgidan iborat bo'lishi kerak.");
  process.exit(1);
}

const dbPath = process.env.DATABASE_PATH || "./data/sobitov.db";
const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const passwordHash = bcrypt.hashSync(password, 12);

const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
if (existing) {
  db.prepare("UPDATE users SET password_hash = ? WHERE username = ?").run(passwordHash, username);
  console.log(`Admin foydalanuvchi "${username}" paroli yangilandi.`);
} else {
  db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, passwordHash);
  console.log(`Admin foydalanuvchi "${username}" yaratildi.`);
}

db.close();
