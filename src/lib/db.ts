import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }
  return pool;
}

let initialized = false;

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = getPool();
  if (!initialized) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS jamaat_times (
          id INT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      initialized = true;
    } catch (e) {
      console.error("Failed to initialize database tables:", e);
    }
  }
  const result = await client.query(text, params);
  return result.rows as T[];
}
