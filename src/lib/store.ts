/**
 * Serverless data store — zero external dependencies.
 *
 * Each collection (board, announcements, events) is backed by three layers:
 *   1. Module-level _mem cache   — fastest; shared across requests on same warm instance
 *   2. /tmp/<collection>.json    — writable temp FS; survives across warm requests on same Lambda
 *   3. public/<collection>.json  — committed bundle baseline; always available on cold start
 *
 * Admin saves write to _mem + /tmp. The committed JSON files are updated via GitHub API
 * when GITHUB_TOKEN is available (optional — bakes changes into future deployments).
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  endTime?: string;
  location?: string;
  category: string;
  featured: boolean;
  recurring?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: "normal" | "urgent";
  created_at: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
}

// ── FS helpers ────────────────────────────────────────────────────────────────
function fsRead<T>(tmpPath: string, bundlePath: string, fallback: T): T {
  // Try /tmp first (latest admin saves on this container)
  try {
    if (existsSync(tmpPath)) {
      const data = JSON.parse(readFileSync(tmpPath, "utf-8"));
      if (Array.isArray(data)) return data as T;
    }
  } catch { /* ignore */ }

  // Fall back to committed bundle file
  try {
    if (existsSync(bundlePath)) {
      const data = JSON.parse(readFileSync(bundlePath, "utf-8"));
      if (Array.isArray(data)) return data as T;
    }
  } catch { /* ignore */ }

  return fallback;
}

function fsPersist(tmpPath: string, data: unknown): void {
  try {
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`[store] /tmp write failed (${tmpPath}):`, e);
  }
}

// ── GitHub API commit (optional, fire-and-forget) ────────────────────────────
async function commitToGitHub(ghPath: string, content: unknown, message: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return;

  const apiUrl = `https://api.github.com/repos/asjad-rehman/ichattiesburg/contents/${ghPath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const shaRes = await fetch(apiUrl, { headers });
    if (!shaRes.ok) return;
    const { sha } = await shaRes.json() as { sha: string };
    const b64 = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
    await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({ message, content: b64, sha, branch: "main" }),
    });
  } catch (e) {
    console.warn("[store] GitHub commit skipped:", e);
  }
}

// ── Collection factory ────────────────────────────────────────────────────────
function makeCollection<T extends { id: string }>(name: string, seed: T[]) {
  const tmpPath    = `/tmp/ichattiesburg-${name}.json`;
  const bundlePath = join(process.cwd(), "public", `${name}.json`);
  const ghPath     = `public/${name}.json`;

  let _mem: T[] | null = null;

  function get(): T[] {
    if (_mem !== null) return _mem;
    _mem = fsRead<T[]>(tmpPath, bundlePath, seed);
    return _mem;
  }

  function save(items: T[]): void {
    _mem = items;
    fsPersist(tmpPath, items);
    commitToGitHub(ghPath, items, `chore: update ${name} via admin`).catch(() => {/* logged inside */});
  }

  return { get, save };
}

// ── Collections ───────────────────────────────────────────────────────────────
const now = new Date();
const nextDay = (d: Date, dow: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + ((dow - r.getDay() + 7) % 7 || 7));
  return r;
};

const SEED_EVENTS: EventItem[] = [
  {
    id: "e1", title: "Jumuah Prayers",
    description: "Weekly Friday congregational prayer and khutbah. All are welcome. (Recurring every week)",
    date: nextDay(now, 5).toISOString().split("T")[0],
    time: "13:00", endTime: "14:00",
    location: "Islamic Center of Hattiesburg",
    category: "jumuah", featured: true, recurring: true,
  },
  {
    id: "e2", title: "Friday Halaqah",
    description: "Weekly gathering and discussion every Friday from Maghreb to Isha. (Recurring every week)",
    date: nextDay(now, 5).toISOString().split("T")[0],
    time: "19:00", endTime: "20:30",
    location: "ICH Main Hall",
    category: "halaqa", featured: true, recurring: true,
  },
  {
    id: "e3", title: "Sunday School",
    description: "Islamic education and activities for the youth. (Recurring every week - Currently off for summer)",
    date: nextDay(now, 0).toISOString().split("T")[0],
    time: "10:00", endTime: "13:00",
    location: "ICH Classrooms",
    category: "community", featured: true, recurring: true,
  },
];

const _board         = makeCollection<BoardMember>("board", []);
const _announcements = makeCollection<Announcement>("announcements", []);
const _events        = makeCollection<EventItem>("events", SEED_EVENTS);

// ── Public store API ──────────────────────────────────────────────────────────
export const store = {
  // Board
  getBoard: ()                          => _board.get(),
  addBoardMember: (data: Omit<BoardMember, "id">) => {
    const items = [..._board.get(), { ...data, id: randomUUID() }];
    _board.save(items);
    return items[items.length - 1];
  },
  updateBoardMember: (id: string, data: Partial<BoardMember>) => {
    const items = _board.get().map(b => b.id === id ? { ...b, ...data } : b);
    _board.save(items);
    return items.find(b => b.id === id) ?? null;
  },
  deleteBoardMember: (id: string) => {
    _board.save(_board.get().filter(b => b.id !== id));
  },

  // Announcements
  getAnnouncements: ()                              => _announcements.get(),
  addAnnouncement: (data: Omit<Announcement, "id" | "created_at">) => {
    const item: Announcement = { ...data, id: randomUUID(), created_at: new Date().toISOString() };
    _announcements.save([item, ..._announcements.get()]);
    return item;
  },
  updateAnnouncement: (id: string, data: Partial<Announcement>) => {
    const items = _announcements.get().map(a => a.id === id ? { ...a, ...data } : a);
    _announcements.save(items);
    return items.find(a => a.id === id) ?? null;
  },
  deleteAnnouncement: (id: string) => {
    _announcements.save(_announcements.get().filter(a => a.id !== id));
  },

  // Events
  getEvents: ()                          => _events.get(),
  addEvent: (data: Omit<EventItem, "id">) => {
    const item: EventItem = { ...data, id: randomUUID() };
    const items = [..._events.get(), item].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    _events.save(items);
    return item;
  },
  updateEvent: (id: string, data: Partial<EventItem>) => {
    const items = _events.get()
      .map(e => e.id === id ? { ...e, ...data } : e)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    _events.save(items);
    return items.find(e => e.id === id) ?? null;
  },
  deleteEvent: (id: string) => {
    _events.save(_events.get().filter(e => e.id !== id));
  },
};

// Keep memoryStore alias so existing API routes that import it still compile
// (we'll update them too, but this prevents a broken build in the meantime)
export const memoryStore = {
  get board()         { return _board.get(); },
  get announcements() { return _announcements.get(); },
  get events()        { return _events.get(); },
};
