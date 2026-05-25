import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool() {
  // Cloud Run: connect via Unix socket provided by Cloud SQL proxy sidecar
  // Local dev: connect via TCP with DATABASE_URL
  if (process.env.INSTANCE_UNIX_SOCKET) {
    return new Pool({
      host: process.env.INSTANCE_UNIX_SOCKET,
      database: process.env.DB_NAME ?? "taxable_ai",
      user: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASS,
      max: 5,
    });
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 5,
  });
}

export const pool = globalThis.__pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalThis.__pgPool = pool;

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const result = await pool.query(text, params);
  return (result.rows[0] as T) ?? null;
}
