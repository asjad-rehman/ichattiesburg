import { Coordinates, CalculationMethod, Madhab, PrayerTimes as AdhanPrayerTimes, CalculationParameters } from "adhan";
import { masjid } from "@/config/masjid";
import { fmtDateTime12, todayInMasjidTZ } from "@/lib/time";
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

function calcAdhanTimes(date: Date): AdhanPrayerTimes {
  const coords = new Coordinates(masjid.coordinates.lat, masjid.coordinates.lon);

  let params: CalculationParameters;
  switch (masjid.calc.method) {
    case "MUSLIM_WORLD_LEAGUE": params = CalculationMethod.MuslimWorldLeague(); break;
    case "EGYPTIAN":            params = CalculationMethod.Egyptian(); break;
    case "KARACHI":             params = CalculationMethod.Karachi(); break;
    case "UMM_AL_QURA":        params = CalculationMethod.UmmAlQura(); break;
    default:                    params = CalculationMethod.NorthAmerica();
  }

  if (typeof masjid.calc.fajrAngle === "number") params.fajrAngle = masjid.calc.fajrAngle;
  if (typeof masjid.calc.ishaAngle === "number")  params.ishaAngle = masjid.calc.ishaAngle;
  params.madhab = masjid.calc.madhab === "HANAFI" ? Madhab.Hanafi : Madhab.Shafi;

  return new AdhanPrayerTimes(coords, date, params);
}

function fmt(d: Date): string {
  return fmtDateTime12(d, masjid.timezone);
}

export async function fetchPrayerTimes(): Promise<MasjidTimes> {
  const now = new Date();
  const today = todayInMasjidTZ(now, masjid.timezone);
  const pt = calcAdhanTimes(today);

  const prayerTimes: PrayerTimes = {
    fajr:    fmt(pt.fajr),
    sunrise: fmt(pt.sunrise),
    dhuhr:   fmt(pt.dhuhr),
    asr:     fmt(pt.asr),
    maghrib: fmt(pt.maghrib),
    isha:    fmt(pt.isha),
  };

  const jamaat = await getJamaatTimes();

  const j1 = jamaat.jummah[0] ?? { khutbah: "12:45", salah: "13:15" };
  const j2 = jamaat.jummah[1];
  const jumuah: JumuahSchedule = {
    khutbah: j1.khutbah,
    salah:   j2 ? j2.khutbah : j1.salah,
    speaker: "Imam",
    topic:   "TBA",
  };

  return { prayerTimes, jamaatTimes: jamaat, jumuah, lastUpdated: now.toISOString() };
}
