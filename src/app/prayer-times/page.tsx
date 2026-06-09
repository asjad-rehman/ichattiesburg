import { fetchPrayerTimes } from "@/lib/prayer-times";
import PrayerTimesClient from "@/components/prayer-times-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer Times",
  description: "Daily prayer times and Jumuah schedule for the Islamic Center of Hattiesburg.",
};

export const dynamic = "force-dynamic";

export default async function PrayerTimesPage() {
  const { prayerTimes, jamaatTimes, jumuah } = await fetchPrayerTimes();
  return <PrayerTimesClient prayerTimes={prayerTimes} jamaatTimes={jamaatTimes} jumuah={jumuah} />;
}
