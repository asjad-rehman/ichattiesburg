import React from "react";
import { Metadata } from "next";
import { query } from "@/lib/db";
import EventsClient, { EventItem } from "@/components/events-client";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at the Islamic Center of Hattiesburg including Jumuah, Eid prayers, halaqas, and community programs.",
};

export const revalidate = 3600;

async function getEvents(): Promise<EventItem[]> {
  try {
    const dbEvents = await query<any>(
      'SELECT id, title, description, date::text as date, time::text as time, end_time::text as "endTime", location, category, featured FROM events ORDER BY date ASC, time ASC'
    );
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents.map((e: any) => ({
        id: String(e.id),
        title: e.title,
        description: e.description,
        date: e.date,
        time: e.time ? e.time.substring(0, 5) : undefined,
        endTime: e.endTime ? e.endTime.substring(0, 5) : undefined,
        location: e.location,
        category: e.category,
        featured: !!e.featured,
      }));
    }
  } catch (err) {
    console.warn("Failed to query events table, using default fallbacks:", err);
  }

  // Fallback to sample events from the new zip design
  const now = new Date();
  const nextDay = (d: Date, dow: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + (dow - r.getDay() + 7) % 7 || 7);
    return r;
  };

  return [
    {
      id: "1",
      title: "Jumuah Prayer",
      description: "Weekly Friday prayer with khutbah. All are welcome.",
      date: nextDay(now, 5).toISOString().split("T")[0],
      time: "13:00",
      endTime: "14:00",
      location: "Islamic Center of Hattiesburg",
      category: "jumuah",
      featured: true,
    },
    {
      id: "2",
      title: "Weekend Halaqa",
      description: "Quranic tafsir and Islamic discussion for the community.",
      date: nextDay(now, 0).toISOString().split("T")[0],
      time: "10:00",
      endTime: "11:30",
      location: "ICH Main Hall",
      category: "halaqa",
      featured: false,
    },
    {
      id: "3",
      title: "Oak Grove Fundraiser Dinner",
      description: "Annual fundraiser dinner to support our new masjid building project in Oak Grove. Dinner and program included.",
      date: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString().split("T")[0],
      time: "18:00",
      endTime: "21:00",
      location: "TBA",
      category: "fundraiser",
      featured: true,
    },
    {
      id: "4",
      title: "Youth Islamic Program",
      description: "Weekly Islamic education and activities for children ages 6–16.",
      date: nextDay(now, 6).toISOString().split("T")[0],
      time: "10:00",
      endTime: "12:00",
      location: "ICH Classroom",
      category: "community",
      featured: false,
    },
    {
      id: "5",
      title: "Sisters Halaqa",
      description: "Monthly gathering for sisters — Quran recitation, Islamic discussions, and community bonding.",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString().split("T")[0],
      time: "19:00",
      endTime: "20:30",
      location: "ICH Sisters Hall",
      category: "halaqa",
      featured: false,
    },
  ];
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
