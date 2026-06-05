"use client";

import React from "react";
import { ICH, Btn, GoldLabel, Card } from "./ui-primitives";

const RESOURCES = [
  {
    category: "Quran & Hadith",
    icon: "📖",
    links: [
      { label: "Quran.com — Quran with Translation",     url: "https://quran.com" },
      { label: "Sunnah.com — Hadith Collections",        url: "https://sunnah.com" },
      { label: "IslamQA.org — Islamic Q&A",             url: "https://islamqa.org" },
    ]
  },
  {
    category: "Islamic Media",
    icon: "🎙️",
    links: [
      { label: "SeekersGuidance — Free Islamic Courses", url: "https://seekersguidance.org" },
      { label: "Yaqeen Institute — Islamic Research",    url: "https://yaqeeninstitute.org" },
      { label: "MuslimMatters.org — Articles & Essays",  url: "https://muslimmatters.org" },
    ]
  },
  {
    category: "Prayer & Zakat Tools",
    icon: "🤲",
    links: [
      { label: "ISNA — Islamic Society of North America", url: "https://isna.net" },
      { label: "National Zakat Foundation",               url: "https://nzf.org.uk" },
      { label: "Islamic Relief — Zakat Calculator",       url: "https://www.islamicrelief.org/zakat/calculator/" },
    ]
  },
  {
    category: "Community & Organizations",
    icon: "🌐",
    links: [
      { label: "Islamic Society of North America (ISNA)", url: "https://isna.net" },
      { label: "Muslim American Society (MAS)",           url: "https://mas-icna.org" },
      { label: "CAIR — Council on American-Islamic Relations", url: "https://www.cair.com" },
    ]
  },
];

export default function ResourcesClient() {
  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px 80px" }}>
      <div style={{ marginBottom: 44 }}>
        <GoldLabel>Learning & Growth</GoldLabel>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, marginBottom: 10 }}>Islamic Resources</h1>
        <p style={{ fontSize: 16, color: ICH.textMuted }}>Curated resources for learning, practice, and community connection.</p>
      </div>

      <div style={{ background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "28px 32px", textAlign: "center", marginBottom: 44 }}>
        <div className="amiri" style={{ fontSize: "clamp(20px,2.8vw,28px)", color: ICH.primary, marginBottom: 10, direction: "rtl", lineHeight: 1.8, textAlign: "right" }}>
          اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
        </div>
        <p style={{ fontSize: 13, color: ICH.textMuted, fontStyle: "italic" }}>"Read in the name of your Lord who created." — Quran 96:1</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 36 }}>
        {RESOURCES.map((group) => (
          <Card key={group.category} hover>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{group.icon}</span>
              <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 600, color: ICH.primary }}>{group.category}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {group.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: ICH.textMuted, textDecoration: "none", transition: "color .15s", lineHeight: 1.55 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ICH.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = ICH.textMuted; }}
                >
                  <span style={{ flexShrink: 0, marginTop: 1, color: ICH.gold }}>↗</span>
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ padding: 24, background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 6 }}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, marginBottom: 6 }}>Suggest a Resource</h3>
        <p style={{ fontSize: 13, color: ICH.textMuted, marginBottom: 14, lineHeight: 1.65 }}>Have a useful Islamic resource to share with the community? We'd love to hear from you.</p>
        <Btn variant="outline" href="/contact" size="sm">Send a Suggestion →</Btn>
      </div>
    </div>
  );
}
