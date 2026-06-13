import { randomUUID } from "crypto";
import { remoteRead, remoteWrite } from "./remote-storage";
import { parseLocalDate } from "./utils";

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

// ── Collection factory ────────────────────────────────────────────────────────
function makeCollection<T extends { id: string }>(name: string, seed: T[]) {
  let _mem: T[] | null = null;
  let _memExpiry = 0;

  async function get(bypassCache = false): Promise<T[]> {
    const now = Date.now();
    if (!bypassCache && _mem !== null && now < _memExpiry) return _mem;
    
    _mem = await remoteRead<T[]>(name, seed);
    _memExpiry = now + 10000; // Cache for 10 seconds
    return _mem;
  }

  async function save(items: T[]): Promise<void> {
    _mem = items;
    _memExpiry = Date.now() + 10000;
    await remoteWrite<T[]>(name, items);
  }

  return { get, save };
}

// ── Collections ───────────────────────────────────────────────────────────────
const _board         = makeCollection<BoardMember>("board", []);
const _announcements = makeCollection<Announcement>("announcements", []);
const _events        = makeCollection<EventItem>("events", []);

// ── Public store API ──────────────────────────────────────────────────────────
export const store = {
  // Board
  getBoard: async (bypassCache = false) => _board.get(bypassCache),
  addBoardMember: async (data: Omit<BoardMember, "id">) => {
    const current = await _board.get(true);
    const newItem = { ...data, id: randomUUID() };
    const items = [...current, newItem];
    await _board.save(items);
    return newItem;
  },
  updateBoardMember: async (id: string, data: Partial<BoardMember>) => {
    const current = await _board.get(true);
    const items = current.map(b => b.id === id ? { ...b, ...data } : b);
    await _board.save(items);
    return items.find(b => b.id === id) ?? null;
  },
  deleteBoardMember: async (id: string) => {
    const current = await _board.get(true);
    await _board.save(current.filter(b => b.id !== id));
  },

  // Announcements
  getAnnouncements: async (bypassCache = false) => _announcements.get(bypassCache),
  addAnnouncement: async (data: Omit<Announcement, "id" | "created_at">) => {
    const current = await _announcements.get(true);
    const item: Announcement = { ...data, id: randomUUID(), created_at: new Date().toISOString() };
    await _announcements.save([item, ...current]);
    return item;
  },
  updateAnnouncement: async (id: string, data: Partial<Announcement>) => {
    const current = await _announcements.get(true);
    const items = current.map(a => a.id === id ? { ...a, ...data } : a);
    await _announcements.save(items);
    return items.find(a => a.id === id) ?? null;
  },
  deleteAnnouncement: async (id: string) => {
    const current = await _announcements.get(true);
    await _announcements.save(current.filter(a => a.id !== id));
  },

  // Events
  getEvents: async (bypassCache = false) => _events.get(bypassCache),
  addEvent: async (data: Omit<EventItem, "id">) => {
    const current = await _events.get(true);
    const item: EventItem = { ...data, id: randomUUID() };
    const items = [...current, item].sort(
      (a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
    );
    await _events.save(items);
    return item;
  },
  updateEvent: async (id: string, data: Partial<EventItem>) => {
    const current = await _events.get(true);
    const items = current
      .map(e => e.id === id ? { ...e, ...data } : e)
      .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());
    await _events.save(items);
    return items.find(e => e.id === id) ?? null;
  },
  deleteEvent: async (id: string) => {
    const current = await _events.get(true);
    await _events.save(current.filter(e => e.id !== id));
  },
};

export const memoryStore = {
  get board()         { return store.getBoard(); },
  get announcements() { return store.getAnnouncements(); },
  get events()        { return store.getEvents(); },
};
