import { fetchPrayerTimes } from "@/lib/prayer-times";
import HomeClient from "@/components/home-client";

export const revalidate = 3600;

export default async function HomePage() {
  const { prayerTimes, jumuah } = await fetchPrayerTimes();
  return <HomeClient prayerTimes={prayerTimes} jumuah={jumuah} />;
}
