"use client";

import React, { useState, useEffect } from "react";
import { ICH, Btn, GoldLabel, SectionHead } from "./ui-primitives";
import { PrayerTimes, JumuahSchedule } from "@/lib/prayer-times";
import { formatTime } from "@/lib/utils";

// ── Mosque Hero SVG ───────────────────────────────────────────────────────────
function MosqueHero() {
  const dark = '#061217';
  return (
    <svg viewBox="0 0 1400 420" preserveAspectRatio="xMidYMax meet"
      style={{ position:'absolute', bottom:0, left:0, width:'100%', height:'80%', pointerEvents:'none' }}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#03090a"/>
          <stop offset="55%"  stopColor="#091f26"/>
          <stop offset="100%" stopColor="#103f4f" stopOpacity=".9"/>
        </linearGradient>
        <radialGradient id="glowG" cx="50%" cy="100%" r="55%">
          <stop offset="0%"   stopColor="#247c6c" stopOpacity=".18"/>
          <stop offset="100%" stopColor="#247c6c" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1400" height="420" fill="url(#skyG)"/>
      <rect width="1400" height="420" fill="url(#glowG)"/>

      {/* Stars */}
      {[
        [60,44],[152,28],[290,62],[430,22],[570,46],[700,18],[830,38],[960,26],[1090,52],[1230,34],[1340,50],
        [110,105],[360,88],[520,72],[760,82],[920,60],[1180,78],[1310,92],[200,140],[480,118],[660,130],[1040,110]
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%4===0?1.8:i%3===0?1.4:1} fill="#fff" opacity={.3+.4*(i%3)/2}/>
      ))}

      {/* Crescent moon */}
      <circle cx="1090" cy="66" r="27" fill="#3ba491" opacity=".92"/>
      <circle cx="1104" cy="58" r="23" fill="#020709"/>

      {/* Horizon glow */}
      <ellipse cx="700" cy="420" rx="680" ry="90" fill="#247c6c" opacity=".07"/>

      {/* Left minaret */}
      <rect x="198" y="52" width="26" height="368" fill={dark}/>
      <path d="M 184,52 Q 211,14 238,52 Z" fill={dark}/>
      <line x1="211" y1="14" x2="211" y2="-2" stroke={dark} strokeWidth="4"/>
      <circle cx="211" cy="-4" r="5" fill={dark}/>

      {/* Right minaret */}
      <rect x="1176" y="52" width="26" height="368" fill={dark}/>
      <path d="M 1162,52 Q 1189,14 1216,52 Z" fill={dark}/>
      <line x1="1189" y1="14" x2="1189" y2="-2" stroke={dark} strokeWidth="4"/>
      <circle cx="1189" cy="-4" r="5" fill={dark}/>

      {/* Left wing wall */}
      <rect x="110" y="292" width="408" height="128" fill={dark}/>
      {/* Left wing dome */}
      <path d="M 110,292 Q 314,192 518,292 Z" fill={dark}/>
      <line x1="314" y1="192" x2="314" y2="172" stroke={dark} strokeWidth="3"/>
      <circle cx="314" cy="169" r="4" fill={dark}/>

      {/* Right wing wall */}
      <rect x="882" y="292" width="408" height="128" fill={dark}/>
      {/* Right wing dome */}
      <path d="M 882,292 Q 1086,192 1290,292 Z" fill={dark}/>
      <line x1="1086" y1="192" x2="1086" y2="172" stroke={dark} strokeWidth="3"/>
      <circle cx="1086" cy="169" r="4" fill={dark}/>

      {/* Central drum */}
      <rect x="492" y="218" width="416" height="90" fill={dark}/>

      {/* Central main dome (onion) */}
      <path d="M 492,218 C 492,96 560,16 700,10 C 840,16 908,96 908,218 Z" fill={dark}/>
      <line x1="700" y1="10" x2="700" y2="-8" stroke={dark} strokeWidth="4"/>
      <circle cx="700" cy="-12" r="6" fill={dark}/>

      {/* Decorative windows in drum */}
      {[542,606,700,794,858].map((x,i) => (
        <g key={i}>
          <rect x={x-13} y={228} width={26} height={52} fill="#09222a" opacity=".9"/>
          <ellipse cx={x} cy={228} rx={13} ry={10} fill="#09222a" opacity=".9"/>
        </g>
      ))}

      {/* Arched openings in left wing */}
      {[184,284,384,460].map((x,i) => (
        <g key={i}>
          <rect x={x-16} y={326} width={32} height={94} fill="#09222a" opacity=".8"/>
          <ellipse cx={x} cy={326} rx={16} ry={13} fill="#09222a" opacity=".8"/>
        </g>
      ))}

      {/* Arched openings in right wing */}
      {[940,1016,1116,1216].map((x,i) => (
        <g key={i}>
          <rect x={x-16} y={326} width={32} height={94} fill="#09222a" opacity=".8"/>
          <ellipse cx={x} cy={326} rx={16} ry={13} fill="#09222a" opacity=".8"/>
        </g>
      ))}

      {/* Central arch entrance */}
      <rect x="648" y="298" width="104" height="122" fill="#09222a" opacity=".9"/>
      <ellipse cx="700" cy="298" rx="52" ry="40" fill="#09222a" opacity=".9"/>
    </svg>
  );
}

// ── Prayer countdown hook ─────────────────────────────────────────────────────
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

interface HomeClientProps {
  prayerTimes: PrayerTimes;
  jumuah: JumuahSchedule;
}

export default function HomeClient({ prayerTimes, jumuah }: HomeClientProps) {
  // Parse fetched times dynamically
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
    { name: "Maghrib", key: "maghrib", h: m.h, m: m.m, display: "After Adhan" },
    { name: "Isha",    key: "isha",    h: i.h, m: i.m, display: formatTime(prayerTimes.isha) },
  ], [prayerTimes]);

  const prayers5 = React.useMemo(() => prayersAll.filter((p) => p.key !== "sunrise"), [prayersAll]);
  const { countdown, nextName, nextIdx, curIdx } = usePrayerCountdown(prayersAll);

  // Formatted Jumuah schedule
  const jumuahItems = [
    { label: "Khutbah", time: formatTime(jumuah.khutbah) || "1:00 PM" },
    { label: "Salah", time: formatTime(jumuah.salah) || "1:30 PM" },
    { label: "Speaker", time: jumuah.speaker || "Imam (TBA)" },
    { label: "Location", time: "211 N 25th Ave" },
  ];

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "78vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#060b0d 0%,#0c1b22 55%,#103f4fcc 100%)" }} />
        {/* Islamic star pattern overlay */}
        <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
        {/* Mosque silhouette */}
        <MosqueHero />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "80px 24px 100px", width: "100%" }}>
          <div style={{ maxWidth: 580 }}>
            <div className="amiri" style={{ fontSize: "clamp(18px,2.5vw,26px)", color: ICH.gold, marginBottom: 18, direction: "rtl", textAlign: "left" }}>
              السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, fontSize: "clamp(40px,6vw,72px)", color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              Islamic Center<br />
              <span style={{ color: ICH.gold }}>of Hattiesburg</span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,.78)", lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
              Serving the Muslim community of Hattiesburg, Mississippi with daily prayers, Islamic education, and community programs since our founding. All are welcome.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Btn variant="gold" href="/prayer-times" style={{ fontSize: 14 }}>🕌 Prayer Times</Btn>
              <Btn variant="primary" href="/donate">♥ Donate Now</Btn>
              <Btn variant="ghost-dark" href="/events">📅 Events</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prayer Times Strip ── */}
      <section style={{ background: ICH.primaryDark, borderTop: `2px solid ${ICH.gold}33`, borderBottom: `1px solid ${ICH.gold}22` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>
          {/* Countdown bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: ICH.gold, fontFamily: "Inter,sans-serif" }}>
              Today's Prayer Times
            </div>
            {nextName && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: ICH.gold, animation: "pulse 1.4s ease-in-out infinite" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)", fontFamily: "Inter,sans-serif" }}>
                  Next: <strong style={{ color: "rgba(255,255,255,.9)" }}>{nextName}</strong> in
                </span>
                <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, color: ICH.gold, fontWeight: 600, letterSpacing: ".04em" }}>
                  {countdown}
                </span>
              </div>
            )}
            <Btn variant="outline" href="/prayer-times" style={{ border: `1px solid ${ICH.gold}44`, color: ICH.gold, padding: "4px 12px", borderRadius: 3, fontSize: 12, height: "auto" }}>
              Full Schedule →
            </Btn>
          </div>

          {/* Prayer cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {prayers5.map((p, i) => {
              const prayers5Idxs = [0, 2, 3, 4, 5];
              const realIdx = prayers5Idxs[i];
              const isCur = realIdx === curIdx;
              const isNext = realIdx === nextIdx;
              return (
                <div key={p.key} style={{
                  textAlign: "center", padding: "12px 8px", borderRadius: 4,
                  background: isCur ? ICH.gold : isNext ? "rgba(36,124,108,.12)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${isCur ? ICH.gold : isNext ? ICH.gold + "44" : "rgba(255,255,255,.08)"}`,
                  position: "relative", transition: "all .2s",
                }}>
                  {isCur && <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: ICH.primaryDark, color: ICH.gold, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, border: `1px solid ${ICH.gold}`, fontFamily: "Inter,sans-serif", letterSpacing: ".06em" }}>NOW</div>}
                  {isNext && !isCur && <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: ICH.primaryDark, color: "rgba(255,255,255,.7)", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", fontFamily: "Inter,sans-serif" }}>NEXT</div>}
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: isCur ? ICH.primaryDark : "rgba(255,255,255,.5)", marginBottom: 5, fontFamily: "Inter,sans-serif" }}>{p.name}</div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: p.display === "After Adhan" ? 13 : 20, fontWeight: 600, color: isCur ? ICH.primaryDark : "#fff" }}>{p.display}</div>
                </div>
              );
            })}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </section>

      {/* ── Jumuah + About ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "start" }}>

          {/* Jumuah Card */}
          <div style={{ background: `linear-gradient(145deg,${ICH.primaryDark},${ICH.primary})`, borderRadius: 8, padding: "36px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
            {/* Background pattern */}
            <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: ICH.gold, marginBottom: 6, fontFamily: "Inter,sans-serif" }}>Every Friday</div>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 34, fontWeight: 600, color: "#fff", marginBottom: 24 }}>Jumuah Prayer</h2>
              <div style={{ borderTop: `1px solid rgba(255,255,255,.12)`, marginBottom: 16 }} />
              {jumuahItems.map(({ label, time }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.65)" }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{time}</span>
                </div>
              ))}
              <div style={{ marginTop: 24 }}>
                <Btn variant="ghost-dark" href="/prayer-times" size="sm">Full Schedule →</Btn>
              </div>
            </div>
          </div>

          {/* About snippet */}
          <div>
            <SectionHead label="About Us" title="A Home for the Muslim Community"
              sub="The Islamic Center of Hattiesburg (ICH) has been a cornerstone of the Muslim community in South Mississippi for decades — a welcoming space for worship, learning, and community service." />
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 }}>
              {[
                { icon: "🤝", title: "Community Programs",    desc: "Regular halaqas, youth programs, and interfaith outreach" },
                { icon: "📖", title: "Islamic Education",     desc: "Quran classes, Islamic studies, and weekend school" },
                { icon: "🏗️", title: "Oak Grove Project",     desc: "Building a new masjid facility to serve our growing community" },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 6, background: `${ICH.primary}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: ICH.text, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn variant="primary" href="/about">Learn More</Btn>
              <Btn variant="outline" href="https://www.launchgood.com/v4/campaign/help_build_the_islamic_center_of_oak_grove">Oak Grove Project</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Donate CTA ── */}
      <section style={{ background: ICH.bgCard, borderTop: `1px solid ${ICH.border}`, borderBottom: `1px solid ${ICH.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <GoldLabel>Support ICH</GoldLabel>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 600, marginBottom: 14 }}>Help Build Our Community</h2>
          <p style={{ fontSize: 16, color: ICH.textMuted, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.75 }}>
            Your donations support daily operations, the Oak Grove masjid project, Islamic education, and community outreach programs.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 28 }}>
            {["General Sadaqah", "Zakat", "Oak Grove Project", "Quran Programs"].map((cat) => (
              <Btn key={cat} href={`/donate?category=${cat.toLowerCase().replace(/ /g, "-")}`} variant="muted" style={{ padding: "8px 18px", fontSize: 13 }}>
                {cat}
              </Btn>
            ))}
          </div>
          <Btn variant="gold" href="/donate" size="lg">♥ Donate Now</Btn>
        </div>
      </section>

      {/* ── Full Prayer Times Widget ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
        <SectionHead label="Prayer Times" title="Daily Prayer Schedule" sub="Hattiesburg, Mississippi — times updated regularly" center />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
          {prayersAll.map((p, i) => {
            const isCur = i === curIdx;
            const isNext = i === nextIdx;
            return (
              <div key={p.key} style={{
                textAlign: "center", padding: "24px 12px", borderRadius: 6,
                background: isCur ? ICH.primary : isNext ? `${ICH.primary}0e` : "#fff",
                border: `1px solid ${isCur ? ICH.primary : isNext ? ICH.primary + "44" : ICH.border}`,
                position: "relative", boxShadow: isCur ? "0 6px 24px rgba(20,92,112,.25)" : "none",
                transform: isCur ? "scale(1.04)" : "scale(1)",
                transition: "all .2s",
              }}>
                {isCur && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: ICH.gold, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, fontFamily: "Inter,sans-serif", letterSpacing: ".06em" }}>NOW</div>}
                {isNext && !isCur && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: ICH.bgCard2, color: ICH.primary, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, border: `1px solid ${ICH.primary}33`, fontFamily: "Inter,sans-serif" }}>NEXT</div>}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: isCur ? "rgba(255,255,255,.7)" : ICH.textMuted, marginBottom: 8, fontFamily: "Inter,sans-serif" }}>{p.name}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: p.display === "After Adhan" ? 15 : 24, fontWeight: 600, color: isCur ? "#fff" : ICH.text }}>{p.display}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Btn variant="outline" href="/prayer-times">View Full Schedule</Btn>
        </div>
      </section>
    </div>
  );
}
