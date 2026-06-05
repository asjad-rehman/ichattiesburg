import type { Metadata } from "next";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/types";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at the Islamic Center of Hattiesburg including Jumuah, Eid prayers, halaqas, and community programs.",
};

const CATEGORY_COLORS: Record<Event["category"], string> = {
  jumuah: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  eid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  halaqa: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  fundraiser: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  construction: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  community: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

async function getEvents(): Promise<Event[]> {
  // In production, fetch from DB. Provide sample data for MVP.
  const now = new Date();
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Jumuah Prayer",
      description: "Weekly Friday prayer with khutbah. All are welcome.",
      date: getNextFriday(now).toISOString(),
      time: "13:00",
      endTime: "14:00",
      location: "Islamic Center of Hattiesburg",
      category: "jumuah",
      featured: true,
      createdAt: now.toISOString(),
    },
    {
      id: "2",
      title: "Weekend Halaqa",
      description: "Quranic tafsir and Islamic discussion for the community.",
      date: getNextSunday(now).toISOString(),
      time: "10:00",
      endTime: "11:30",
      location: "ICH Main Hall",
      category: "halaqa",
      featured: false,
      createdAt: now.toISOString(),
    },
    {
      id: "3",
      title: "Oak Grove Fundraiser Dinner",
      description: "Annual fundraiser dinner to support our new masjid building project in Oak Grove.",
      date: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString(),
      time: "18:00",
      endTime: "21:00",
      location: "TBA",
      category: "fundraiser",
      featured: true,
      createdAt: now.toISOString(),
    },
    {
      id: "4",
      title: "Youth Program",
      description: "Weekly youth Islamic education and activities for children ages 6–16.",
      date: getNextSaturday(now).toISOString(),
      time: "10:00",
      endTime: "12:00",
      location: "ICH Classroom",
      category: "community",
      featured: false,
      createdAt: now.toISOString(),
    },
  ];
  return sampleEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getNextFriday(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7));
  return d;
}
function getNextSaturday(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d;
}
function getNextSunday(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + ((0 - d.getDay() + 7) % 7 || 7));
  return d;
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventTime(time?: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
}

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getEvents();
  const featured = events.filter((e) => e.featured);
  const upcoming = events.filter((e) => !e.featured);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Events</h1>
        <p className="text-muted-foreground">
          Upcoming programs, prayers, and community events at ICH
        </p>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-sm">
            Featured Events
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        </div>
      )}

      {/* All upcoming */}
      <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-sm">
        All Upcoming
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No upcoming events at this time. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, featured }: { event: Event; featured?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border border-border p-5 bg-card hover:border-primary/40 transition-colors",
      featured && "border-primary/30 bg-primary/5"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full shrink-0 capitalize", CATEGORY_COLORS[event.category])}>
          {event.category}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{event.description}</p>
      <div className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
          {formatEventDate(event.date)}
        </div>
        {event.time && (
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            {formatEventTime(event.time)}
            {event.endTime && ` – ${formatEventTime(event.endTime)}`}
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
}
