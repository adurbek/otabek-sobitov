// Run with: npm run migrate
// Lokal data/sobitov.db dagi butun kontentni Turso (bulut) bazasiga ko'chiradi.
// .env.local da TURSO_DATABASE_URL va TURSO_AUTH_TOKEN bo'lishi shart.
const path = require("path");
const fs = require("fs");
const { createClient } = require("@libsql/client");

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

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error(
    "TURSO_DATABASE_URL va TURSO_AUTH_TOKEN .env.local faylida ko'rsatilishi kerak."
  );
  process.exit(1);
}

const dbPath = process.env.DATABASE_PATH || "./data/sobitov.db";
const resolved = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
if (!fs.existsSync(resolved)) {
  console.error(`Lokal baza topilmadi: ${resolved}`);
  process.exit(1);
}

async function main() {
  const local = createClient({ url: "file:" + resolved.replace(/\\/g, "/") });
  const remote = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  const tables = await local.execute(
    "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  );

  for (const t of tables.rows) {
    const name = t[0];
    const createSql = t[1];

    console.log(`\n→ ${name}`);
    await remote.execute(`DROP TABLE IF EXISTS ${name}`);
    await remote.execute(createSql);

    const data = await local.execute(`SELECT * FROM ${name}`);
    if (!data.rows.length) {
      console.log("  (bo'sh jadval)");
      continue;
    }

    const cols = data.columns;
    const placeholders = cols.map(() => "?").join(", ");
    const insertSql = `INSERT INTO ${name} (${cols.join(", ")}) VALUES (${placeholders})`;

    const stmts = data.rows.map((row) => ({
      sql: insertSql,
      args: cols.map((_, i) => row[i]),
    }));
    await remote.batch(stmts, "write");
    console.log(`  ${data.rows.length} ta qator ko'chirildi.`);
  }

  console.log("\n✓ Migratsiya tugadi. Sayt endi Turso bazasidan o'qiydi.");
  local.close();
  remote.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
