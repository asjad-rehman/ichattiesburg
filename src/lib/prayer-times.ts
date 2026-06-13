import { masjid } from "@/config/masjid";
import { fmt12From24 } from "@/lib/time";
import { getJamaatTimes, type JamaatTimes } from "@/lib/jamaat";

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface JumuahSchedule {
  khutbah: string;
  salah: string;
  speaker?: string;
  topic?: string;
}

export interface MasjidTimes {
  prayerTimes: PrayerTimes;
  jamaatTimes: JamaatTimes;
  jumuah: JumuahSchedule;
  lastUpdated: string;
}

export async function fetchPrayerTimes(): Promise<MasjidTimes> {
  const now = new Date();
  
  let methodId = 2; // North America (ISNA) default
  if (masjid.calc.method === "MUSLIM_WORLD_LEAGUE") methodId = 3;
  else if (masjid.calc.method === "EGYPTIAN") methodId = 5;
  else if (masjid.calc.method === "KARACHI") methodId = 1;
  else if (masjid.calc.method === "UMM_AL_QURA") methodId = 4;

  const school = masjid.calc.madhab === "HANAFI" ? 1 : 0;

  let apiTimes = {
    fajr: "04:30",
    sunrise: "05:50",
    dhuhr: "13:00",
    asr: "16:30",
    maghrib: "20:00",
    isha: "21:30",
  };

  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${masjid.coordinates.lat}&longitude=${masjid.coordinates.lon}&method=${methodId}&school=${school}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.timings) {
        const t = json.data.timings;
        apiTimes = {
          fajr: t.Fajr || apiTimes.fajr,
          sunrise: t.Sunrise || apiTimes.sunrise,
          dhuhr: t.Dhuhr || apiTimes.dhuhr,
          asr: t.Asr || apiTimes.asr,
          maghrib: t.Maghrib || apiTimes.maghrib,
          isha: t.Isha || apiTimes.isha,
        };
      }
    }
  } catch (e) {
    console.error("API fetch error:", e);
  }

  const prayerTimes: PrayerTimes = {
    fajr:    fmt12From24(apiTimes.fajr),
    sunrise: fmt12From24(apiTimes.sunrise),
    dhuhr:   fmt12From24(apiTimes.dhuhr),
    asr:     fmt12From24(apiTimes.asr),
    maghrib: fmt12From24(apiTimes.maghrib),
    isha:    fmt12From24(apiTimes.isha),
  };

  const jamaat = await getJamaatTimes();

  const j1 = jamaat.jummah[0] ?? { khutbah: "12:45", salah: "13:15" };
  const j2 = jamaat.jummah[1];
  const jumuah: JumuahSchedule = {
    khutbah: j1.khutbah,
    salah:   j2 ? j2.salah : j1.salah,
    speaker: "Imam",
    topic:   "TBA",
  };

  return { prayerTimes, jamaatTimes: jamaat, jumuah, lastUpdated: now.toISOString() };
}
