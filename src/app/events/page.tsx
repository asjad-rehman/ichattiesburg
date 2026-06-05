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
      title: "Jumuah Prayers",
      description: "Weekly Friday congregational prayer and khutbah. All are welcome. (Recurring every week)",
      date: nextDay(now, 5).toISOString().split("T")[0],
      time: "13:00",
      endTime: "14:00",
      location: "Islamic Center of Hattiesburg",
      category: "jumuah",
      featured: true,
    },
    {
      id: "2",
      title: "Friday Halaqah",
      description: "Weekly gathering and discussion every Friday from Maghreb to Isha. (Recurring every week)",
      date: nextDay(now, 5).toISOString().split("T")[0],
      time: "19:00",
      endTime: "20:30",
      location: "ICH Main Hall",
      category: "halaqa",
      featured: true,
    },
    {
      id: "3",
      title: "Sunday School",
      description: "Islamic education and activities for the youth. (Recurring every week - Currently off for summer)",
      date: nextDay(now, 0).toISOString().split("T")[0],
      time: "10:00",
      endTime: "13:00",
      location: "ICH Classrooms",
      category: "education",
      featured: true,
    },
  ];
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
