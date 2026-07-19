// Run with: npm run seed
// Reads ADMIN_USERNAME / ADMIN_PASSWORD from .env.local and creates/updates the admin user.
// TURSO_DATABASE_URL berilgan bo'lsa bulutdagi bazaga, aks holda lokal faylga yozadi.
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { createClient } = require("@libsql/client");

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

function makeClient() {
  if (process.env.TURSO_DATABASE_URL) {
    console.log("Turso (bulut) bazasiga ulanmoqda...");
    return createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  const dbPath = process.env.DATABASE_PATH || "./data/sobitov.db";
  const resolved = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return createClient({ url: "file:" + resolved.replace(/\\/g, "/") });
}

async function main() {
  const db = makeClient();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const passwordHash = bcrypt.hashSync(password, 12);

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE username = ?",
    args: [username],
  });
  if (existing.rows.length) {
    await db.execute({
      sql: "UPDATE users SET password_hash = ? WHERE username = ?",
      args: [passwordHash, username],
    });
    console.log(`Admin foydalanuvchi "${username}" paroli yangilandi.`);
  } else {
    await db.execute({
      sql: "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      args: [username, passwordHash],
    });
    console.log(`Admin foydalanuvchi "${username}" yaratildi.`);
  }

  db.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
