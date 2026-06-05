import { memoryStore } from "@/lib/store";

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date?: string;
}

export interface JumuahSchedule {
  khutbah: string;
  salah: string;
  speaker?: string;
  topic?: string;
}

export interface MasjidTimes {
  prayerTimes: PrayerTimes;
  jumuah: JumuahSchedule;
  lastUpdated: string;
}

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/asjad-rehman/masjid-times/main";

export async function fetchPrayerTimes(): Promise<MasjidTimes> {
  try {
    const [baseRes, jamaatRes] = await Promise.all([
      fetch(`${GITHUB_RAW_BASE}/prayer-times.json`, { next: { revalidate: 3600 } }),
      fetch(`https://masjid-times.vercel.app/api/jamaat`, { next: { revalidate: 60 } })
    ]);

    const baseTimes: PrayerTimes = baseRes.ok ? await baseRes.json() : getFallbackTimes();
    
    let prayerTimes = { ...baseTimes };
    let jumuah = getFallbackJumuah();
    
    if (jamaatRes.ok) {
      const jamaatData = await jamaatRes.json();
      if (jamaatData?.ok && jamaatData?.data) {
        const d = jamaatData.data;
        prayerTimes = {
          ...prayerTimes,
          fajr: d.fajr || prayerTimes.fajr,
          dhuhr: d.dhuhr || prayerTimes.dhuhr,
          asr: d.asr || prayerTimes.asr,
          maghrib: d.maghrib || prayerTimes.maghrib,
          isha: d.isha || prayerTimes.isha,
        };
        
        if (d.jummah && Array.isArray(d.jummah) && d.jummah.length > 0) {
          const j1 = d.jummah[0];
          const j2 = d.jummah.length > 1 ? d.jummah[1] : null;
          jumuah = {
            khutbah: j1?.khutbah || "13:15",
            salah: j2?.khutbah || "14:15",
            speaker: "Imam",
            topic: "TBA",
          };
        }
      }
    }

    // Apply Admin Overrides from memoryStore
    const overrides = memoryStore.prayerOverrides;
    if (overrides) {
      if (overrides.fajr) prayerTimes.fajr = overrides.fajr;
      if (overrides.sunrise) prayerTimes.sunrise = overrides.sunrise;
      if (overrides.dhuhr) prayerTimes.dhuhr = overrides.dhuhr;
      if (overrides.asr) prayerTimes.asr = overrides.asr;
      if (overrides.maghrib) prayerTimes.maghrib = overrides.maghrib;
      if (overrides.isha) prayerTimes.isha = overrides.isha;
      
      if (overrides.jumuah_khutbah) jumuah.khutbah = overrides.jumuah_khutbah;
      if (overrides.jumuah_salah) jumuah.salah = overrides.jumuah_salah;
      if (overrides.jumuah_speaker) jumuah.speaker = overrides.jumuah_speaker;
      if (overrides.jumuah_topic) jumuah.topic = overrides.jumuah_topic;
    }

    return { prayerTimes, jumuah, lastUpdated: new Date().toISOString() };
  } catch {
    return {
      prayerTimes: getFallbackTimes(),
      jumuah: getFallbackJumuah(),
      lastUpdated: new Date().toISOString(),
    };
  }
}

function getFallbackTimes(): PrayerTimes {
  return {
    fajr: "5:30",
    sunrise: "6:52",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:48",
    isha: "20:15",
  };
}

function getFallbackJumuah(): JumuahSchedule {
  return {
    khutbah: "13:15",
    salah: "14:15",
    speaker: "Imam",
    topic: "TBA",
  };
}
