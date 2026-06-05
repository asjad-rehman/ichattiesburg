"use client";

import React, { useState } from "react";
import { ICH, GoldLabel, Btn } from "@/components/ui-primitives";

const ZEFFY_ONE_TIME = "https://www.zeffy.com/donation-form/ba0c6cb0-70a2-41db-95c6-9ff75a30b42c";
const ZEFFY_MONTHLY  = "https://www.zeffy.com/donation-form/e4338258-eef5-489e-ae60-75017200e9bc";

export default function DonatePage() {
  const [type, setType] = useState<"one-time" | "monthly">("one-time");

  return (
    <div className="page-enter" style={{ maxWidth: 760, margin: "0 auto", padding: "52px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <GoldLabel>Support ICH</GoldLabel>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, marginBottom: 12 }}>Donate</h1>
        <div className="amiri" style={{ fontSize: 22, color: ICH.primary, marginBottom: 8, direction: "rtl", lineHeight: 1.9, textAlign: "right" }}>
          مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
        </div>
        <p style={{ fontSize: 13, color: ICH.textMuted, fontStyle: "italic", marginBottom: 16 }}>"Who is it that would loan Allah a goodly loan?" — Quran 2:245</p>
        <p style={{ fontSize: 15, color: ICH.textMuted, lineHeight: 1.75 }}>Your generosity supports our daily operations, new masjid project, Islamic education, and community programs. 100% of donations go directly to ICH.</p>
      </div>

      {/* One-time / Monthly toggle */}
      <div style={{ display: "flex", marginBottom: 32, border: `1px solid ${ICH.border}`, borderRadius: 6, overflow: "hidden", maxWidth: 360 }}>
        {([["one-time", "One-Time"], ["monthly", "Monthly"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setType(val)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "none",
              cursor: "pointer",
              background: type === val ? ICH.primary : "#fff",
              color: type === val ? "#fff" : ICH.textMuted,
              fontFamily: "Inter,sans-serif",
              fontSize: 13,
              fontWeight: 600,
              transition: "all .15s",
              borderRight: val === "one-time" ? `1px solid ${ICH.border}` : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 36 }}>
        {[
          { title: "General Sadaqah", desc: "Day-to-day masjid operations",  icon: "🕌" },
          { title: "Zakat",           desc: "Fulfill your obligatory zakat", icon: "🤲" },
          { title: "New Masjid",      desc: "Build our permanent facility",  icon: "🏗️" },
          { title: "Quran Programs",  desc: "Islamic education for all ages",icon: "📖" },
        ].map((cat) => (
          <div
            key={cat.title}
            style={{ padding: "18px 14px", background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 6, cursor: "pointer", transition: "all .18s", textAlign: "center" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = ICH.gold;
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,169,110,.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = ICH.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, fontWeight: 600, marginBottom: 3 }}>{cat.title}</div>
            <div style={{ fontSize: 11, color: ICH.textMuted, lineHeight: 1.55 }}>{cat.desc}</div>
          </div>
        ))}
      </div>

      {/* Zeffy CTA */}
      <div style={{ background: `linear-gradient(135deg,${ICH.primaryDark},${ICH.primary})`, borderRadius: 8, padding: "36px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: ICH.gold, fontFamily: "Inter,sans-serif", marginBottom: 12 }}>
            {type === "monthly" ? "🔄 Monthly Giving" : "♥ One-Time Gift"}
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, color: "#fff", marginBottom: 14 }}>
            {type === "monthly" ? "Set Up a Monthly Donation" : "Make a One-Time Donation"}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)", lineHeight: 1.75, maxWidth: 460, margin: "0 auto 20px" }}>
            {type === "monthly"
              ? "Monthly giving provides steady support for the masjid and its programs. Cancel anytime."
              : "Secure donation processed via Zeffy — 0% platform fees, so more goes directly to ICH."}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginBottom: 24 }}>
            By check: payable to "Islamic Center of Hattiesburg" — 211 N 25th Ave, Hattiesburg, MS 39401
          </p>
          <Btn
            href={type === "monthly" ? ZEFFY_MONTHLY : ZEFFY_ONE_TIME}
            variant="gold"
            size="lg"
            style={{ fontWeight: 700 }}
          >
            ♥ {type === "monthly" ? "Set Up Monthly Giving" : "Donate Now via Zeffy"}
          </Btn>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 14, fontFamily: "Inter,sans-serif" }}>
            Powered by Zeffy — a free, no-fee fundraising platform
          </p>
        </div>
      </div>
    </div>
  );
}
