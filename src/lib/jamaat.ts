import { remoteRead, remoteWrite } from "./remote-storage";

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Validation ────────────────────────────────────────────────────────────────
export function isValidJamaatTimes(x: unknown): x is JamaatTimes {
  if (!x || typeof x !== "object") return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.fajr    === "string" &&
    typeof v.dhuhr   === "string" &&
    typeof v.asr     === "string" &&
    typeof v.maghrib === "string" &&
    typeof v.isha    === "string" &&
    Array.isArray(v.jummah)
  );
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULTS: JamaatTimes = {
  fajr:    "05:30",
  dhuhr:   "13:15",
  asr:     "16:45",
  maghrib: "20:00",
  isha:    "21:30",
  jummah: [
    { khutbah: "12:45", salah: "13:15" },
    { khutbah: "13:30", salah: "14:00" },
  ],
};

// ── In-process TTL cache ──────────────────────────────────────────────────────
let _mem: JamaatTimes | null = null;
let _memExpiry = 0;

// ── Public API ────────────────────────────────────────────────────────────────
export async function getJamaatTimes(bypassCache = false): Promise<JamaatTimes> {
  const now = Date.now();
  
  // 1. In-process cache check (only if not bypassed and within TTL)
  if (!bypassCache && _mem && isValidJamaatTimes(_mem) && now < _memExpiry) {
    return { ..._mem };
  }

  // 2. Fetch from remote/fallback storage
  const times = await remoteRead<JamaatTimes>("jamaat", DEFAULTS);
  _mem = times;
  _memExpiry = now + 10000; // Cache for 10 seconds
  return { ..._mem };
}

export async function saveJamaatTimes(data: JamaatTimes): Promise<void> {
  if (!isValidJamaatTimes(data)) throw new Error("Invalid jamaat payload");
  const payload: JamaatTimes = { ...data, updatedAt: new Date().toISOString() };

  // 1. Update memory cache and push expiry forward
  _mem = payload;
  _memExpiry = Date.now() + 10000;

  // 2. Write to storage
  await remoteWrite<JamaatTimes>("jamaat", payload);
}
