import { fetchPrayerTimes } from "@/lib/prayer-times";
import HomeClient from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { prayerTimes, jamaatTimes } = await fetchPrayerTimes();
  return <HomeClient prayerTimes={prayerTimes} jamaatTimes={jamaatTimes} />;
}
