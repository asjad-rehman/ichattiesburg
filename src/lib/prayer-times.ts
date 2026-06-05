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
    const [timesRes, jumuahRes] = await Promise.all([
      fetch(`${GITHUB_RAW_BASE}/prayer-times.json`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${GITHUB_RAW_BASE}/jumuah.json`, { next: { revalidate: 3600 } }),
    ]);

    const prayerTimes: PrayerTimes = timesRes.ok
      ? await timesRes.json()
      : getFallbackTimes();

    const jumuah: JumuahSchedule = jumuahRes.ok
      ? await jumuahRes.json()
      : getFallbackJumuah();

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
