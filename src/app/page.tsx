import { fetchPrayerTimes } from "@/lib/prayer-times";
import { store } from "@/lib/store";
import HomeClient from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ prayerTimes, jamaatTimes }, settings] = await Promise.all([
    fetchPrayerTimes(),
    store.getSettings(),
  ]);
  return <HomeClient prayerTimes={prayerTimes} jamaatTimes={jamaatTimes} settings={settings} />;
}

