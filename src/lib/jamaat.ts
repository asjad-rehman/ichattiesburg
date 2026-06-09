/**
 * Jamaat (Iqama) times — fully serverless, no database.
 *
 * Source of truth: `public/jamaat.json` in the GitHub repo.
 *
 * Read:  fetch from raw.githubusercontent.com (CDN, always fresh)
 * Write: GitHub Contents API (PUT) — requires GITHUB_TOKEN env var on Vercel
 *
 * Local dev without GITHUB_TOKEN: falls back to a module-level in-memory store.
 */

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

// ── Config ────────────────────────────────────────────────────────────────────
const GH_OWNER  = "asjad-rehman";
const GH_REPO   = "ichattiesburg";
const GH_BRANCH = "main";
const GH_PATH   = "public/jamaat.json";

const RAW_URL = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${GH_PATH}`;
const API_URL = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`;

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

// ── Local dev fallback (in-memory) ────────────────────────────────────────────
let _devMem: JamaatTimes | null = null;

// ── Read ──────────────────────────────────────────────────────────────────────
export async function getJamaatTimes(): Promise<JamaatTimes> {
  // If no GitHub token (local dev), use in-memory fallback
  if (!process.env.GITHUB_TOKEN) {
    return _devMem ? { ..._devMem } : { ...DEFAULTS };
  }

  try {
    // cache: "no-store" so pages always get the latest committed file
    const res = await fetch(RAW_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (isValidJamaatTimes(data)) return data;
    }
  } catch (e) {
    console.error("[jamaat] fetch from GitHub failed:", e);
  }

  return { ...DEFAULTS };
}

// ── Write ─────────────────────────────────────────────────────────────────────
export async function saveJamaatTimes(data: JamaatTimes): Promise<void> {
  if (!isValidJamaatTimes(data)) throw new Error("Invalid jamaat payload");
  const payload = { ...data, updatedAt: new Date().toISOString() };

  const token = process.env.GITHUB_TOKEN;

  // Local dev — just update in-memory store
  if (!token) {
    _devMem = payload;
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Step 1: get the current file SHA (required by the GitHub API for updates)
  const shaRes = await fetch(API_URL, { headers });
  if (!shaRes.ok) {
    const err = await shaRes.json();
    throw new Error(`GitHub API (GET) error ${shaRes.status}: ${err.message}`);
  }
  const { sha } = await shaRes.json() as { sha: string };

  // Step 2: PUT the updated content
  const content = Buffer.from(JSON.stringify(payload, null, 2)).toString("base64");

  const putRes = await fetch(API_URL, {
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
    throw new Error(`GitHub API (PUT) error ${putRes.status}: ${err.message}`);
  }
}
