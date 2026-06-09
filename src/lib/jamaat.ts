/**
 * Jamaat (Iqama) times — zero-dependency serverless storage.
 *
 * Read priority:
 *   1. Module-level _mem  (fastest — in-process cache)
 *   2. /tmp/jamaat.json   (writable temp FS, survives across warm requests on same Lambda)
 *   3. public/jamaat.json (committed bundle baseline — always available on cold start)
 *   4. DEFAULTS           (hardcoded fallback)
 *
 * Write:
 *   → _mem (immediate)
 *   → /tmp/jamaat.json (durable within container)
 *   → GitHub API commit (optional — add GITHUB_TOKEN env var to Vercel for true persistence)
 *
 * Result: works with ZERO env vars. Times persist for the lifetime of the Lambda
 * container (minutes–hours depending on traffic). Public/jamaat.json in the repo
 * provides the permanent default that every cold start reads.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

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

// ── Storage paths ─────────────────────────────────────────────────────────────
const TMP_PATH    = "/tmp/ichattiesburg-jamaat.json";
const BUNDLE_PATH = join(process.cwd(), "public", "jamaat.json");

// ── In-process cache ──────────────────────────────────────────────────────────
let _mem: JamaatTimes | null = null;

// ── Filesystem helpers ────────────────────────────────────────────────────────
function fsRead(path: string): JamaatTimes | null {
  try {
    if (!existsSync(path)) return null;
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return isValidJamaatTimes(data) ? data : null;
  } catch {
    return null;
  }
}

function fsWrite(path: string, data: JamaatTimes): void {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`[jamaat] write to ${path} failed:`, e);
  }
}

// ── Optional: GitHub API commit (requires GITHUB_TOKEN) ───────────────────────
async function commitToGitHub(data: JamaatTimes): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return;

  const GH_OWNER  = "asjad-rehman";
  const GH_REPO   = "ichattiesburg";
  const GH_BRANCH = "main";
  const GH_PATH   = "public/jamaat.json";
  const API_URL   = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const shaRes = await fetch(API_URL, { headers });
  if (!shaRes.ok) throw new Error(`GitHub GET failed: ${shaRes.status}`);
  const { sha } = await shaRes.json() as { sha: string };

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const putRes  = await fetch(API_URL, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "chore: update jamaat/iqama times via admin",
      content,
      sha,
      branch: GH_BRANCH,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(`GitHub PUT failed ${putRes.status}: ${(err as { message?: string }).message}`);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function getJamaatTimes(): Promise<JamaatTimes> {
  // 1. In-process cache (fastest path)
  if (_mem && isValidJamaatTimes(_mem)) return { ..._mem };

  // 2. /tmp — writable temp FS, persists within the same Lambda container
  const fromTmp = fsRead(TMP_PATH);
  if (fromTmp) {
    _mem = fromTmp;
    return { ..._mem };
  }

  // 3. Committed bundle file — always present on cold start
  const fromBundle = fsRead(BUNDLE_PATH);
  if (fromBundle) {
    _mem = fromBundle;
    return { ..._mem };
  }

  // 4. Hardcoded defaults
  _mem = { ...DEFAULTS };
  return { ..._mem };
}

export async function saveJamaatTimes(data: JamaatTimes): Promise<void> {
  if (!isValidJamaatTimes(data)) throw new Error("Invalid jamaat payload");
  const payload: JamaatTimes = { ...data, updatedAt: new Date().toISOString() };

  // 1. In-process cache — immediate, visible on next read within this process
  _mem = payload;

  // 2. /tmp file — durable within the Lambda container across warm requests
  fsWrite(TMP_PATH, payload);

  // 3. GitHub commit — optional, provides true cross-instance + cold-start persistence
  //    Fire-and-forget: don't block the admin save response
  commitToGitHub(payload).catch((e) =>
    console.warn("[jamaat] GitHub commit skipped (no token or error):", e?.message)
  );
}
