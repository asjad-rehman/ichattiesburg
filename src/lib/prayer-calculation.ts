import { CalculationMethod, Madhab } from "adhan";
import { masjid } from "@/config/masjid";

export function getPrayerCalculationParameters() {
  const params = (() => {
    switch (masjid.calc.method) {
      case "MUSLIM_WORLD_LEAGUE": return CalculationMethod.MuslimWorldLeague();
      case "EGYPTIAN": return CalculationMethod.Egyptian();
      case "KARACHI": return CalculationMethod.Karachi();
      case "UMM_AL_QURA": return CalculationMethod.UmmAlQura();
      default: return CalculationMethod.NorthAmerica();
    }
  })();

  // Darul Qasim's position: true dawn and Isha begin at 18 degrees.
  // These explicit values override the selected method's preset angles.
  params.fajrAngle = masjid.calc.fajrAngle ?? 18;
  params.ishaAngle = masjid.calc.ishaAngle ?? 18;
  params.madhab = masjid.calc.madhab === "HANAFI" ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}
