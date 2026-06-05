"use client";

import React, { useState, useEffect } from "react";
import { ICH, Btn, GoldLabel } from "./ui-primitives";
import { PrayerTimes, JumuahSchedule } from "@/lib/prayer-times";
import { formatTime } from "@/lib/utils";

interface PrayerData {
  name: string;
  key: string;
  h: number;
  m: number;
  display: string;
}

function usePrayerCountdown(prayers: PrayerData[]) {
  const [state, setState] = useState({
    countdown: "--:--:--",
    nextName: "",
    nextIdx: -1,
    curIdx: -1,
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nowMs = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000;

      let curIdx = -1;
      for (let i = 0; i < prayers.length; i++) {
        if ((prayers[i].h * 3600 + prayers[i].m * 60) * 1000 <= nowMs) {
          curIdx = i;
        }
      }

      const nextIdx = curIdx === prayers.length - 1 ? 0 : curIdx + 1;
      const next = prayers[nextIdx];

      let target = new Date();
      target.setHours(next.h, next.m, 0, 0);
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const hh = Math.floor(diff / 3600000);
      const mm = Math.floor((diff % 3600000) / 60000);
      const ss = Math.floor((diff % 60000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");

      setState({
        countdown: `${pad(hh)}:${pad(mm)}:${pad(ss)}`,
        nextName: next.name,
        nextIdx,
        curIdx,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayers]);

  return state;
}

interface PrayerTimesClientProps {
  prayerTimes: PrayerTimes;
  jumuah: JumuahSchedule;
}

export default function PrayerTimesClient({ prayerTimes, jumuah }: PrayerTimesClientProps) {
  const parse = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return { h: h || 0, m: m || 0 };
  };

  const f = parse(prayerTimes.fajr);
  const s = parse(prayerTimes.sunrise);
  const d = parse(prayerTimes.dhuhr);
  const a = parse(prayerTimes.asr);
  const m = parse(prayerTimes.maghrib);
  const i = parse(prayerTimes.isha);

  const prayersAll: PrayerData[] = React.useMemo(() => [
    { name: "Fajr",    key: "fajr",    h: f.h, m: f.m, display: formatTime(prayerTimes.fajr) },
    { name: "Sunrise", key: "sunrise", h: s.h, m: s.m, display: formatTime(prayerTimes.sunrise) },
    { name: "Dhuhr",   key: "dhuhr",   h: d.h, m: d.m, display: formatTime(prayerTimes.dhuhr) },
    { name: "Asr",     key: "asr",     h: a.h, m: a.m, display: formatTime(prayerTimes.asr) },
    { name: "Maghrib", key: "maghrib", h: m.h, m: m.m, display: formatTime(prayerTimes.maghrib) },
    { name: "Isha",    key: "isha",    h: i.h, m: i.m, display: formatTime(prayerTimes.isha) },
  ], [prayerTimes]);

  const { countdown, nextName, nextIdx, curIdx } = usePrayerCountdown(prayersAll);

  // Formatted Jumuah shifting schedules
  const jumuahItems = [
    { label: "Jumuah 1", time: formatTime(jumuah.khutbah) || "12:15 PM" },
    { label: "Jumuah 2", time: formatTime(jumuah.salah) || "1:15 PM" },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 80px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 48 }}>
        <GoldLabel>Hattiesburg, Mississippi</GoldLabel>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, marginBottom: 10 }}>Prayer Times</h1>
        <p style={{ fontSize: 16, color: ICH.textMuted, lineHeight: 1.7 }}>Daily prayer schedule for the Islamic Center of Hattiesburg. Times are updated regularly.</p>
      </div>

      {/* ── Live Countdown ── */}
      <div style={{
        background: `linear-gradient(135deg,${ICH.primaryDark},${ICH.primary})`,
        borderRadius: 8, padding: "36px 40px", marginBottom: 36,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
        position: "relative", overflow: "hidden",
      }}>
        <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: ICH.gold, fontFamily: "Inter,sans-serif", marginBottom: 8 }}>Next Prayer</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 600, color: "#fff" }}>{nextName}</div>
        </div>
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", fontFamily: "Inter,sans-serif", marginBottom: 6 }}>Time Remaining</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,6vw,68px)", fontWeight: 600, color: ICH.gold, letterSpacing: ".05em", lineHeight: 1 }}>{countdown}</div>
        </div>
        <div style={{ position: "relative", textAlign: "right" }}>
          <div className="amiri" style={{ fontSize: 22, color: ICH.gold, marginBottom: 6 }}>
            حَافِظُوا عَلَى الصَّلَوَاتِ
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", fontFamily: "Inter,sans-serif", fontStyle: "italic" }}>
            "Guard strictly the prayers" — Quran 2:238
          </div>
        </div>
      </div>

      {/* ── Prayer cards grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 40 }}>
        {prayersAll.map((p, i) => {
          const isCur = i === curIdx;
          const isNext = i === nextIdx;
          return (
            <div key={p.key} style={{
              textAlign: "center", padding: "28px 16px", borderRadius: 6,
              background: isCur ? ICH.primary : isNext ? `${ICH.primary}0e` : "#fff",
              border: `1px solid ${isCur ? ICH.primary : isNext ? ICH.primary + "44" : ICH.border}`,
              boxShadow: isCur ? "0 6px 24px rgba(27,94,32,.22)" : "var(--shadow-sm)",
              transform: isCur ? "translateY(-3px) scale(1.03)" : "none",
              transition: "all .25s", position: "relative",
            }}>
              {isCur && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: ICH.gold, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 10, fontFamily: "Inter,sans-serif", letterSpacing: ".06em", whiteSpace: "nowrap" }}>CURRENT</div>}
              {isNext && !isCur && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: ICH.bgCard2, color: ICH.primary, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, border: `1px solid ${ICH.primary}33`, fontFamily: "Inter,sans-serif", whiteSpace: "nowrap" }}>UP NEXT</div>}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: isCur ? "rgba(255,255,255,.65)" : ICH.textMuted, marginBottom: 10, fontFamily: "Inter,sans-serif" }}>{p.name}</div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 600, color: isCur ? "#fff" : ICH.text, marginBottom: 4 }}>
                {p.display}
              </div>
              {isCur && (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontFamily: "Inter,sans-serif", marginTop: 6 }}>In progress</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Jumuah section ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 48 }}>
        <div style={{ border: `1px solid ${ICH.gold}44`, borderRadius: 8, padding: 28, background: `${ICH.gold}08` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: ICH.gold, fontFamily: "Inter,sans-serif", marginBottom: 8 }}>Every Friday</div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, marginBottom: 20 }}>Jumuah Prayer</h2>
          {jumuahItems.map((j) => (
            <div key={j.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${ICH.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: ICH.primary }}>{j.label}</span>
              <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 600 }}>{j.time}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${ICH.border}` }}>
            <span style={{ fontSize: 13, color: ICH.textMuted }}>Speaker</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{jumuah.speaker || "Imam (TBA)"}</span>
          </div>
          {jumuah.topic && jumuah.topic !== "TBA" && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${ICH.border}` }}>
              <span style={{ fontSize: 13, color: ICH.textMuted }}>Topic</span>
              <span style={{ fontSize: 14, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{jumuah.topic}</span>
            </div>
          )}
          <p style={{ fontSize: 13, color: ICH.textMuted, marginTop: 16, lineHeight: 1.7 }}>All are welcome. Located at 211 N 25th Avenue, Hattiesburg, MS 39401.</p>
        </div>

        <div style={{ border: `1px solid ${ICH.border}`, borderRadius: 8, padding: 28, background: "#fff" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Notes on Prayer Times</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Prayer times are calculated for Hattiesburg, MS using the ISNA method.",
              "Iqama times may differ from the adhan times shown above.",
              "Please arrive a few minutes early to pray sunnah.",
              "Check the announcements banner for any changes to the schedule.",
            ].map((note, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: ICH.gold, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>—</span>
                <span style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.65 }}>{note}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <Btn variant="outline" href="/contact" size="sm">Contact the Masjid</Btn>
          </div>
        </div>
      </div>

      {/* Quran verse */}
      <div style={{ background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", textAlign: "center" }}>
        <div className="amiri" style={{ fontSize: "clamp(22px,3vw,30px)", color: ICH.primary, marginBottom: 12, lineHeight: 1.8, direction: "rtl", textAlign: "right" }}>
          إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوقُوتًا
        </div>
        <p style={{ fontSize: 14, color: ICH.textMuted, fontStyle: "italic" }}>
          "Indeed, prayer has been decreed upon the believers a decree of specified times." — Quran 4:103
        </p>
      </div>
    </div>
  );
}
