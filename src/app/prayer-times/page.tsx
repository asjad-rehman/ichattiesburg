import { fetchPrayerTimes } from "@/lib/prayer-times";
import { formatTime } from "@/lib/utils";
import PrayerTimesWidget from "@/components/prayer-times-widget";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer Times",
  description: "Daily prayer times and Jumuah schedule for the Islamic Center of Hattiesburg.",
};

export const revalidate = 3600;

export default async function PrayerTimesPage() {
  const { prayerTimes, jumuah, lastUpdated } = await fetchPrayerTimes();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Prayer Times</h1>
        <p className="text-muted-foreground">
          Hattiesburg, Mississippi · Updated{" "}
          {new Date(lastUpdated).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <PrayerTimesWidget prayerTimes={prayerTimes} />

      {/* Jumuah */}
      <div className="mt-12 rounded-2xl bg-primary p-8 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-6">Jumuah (Friday Prayer)</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: "Khutbah Begins", value: formatTime(jumuah.khutbah) },
              { label: "Salah", value: formatTime(jumuah.salah) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between border-b border-primary-foreground/20 pb-3">
                <span className="text-primary-foreground/75">{item.label}</span>
                <span className="font-bold text-lg">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-5">
            {jumuah.speaker && (
              <div className="mb-3">
                <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-1">Speaker</div>
                <div className="font-semibold">{jumuah.speaker}</div>
              </div>
            )}
            {jumuah.topic && jumuah.topic !== "TBA" && (
              <div>
                <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-1">Topic</div>
                <div className="font-semibold">{jumuah.topic}</div>
              </div>
            )}
            {(!jumuah.topic || jumuah.topic === "TBA") && (
              <div className="text-primary-foreground/60 text-sm">
                Topic to be announced. Join us every Friday.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8 p-5 bg-card rounded-xl border border-border text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Important Notes</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Prayer times may vary slightly due to seasonal changes.</li>
          <li>Iqamah times may differ from Adhan — please arrive a few minutes early.</li>
          <li>Jumuah prayers are held weekly at the masjid.</li>
          <li>
            Contact us at{" "}
            <a href="mailto:info@ichattiesburg.org" className="text-primary hover:underline">
              info@ichattiesburg.org
            </a>{" "}
            for any scheduling questions.
          </li>
        </ul>
      </div>
    </div>
  );
}
