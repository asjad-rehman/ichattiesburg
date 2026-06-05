import Link from "next/link";
import { Calendar, Clock, Heart, ChevronRight, MapPin, BookOpen, Users } from "lucide-react";
import { fetchPrayerTimes } from "@/lib/prayer-times";
import { formatTime } from "@/lib/utils";
import PrayerTimesWidget from "@/components/prayer-times-widget";
import AnnouncementsBanner from "@/components/announcements-banner";

export const revalidate = 3600;

export default async function HomePage() {
  const { prayerTimes, jumuah } = await fetchPrayerTimes();

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative geometric-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <p className="font-arabic text-2xl sm:text-3xl text-secondary mb-4">
              السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Islamic Center<br />
              <span className="text-secondary">of Hattiesburg</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl">
              Serving the Muslim community of Hattiesburg, Mississippi with
              daily prayers, Islamic education, and community programs since
              our founding. All are welcome.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/prayer-times"
                className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                <Clock className="h-5 w-5" />
                Prayer Times
              </Link>
              <Link
                href="/donate"
                className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
              <Link
                href="/events"
                className="flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/25 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <AnnouncementsBanner />

      {/* Prayer Times Strip */}
      <section className="bg-card border-y border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Today&apos;s Prayer Times
            </h2>
            <Link
              href="/prayer-times"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Full Schedule <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {prayers.map((p) => (
              <div
                key={p.name}
                className="text-center p-3 rounded-lg bg-background border border-border"
              >
                <div className="text-xs text-muted-foreground mb-1">{p.name}</div>
                <div className="font-semibold text-sm">{formatTime(p.time)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jumuah + About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Jumuah Card */}
          <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
              </svg>
            </div>
            <div className="relative">
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">
                Every Friday
              </div>
              <h2 className="text-3xl font-bold mb-6">Jumuah Prayer</h2>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-primary-foreground/20">
                  <span className="text-primary-foreground/80">Khutbah Begins</span>
                  <span className="font-semibold">{formatTime(jumuah.khutbah)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-primary-foreground/20">
                  <span className="text-primary-foreground/80">Salah</span>
                  <span className="font-semibold">{formatTime(jumuah.salah)}</span>
                </div>
                {jumuah.speaker && (
                  <div className="flex justify-between items-center py-2 border-b border-primary-foreground/20">
                    <span className="text-primary-foreground/80">Speaker</span>
                    <span className="font-semibold">{jumuah.speaker}</span>
                  </div>
                )}
                {jumuah.topic && jumuah.topic !== "TBA" && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-primary-foreground/80">Topic</span>
                    <span className="font-semibold text-right max-w-[60%]">{jumuah.topic}</span>
                  </div>
                )}
              </div>
              <Link
                href="/prayer-times"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors"
              >
                View Full Schedule <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* About snippet */}
          <div>
            <div className="text-primary text-sm font-medium uppercase tracking-wider mb-2">
              About Us
            </div>
            <h2 className="text-3xl font-bold mb-4">
              A Home for the Muslim Community
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Islamic Center of Hattiesburg (ICH) has been a cornerstone of
              the Muslim community in South Mississippi for decades. We provide a
              welcoming space for worship, learning, and community service for
              Muslims and our neighbors alike.
            </p>
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: <Users className="h-5 w-5" />,
                  title: "Community Programs",
                  desc: "Regular halaqas, youth programs, and interfaith outreach",
                },
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  title: "Islamic Education",
                  desc: "Quran classes, Islamic studies, and weekend school",
                },
                {
                  icon: <MapPin className="h-5 w-5" />,
                  title: "Oak Grove Project",
                  desc: "Building a new masjid facility to serve our growing community",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link
                href="/about"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Learn More
              </Link>
              <Link
                href="/about#oak-grove"
                className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Oak Grove Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="bg-secondary/15 border-y border-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-secondary text-sm font-medium uppercase tracking-wider mb-3">
            Support ICH
          </div>
          <h2 className="text-3xl font-bold mb-4">Help Build Our Community</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Your donations support daily operations, the Oak Grove masjid project,
            Islamic education, and community outreach programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["General Sadaqah", "Zakat", "Oak Grove Project", "Quran Programs"].map(
              (cat) => (
                <Link
                  key={cat}
                  href={`/donate?category=${cat.toLowerCase().replace(/ /g, "-")}`}
                  className="px-5 py-2.5 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              )
            )}
          </div>
          <div className="mt-6">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Heart className="h-5 w-5" />
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* Live Prayer Times Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Prayer Times</h2>
          <p className="text-muted-foreground">
            Daily prayer times for Hattiesburg, Mississippi
          </p>
        </div>
        <PrayerTimesWidget prayerTimes={prayerTimes} />
      </section>
    </>
  );
}
