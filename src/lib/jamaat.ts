import { Redis } from "@upstash/redis";
import { query } from "@/lib/db";

export type JummahSlot = { khutbah: string; salah: string };

export type JamaatTimes = {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: JummahSlot[];
  updatedAt?: string;
};

const DEFAULTS: JamaatTimes = {
  fajr: "05:30",
  dhuhr: "12:35",
  asr: "16:15",
  maghrib: "17:55",
  isha: "19:30",
  jummah: [
    { khutbah: "12:45", salah: "13:15" },
    { khutbah: "13:15", salah: "13:45" },
  ],
};

const REDIS_KEY = "jamaat_times";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const hasRedis = !!(redisUrl && redisToken);

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (!hasRedis) return null;
  if (!_redis) _redis = new Redis({ url: redisUrl!, token: redisToken! });
  return _redis;
}

function isValid(x: unknown): x is JamaatTimes {
  if (!x || typeof x !== "object") return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.fajr === "string" &&
    typeof v.dhuhr === "string" &&
    typeof v.asr === "string" &&
    typeof v.maghrib === "string" &&
    typeof v.isha === "string" &&
    Array.isArray(v.jummah)
  );
}

async function readFromRedis(): Promise<JamaatTimes | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const data = await redis.get<JamaatTimes>(REDIS_KEY);
    if (data && isValid(data)) return data;
  } catch (e) {
    console.error("Redis read error:", e);
  }
  return null;
}

async function readFromDB(): Promise<JamaatTimes | null> {
  try {
    const rows = await query<{ data: JamaatTimes }>(
      "SELECT data FROM jamaat_times WHERE id = 1"
    );
    if (rows.length && isValid(rows[0].data)) return rows[0].data;
  } catch {
    // table may not exist yet
  }
  return null;
}

export async function getJamaatTimes(): Promise<JamaatTimes> {
  const fromRedis = await readFromRedis();
  if (fromRedis) return fromRedis;

  const fromDB = await readFromDB();
  if (fromDB) return fromDB;

  return DEFAULTS;
}

export async function saveJamaatTimes(data: JamaatTimes): Promise<void> {
  if (!isValid(data)) throw new Error("Invalid jamaat payload");
  data.updatedAt = new Date().toISOString();

  let redisSuccess = false;
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(REDIS_KEY, data);
      redisSuccess = true;
    } catch (e) {
      console.error("Redis write error:", e);
    }
  }

  try {
    await query(
      `INSERT INTO jamaat_times (id, data, updated_at)
       VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()`,
      [JSON.stringify(data)]
    );
  } catch (e) {
    console.error("DB write error:", e);
    if (!redisSuccess) {
      throw e;
    }
  }
}
