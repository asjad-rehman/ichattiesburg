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

// ── In-process cache ──────────────────────────────────────────────────────────
let _mem: JamaatTimes | null = null;

// ── Public API ────────────────────────────────────────────────────────────────
export async function getJamaatTimes(): Promise<JamaatTimes> {
  // 1. In-process cache (fastest path)
  if (_mem && isValidJamaatTimes(_mem)) return { ..._mem };

  // 2. Fetch from remote/fallback storage
  const times = await remoteRead<JamaatTimes>("jamaat", DEFAULTS);
  _mem = times;
  return { ..._mem };
}

export async function saveJamaatTimes(data: JamaatTimes): Promise<void> {
  if (!isValidJamaatTimes(data)) throw new Error("Invalid jamaat payload");
  const payload: JamaatTimes = { ...data, updatedAt: new Date().toISOString() };

  // 1. Update memory cache
  _mem = payload;

  // 2. Write to storage
  await remoteWrite<JamaatTimes>("jamaat", payload);
}
