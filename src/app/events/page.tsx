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
  const events = [...memoryStore.events];
  // Sort events by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return events;
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
