const { Pool } = require("pg");
require("dotenv").config();
// Optional local overrides (copy from .env.local.example). Not used in production.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local", override: true });
}

/**
 * DATABASE_URL must be a Postgres URI (postgresql://...), not your API/site URL.
 */
function assertPostgresConnectionString(connectionString) {
  if (!connectionString) return;
  const lower = connectionString.trim().toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    throw new Error(
      "DATABASE_URL must be a Postgres connection string (postgresql://user:pass@host:5432/dbname), not an HTTP URL."
    );
  }
  if (
    !lower.startsWith("postgres://") &&
    !lower.startsWith("postgresql://")
  ) {
    console.warn(
      "[db] DATABASE_URL should start with postgres:// or postgresql://. First 24 chars:",
      connectionString.slice(0, 24)
    );
  }
}

function buildPoolConfig() {
  const connectionString = process.env.DATABASE_URL?.trim();
  assertPostgresConnectionString(connectionString);

  if (connectionString) {
    const isLocal =
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1");
    return {
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 15_000,
    };
  }

  if (process.env.DB_USER && process.env.DB_HOST && process.env.DB_NAME) {
    return {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
    };
  }

  console.error(
    "Missing DB config: set DATABASE_URL or DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT"
  );
  return {};
}

const pool = new Pool(buildPoolConfig());

/** Ensures required tables exist for local development. */
async function ensureSchema() {
  const client = await pool.connect();
  try {
    await client.query("SET search_path TO public");
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
    `);
    for (const sql of [
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username VARCHAR(255)",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email VARCHAR(255)",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)",
    ]) {
      await client.query(sql);
    }
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        company_name VARCHAR(255),
        role VARCHAR(255),
        status VARCHAR(255),
        stipend VARCHAR(255),
        location VARCHAR(255),
        notes TEXT
      );
    `);
    for (const sql of [
      "ALTER TABLE public.users ALTER COLUMN password_hash TYPE VARCHAR(255)",
      "ALTER TABLE public.users ALTER COLUMN email TYPE VARCHAR(255)",
      "ALTER TABLE public.users ALTER COLUMN username TYPE VARCHAR(255)",
    ]) {
      try {
        await client.query(sql);
      } catch {
        /* table/column variant we do not need to widen */
      }
    }
    const { rows: colRows } = await client.query(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users'
       ORDER BY ordinal_position`
    );
    if (colRows.length === 0) {
      throw new Error(
        "public.users is missing after schema init. Check your DATABASE_URL database name."
      );
    }
    console.info(
      "[db] public.users columns:",
      colRows.map((r) => `${r.column_name}(${r.data_type})`).join(", ")
    );
  } finally {
    client.release();
  }
}

pool.ensureSchema = ensureSchema;

module.exports = pool;
