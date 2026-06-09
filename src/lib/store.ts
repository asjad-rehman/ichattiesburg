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

// Global in-memory store
export const memoryStore = {
  events: [] as EventItem[],
  announcements: [] as Announcement[],
  board: [] as BoardMember[],
};

// Seed some initial data so it looks populated on cold start
const now = new Date();
const nextDay = (d: Date, dow: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + (dow - r.getDay() + 7) % 7 || 7);
  return r;
};

memoryStore.announcements.push({
  id: "1",
  title: "Welcome to the new ICH Website",
  body: "We have launched our new website. Please check out the prayer times and events schedule.",
  priority: "normal",
  created_at: new Date().toISOString(),
});

memoryStore.board.push(
  { id: "b1", name: 'Abdul Karim',                  role: 'President' },
  { id: "b2", name: 'Muhammad Asjad Rehman Hashmi', role: 'Vice President & Imam' },
  { id: "b3", name: 'Vacant',                       role: 'Secretary' },
  { id: "b4", name: 'Mohammed Kher Bni Salameh',    role: 'Treasurer' },
  { id: "b5", name: 'Musa Al Hadwan',               role: 'Maintenance' },
  { id: "b6", name: 'Sayed Ul Akbar Murad',         role: 'Tech Lead' }
);

memoryStore.events.push(
  {
    id: "e1",
    title: "Jumuah Prayers",
    description: "Weekly Friday congregational prayer and khutbah. All are welcome. (Recurring every week)",
    date: nextDay(now, 5).toISOString().split("T")[0],
    time: "13:00",
    endTime: "14:00",
    location: "Islamic Center of Hattiesburg",
    category: "jumuah",
    featured: true,
    recurring: true,
  },
  {
    id: "e2",
    title: "Friday Halaqah",
    description: "Weekly gathering and discussion every Friday from Maghreb to Isha. (Recurring every week)",
    date: nextDay(now, 5).toISOString().split("T")[0],
    time: "19:00",
    endTime: "20:30",
    location: "ICH Main Hall",
    category: "halaqa",
    featured: true,
    recurring: true,
  },
  {
    id: "e3",
    title: "Sunday School",
    description: "Islamic education and activities for the youth. (Recurring every week - Currently off for summer)",
    date: nextDay(now, 0).toISOString().split("T")[0],
    time: "10:00",
    endTime: "13:00",
    location: "ICH Classrooms",
    category: "community",
    featured: true,
    recurring: true,
  }
);
