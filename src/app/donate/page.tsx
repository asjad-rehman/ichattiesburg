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



      {/* Zeffy Embed */}
      <div style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "20px", position: "relative" }}>
        <iframe
          key={type} // Force re-render on type change
          src={`https://www.zeffy.com/embed/donation-form/${
            type === "monthly" 
              ? "e4338258-eef5-489e-ae60-75017200e9bc" 
              : "ba0c6cb0-70a2-41db-95c6-9ff75a30b42c"
          }`}
          style={{ width: "100%", minHeight: "900px", border: "none", borderRadius: "4px" }}
          allow="payment"
          allowTransparency={true}
        />
        <p style={{ fontSize: 11, color: ICH.textMuted, marginTop: 14, fontFamily: "Inter,sans-serif", textAlign: "center" }}>
          Powered by Zeffy — a free, no-fee fundraising platform. 100% of your donation goes to ICH.
        </p>
      </div>
    </div>
  );
}
