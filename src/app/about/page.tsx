import React from "react";
import { Metadata } from "next";
import { Btn, GoldLabel, SectionHead, Card } from "@/components/ui-primitives";
import { ICH } from "@/lib/theme";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission, leadership, programs, and New Masjid project at the Islamic Center of Hattiesburg.",
};

const BOARD_MEMBERS = [
  { name: 'Abdul Karim',                  role: 'President' },
  { name: 'Muhammad Asjad Rehman Hashmi', role: 'Vice President & Imam' },
  { name: 'Vacant',                       role: 'Secretary' },
  { name: 'Mohammed Kher Bni Salameh',    role: 'Treasurer' },
  { name: 'Musa Al Hadwan',               role: 'Maintenance' },
  { name: 'Sayed Ul Akbar Murad',         role: 'Tech Lead' },
];

const INITIATIVES = [
  { icon: '📚', title: 'Sunday School',          time: 'Sundays 10 AM – 1 PM',              note: '', desc: 'Islamic education for the youth.' },
  { icon: '🤝', title: 'Friday Halaqah',         time: 'Fridays, Maghreb to Isha',          note: '', desc: 'Weekly gathering and discussion for the community.' },
  { icon: '🕌', title: 'Jummah Prayers',         time: 'Fridays 1:00 PM',                   note: '', desc: 'Weekly Friday congregational prayer and khutbah. All are welcome.' },
];

export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* Page hero */}
      <div style={{ background: `linear-gradient(160deg,${ICH.primaryDark},${ICH.primary})`, padding: '64px 24px 56px', position: "relative", overflow: "hidden" }}>
        <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.55 }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <GoldLabel>Islamic Center of Hattiesburg</GoldLabel>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(34px,5vw,56px)", fontWeight: 600, color: "#fff", marginBottom: 14 }}>About ICH</h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,.75)", lineHeight: 1.8, maxWidth: 560 }}>
            Serving the Muslim community of Hattiesburg, Mississippi with faith, education, and community.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>
        {/* Mission */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ border: `1px solid ${ICH.gold}44`, borderRadius: 8, padding: "36px 40px", background: `${ICH.gold}07`, position: "relative", overflow: "hidden" }}>
            <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
            <div style={{ position: "relative" }}>
              <div className="amiri" style={{ fontSize: "clamp(20px,2.5vw,28px)", color: ICH.primary, marginBottom: 10, direction: "rtl", textAlign: "right", lineHeight: 1.8 }}>
                وَاللَّهُ يَدْعُو إِلَىٰ دَارِ السَّلَامِ
              </div>
              <p style={{ fontSize: 13, color: ICH.textMuted, fontStyle: "italic", textAlign: "right", marginBottom: 24 }}>
                "And Allah invites to the Home of Peace" — Surah Yunus, Verse 25
              </p>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, marginBottom: 12 }}>Our Mission</h2>
              <p style={{ fontSize: 15, color: ICH.textMuted, lineHeight: 1.8 }}>
                The Islamic Center of Hattiesburg stands as a beacon of faith and community. Our mission is to foster a vibrant and inclusive environment where Muslims of all backgrounds can come together to worship, learn, and serve. We strive to promote the principles of Islam, advance education, and provide essential services that enhance the quality of life for our community members.
              </p>
            </div>
          </div>
        </section>

        {/* Board */}
        <section style={{ marginBottom: 60 }}>
          <SectionHead label="Leadership" title="Board @ Islamic Center" />
          <div style={{ border: `1px solid ${ICH.border}`, borderRadius: 8, overflow: "hidden" }}>
            {BOARD_MEMBERS.map((member, i) => (
              <div
                key={member.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 24px",
                  background: i % 2 === 0 ? "#fff" : ICH.bgCard,
                  borderBottom: i < BOARD_MEMBERS.length - 1 ? `1px solid ${ICH.border}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${ICH.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: ICH.primary, fontFamily: "Cormorant Garamond,serif", flexShrink: 0 }}>
                    {member.name === "Vacant" ? "—" : member.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: member.name === "Vacant" ? ICH.textMuted : ICH.text, fontStyle: member.name === "Vacant" ? "italic" : "normal" }}>
                    {member.name}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: ICH.primary, fontFamily: "Inter,sans-serif", background: `${ICH.primary}10`, padding: "4px 12px", borderRadius: 20 }}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Initiatives */}
        <section style={{ marginBottom: 60 }}>
          <SectionHead label="Programs" title="Our Initiatives" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {INITIATIVES.map((item) => (
              <Card key={item.title} hover style={{ position: "relative" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 19, fontWeight: 600, marginBottom: 2 }}>{item.title}</h3>
                    <div style={{ fontSize: 11, color: ICH.primary, fontWeight: 600, fontFamily: "Inter,sans-serif" }}>{item.time}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.65, marginBottom: item.note ? 10 : 0 }}>{item.desc}</p>
                {item.note && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: ICH.gold, fontFamily: "Inter,sans-serif" }}>
                    <span>★</span> {item.note}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Oak Grove Project */}
        <section id="oak-grove" style={{ scrollMarginTop: 80, marginBottom: 60 }}>
          <div style={{ border: `2px solid ${ICH.gold}55`, borderRadius: 8, padding: "36px 40px", background: `linear-gradient(135deg,${ICH.bgCard},#fff)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>🏗️</span>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: ICH.gold, fontFamily: "Inter,sans-serif" }}>Active Project</div>
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 600, marginBottom: 16 }}>New Masjid Project</h2>
            <p style={{ fontSize: 15, color: ICH.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
              As a growing community our current facility continues to be a challenge. We are planning to address this concern by building a new masjid that will offer a large prayer hall, an Islamic school, and a community center, insha'Allah. Please spread the word and donate wholeheartedly.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                ["Status", "In Progress"],
                ["Location", "Hattiesburg, MS"],
                ["Goal", "New Masjid Facility"],
              ].map(([label, value]) => (
                <div key={label} style={{ textAlign: "center", background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 5, padding: "14px 10px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: ICH.textMuted, fontFamily: "Inter,sans-serif", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: ICH.text }}>{value}</div>
                </div>
              ))}
            </div>
            <Btn variant="gold" href="https://www.launchgood.com/v4/campaign/help_build_the_islamic_center_of_oak_grove">♥ Support the New Masjid</Btn>
          </div>
        </section>

        {/* Location */}
        <section>
          <SectionHead label="Visit Us" title="Location & Hours" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 16 }}>
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: ICH.primary, fontFamily: "Inter,sans-serif", marginBottom: 10 }}>📍 Address</div>
              <p style={{ fontSize: 14, color: ICH.textMuted, lineHeight: 1.7 }}>211 N 25th Avenue<br />Hattiesburg, MS 39401</p>
            </Card>
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: ICH.primary, fontFamily: "Inter,sans-serif", marginBottom: 10 }}>🕌 Open For Prayers</div>
              <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.7 }}>The masjid is open for all five daily prayers. Check the prayer times page for the current schedule. Special events may have different hours.</p>
            </Card>
          </div>
          <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${ICH.border}`, height: 280 }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-89.335,31.315,-89.315,31.335&layer=mapnik&marker=31.32686,-89.32768"
              width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="ICH Location"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
