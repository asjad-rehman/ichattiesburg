import React from "react";
import { Metadata } from "next";
import { memoryStore } from "@/lib/store";
import EventsClient, { EventItem } from "@/components/events-client";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at the Islamic Center of Hattiesburg including Jumuah, Eid prayers, halaqas, and community programs.",
};

// Remove revalidate since we are using memory store
export const dynamic = "force-dynamic";

async function getEvents(): Promise<EventItem[]> {
  const events = memoryStore.events.map(e => ({ ...e })); // Deep copy to avoid mutating store on render
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let e of events) {
    if (e.recurring) {
      let d = new Date(e.date);
      // Auto-forward past recurring events to the next upcoming week
      while (d < today) {
        d.setDate(d.getDate() + 7);
      }
      e.date = d.toISOString().split("T")[0];
    }
  }

  // Sort events by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Filter out non-recurring past events
  return events.filter(e => new Date(e.date) >= today || e.recurring);
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
