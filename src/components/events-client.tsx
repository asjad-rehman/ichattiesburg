"use client";

import React, { useState } from "react";
import { ICH, Btn, GoldLabel, Tag, ScrollReveal } from "./ui-primitives";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string or formatted string
  time?: string;
  endTime?: string;
  location?: string;
  category: "jumuah" | "eid" | "halaqa" | "fundraiser" | "construction" | "community" | "other" | string;
  featured: boolean;
  recurring?: boolean;
}

const CAT_COLORS: Record<string, "green" | "yellow" | "blue" | "purple" | "orange" | "teal" | "gray"> = {
  jumuah: "green",
  eid: "yellow",
  halaqa: "blue",
  fundraiser: "purple",
  construction: "orange",
  community: "teal",
  other: "gray"
};

function fmtDate(dStr: string) {
  const d = new Date(dStr);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatEventTime(time?: string): string {
  if (!time) return "";
  // Check if it's already in 12h format
  if (time.includes("AM") || time.includes("PM")) return time;
  
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
}

function EventCard({ event, featured }: { event: EventItem; featured?: boolean }) {
  const [hov, setHov] = useState(false);
  const formattedTime = event.time ? formatEventTime(event.time) : "";
  const formattedEndTime = event.endTime ? formatEventTime(event.endTime) : "";
  const timeDisplay = formattedTime + (formattedEndTime ? ` – ${formattedEndTime}` : "");

  return (
    <div
      style={{
        background: featured ? `${ICH.primary}08` : "#fff",
        border: `1px solid ${hov ? ICH.primary + "55" : featured ? ICH.primary + "33" : ICH.border}`,
        borderRadius: 6,
        padding: "20px 22px",
        boxShadow: hov ? "0 4px 16px rgba(27,94,32,.09)" : "none",
        transition: "all .2s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 21, fontWeight: 600, lineHeight: 1.2, color: ICH.text }}>{event.title}</h3>
        <Tag color={CAT_COLORS[event.category] || "gray"}>{event.category}</Tag>
      </div>
      <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.65, marginBottom: 14 }}>{event.description}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          ["📅", fmtDate(event.date) + (event.recurring ? " (Every Week)" : "")],
          ...(timeDisplay ? [["🕐", timeDisplay]] : []),
          ...(event.location ? [["📍", event.location]] : []),
        ].map(([icon, text]) => (
          <div key={icon} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: ICH.textMuted }}>
            <span style={{ fontSize: 12, flexShrink: 0 }}>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EventsClientProps {
  events: EventItem[];
}

export default function EventsClient({ events }: EventsClientProps) {
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...Array.from(new Set(events.map((e) => e.category)))];

  const featured = events.filter((e) => e.featured);
  const remaining = events.filter((e) => !e.featured);
  const displayed = filter === "all" ? remaining : remaining.filter((e) => e.category === filter);

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <GoldLabel>Community Calendar</GoldLabel>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, marginBottom: 10 }}>Events</h1>
        <p style={{ fontSize: 16, color: ICH.textMuted }}>Upcoming programs, prayers, and community events at ICH</p>
      </div>

      {/* Featured events */}
      {featured.length > 0 && (
        <ScrollReveal delay={0.1} style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: ICH.gold, fontFamily: "Inter,sans-serif", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 1.5, background: ICH.gold, display: "block" }} />
            Featured Events
            <span style={{ width: 18, height: 1.5, background: ICH.gold, display: "block" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
            {featured.map((e) => (
              <EventCard key={e.id} event={e} featured />
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
              background: filter === cat ? ICH.primary : "#fff",
              color: filter === cat ? "#fff" : ICH.textMuted,
              border: `1px solid ${filter === cat ? ICH.primary : ICH.border}`,
              textTransform: "capitalize",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              if (filter !== cat) {
                e.currentTarget.style.borderColor = ICH.primary;
                e.currentTarget.style.color = ICH.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== cat) {
                e.currentTarget.style.borderColor = ICH.border;
                e.currentTarget.style.color = ICH.textMuted;
              }
            }}
          >
            {cat === "all" ? "All Events" : cat}
          </button>
        ))}
      </div>

      {/* All (non-featured) upcoming */}
      <ScrollReveal delay={0.2}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: ICH.textMuted, fontFamily: "Inter,sans-serif", marginBottom: 14 }}>
          Upcoming Events
        </div>
        {displayed.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {displayed.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: ICH.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <p style={{ fontSize: 15 }}>No upcoming events in this category.</p>
          </div>
        )}
      </ScrollReveal>

      {/* Suggest event */}
      <ScrollReveal delay={0.3} style={{ marginTop: 48, padding: 24, background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 6 }}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, marginBottom: 6 }}>Have an event to add?</h3>
        <p style={{ fontSize: 13, color: ICH.textMuted, marginBottom: 14, lineHeight: 1.65 }}>Contact us to have your community event added to the ICH calendar.</p>
        <Btn variant="outline" href="/contact" size="sm">Contact Us →</Btn>
      </ScrollReveal>
    </div>
  );
}
