import type { Metadata } from "next";
import { MapPin, Heart, BookOpen, Users, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Islamic Center of Hattiesburg, our history, mission, and the Oak Grove masjid project.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About ICH</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Serving the Muslim community of Hattiesburg, Mississippi with faith,
          education, and community.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-14">
        <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
          <div className="font-arabic text-2xl mb-4 text-secondary">
            وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
          </div>
          <p className="text-primary-foreground/80 text-sm mb-4">
            &ldquo;And cooperate in righteousness and piety&rdquo; (Quran 5:2)
          </p>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-primary-foreground/85 leading-relaxed">
            The Islamic Center of Hattiesburg exists to serve Allah (SWT) by
            serving His creation. We strive to be a spiritual home for Muslims in
            South Mississippi, a center of Islamic learning, and a positive
            presence in the broader Hattiesburg community.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">Our History</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
          <p>
            The Islamic Center of Hattiesburg has been a pillar of the Muslim
            community in South Mississippi for many years. Founded by dedicated
            community members who recognized the need for an organized Muslim
            presence in Hattiesburg, ICH has grown from humble beginnings into a
            vibrant center of worship and community life.
          </p>
          <p>
            Over the years, ICH has served as a place of prayer, Islamic
            education, interfaith dialogue, and community service. We have
            welcomed Muslims from across the region and from diverse ethnic and
            cultural backgrounds, united in faith and commitment to their
            community.
          </p>
          <p>
            Today, ICH continues to grow and expand its programs and services.
            We are grateful to Allah (SWT) for His blessings and to the many
            community members, donors, and volunteers who have made ICH what it
            is today.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-8">What We Offer</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: <Heart className="h-6 w-6" />,
              title: "Daily Prayers",
              desc: "Five daily prayers including Fajr, Dhuhr, Asr, Maghrib, and Isha. Jumuah held every Friday.",
            },
            {
              icon: <BookOpen className="h-6 w-6" />,
              title: "Islamic Education",
              desc: "Quran classes for children and adults, Islamic studies, and periodic lectures.",
            },
            {
              icon: <Users className="h-6 w-6" />,
              title: "Youth Programs",
              desc: "Weekly Islamic education and activities for children and teens to build their faith and identity.",
            },
            {
              icon: <Building2 className="h-6 w-6" />,
              title: "Community Space",
              desc: "A welcoming space for community gatherings, events, and interfaith activities.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Oak Grove Project */}
      <section id="oak-grove" className="scroll-mt-20">
        <div className="rounded-2xl border border-secondary/40 bg-secondary/10 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold">Oak Grove Masjid Project</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            ICH is currently working on an exciting new project — building a
            dedicated masjid facility in the Oak Grove area. This project will
            give our growing community a permanent, purpose-built home for
            worship, education, and community programs.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Status", value: "In Progress" },
              { label: "Location", value: "Oak Grove, MS" },
              { label: "Goal", value: "New Masjid Facility" },
            ].map((item) => (
              <div key={item.label} className="bg-background rounded-lg p-4 text-center border border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                <div className="font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            This project is funded entirely through community donations. Every
            contribution, large or small, brings us closer to our goal of a
            permanent masjid for the Hattiesburg area Muslim community.
          </p>
          <a
            href="/donate?category=oak-grove-project"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Heart className="h-4 w-4" />
            Support the Oak Grove Project
          </a>
        </div>
      </section>

      {/* Location */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold mb-6">Location &amp; Hours</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3 text-primary font-medium">
              <MapPin className="h-4 w-4" />
              Address
            </div>
            <p className="text-muted-foreground text-sm">
              21 Windmill Drive<br />
              Hattiesburg, MS 39402
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="font-medium mb-3 text-primary text-sm">Open For Prayers</div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The masjid is open for all five daily prayers. Please check the
              prayer times page for current schedule. Special events and
              programs may have different hours.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-xl overflow-hidden border border-border h-64">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=-89.35,31.28,-89.28,31.35&layer=mapnik&marker=31.314,-89.315"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="ICH Location"
          />
        </div>
      </section>
    </div>
  );
}
