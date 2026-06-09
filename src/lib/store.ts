import { randomUUID } from "crypto";
import { remoteRead, remoteWrite } from "./remote-storage";

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

  async function get(): Promise<T[]> {
    if (_mem !== null) return _mem;
    _mem = await remoteRead<T[]>(name, seed);
    return _mem;
  }

  async function save(items: T[]): Promise<void> {
    _mem = items;
    await remoteWrite<T[]>(name, items);
  }

  return { get, save };
}

// ── Collections ───────────────────────────────────────────────────────────────
const _board         = makeCollection<BoardMember>("board", []);
const _announcements = makeCollection<Announcement>("announcements", []);
const _events        = makeCollection<EventItem>("events", []); // public/events.json has seed

// ── Public store API ──────────────────────────────────────────────────────────
export const store = {
  // Board
  getBoard: async () => _board.get(),
  addBoardMember: async (data: Omit<BoardMember, "id">) => {
    const current = await _board.get();
    const newItem = { ...data, id: randomUUID() };
    const items = [...current, newItem];
    await _board.save(items);
    return newItem;
  },
  updateBoardMember: async (id: string, data: Partial<BoardMember>) => {
    const current = await _board.get();
    const items = current.map(b => b.id === id ? { ...b, ...data } : b);
    await _board.save(items);
    return items.find(b => b.id === id) ?? null;
  },
  deleteBoardMember: async (id: string) => {
    const current = await _board.get();
    await _board.save(current.filter(b => b.id !== id));
  },

  // Announcements
  getAnnouncements: async () => _announcements.get(),
  addAnnouncement: async (data: Omit<Announcement, "id" | "created_at">) => {
    const current = await _announcements.get();
    const item: Announcement = { ...data, id: randomUUID(), created_at: new Date().toISOString() };
    await _announcements.save([item, ...current]);
    return item;
  },
  updateAnnouncement: async (id: string, data: Partial<Announcement>) => {
    const current = await _announcements.get();
    const items = current.map(a => a.id === id ? { ...a, ...data } : a);
    await _announcements.save(items);
    return items.find(a => a.id === id) ?? null;
  },
  deleteAnnouncement: async (id: string) => {
    const current = await _announcements.get();
    await _announcements.save(current.filter(a => a.id !== id));
  },

  // Events
  getEvents: async () => _events.get(),
  addEvent: async (data: Omit<EventItem, "id">) => {
    const current = await _events.get();
    const item: EventItem = { ...data, id: randomUUID() };
    const items = [...current, item].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    await _events.save(items);
    return item;
  },
  updateEvent: async (id: string, data: Partial<EventItem>) => {
    const current = await _events.get();
    const items = current
      .map(e => e.id === id ? { ...e, ...data } : e)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    await _events.save(items);
    return items.find(e => e.id === id) ?? null;
  },
  deleteEvent: async (id: string) => {
    const current = await _events.get();
    await _events.save(current.filter(e => e.id !== id));
  },
};

// Keep memoryStore alias so existing references compile, but making getters async is tricky.
// We'll update the API routes to use the clean async `store` functions instead of memoryStore.
export const memoryStore = {
  get board()         { return store.getBoard(); },
  get announcements() { return store.getAnnouncements(); },
  get events()        { return store.getEvents(); },
};
