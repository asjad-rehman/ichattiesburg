"use client";

import { useState, useEffect } from "react";
import { LogOut, Plus, Bell, Calendar, Clock, Trash2 } from "lucide-react";
import { AdminUser } from "@/lib/auth";
import { ICH, Btn, Card } from "./ui-primitives";

export default function AdminDashboard({ user }: { user: AdminUser }) {
  const [activeTab, setActiveTab] = useState<"announcements" | "events" | "prayer">("announcements");

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const tabButtonStyle = (tab: "announcements" | "events" | "prayer") => ({
    padding: "8px 20px",
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter,sans-serif",
    background: activeTab === tab ? ICH.primary : "transparent",
    color: activeTab === tab ? "#fff" : ICH.textMuted,
    border: "none",
    transition: "all .15s",
  });

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 36, fontWeight: 600, color: ICH.text }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: ICH.textMuted }}>Welcome back, <strong style={{ color: ICH.text }}>{user.name}</strong></p>
        </div>
        <Btn variant="outline" onClick={logout} style={{ fontSize: 13, gap: 5, padding: "8px 16px" }}>
          <LogOut className="h-4 w-4" />
          Logout
        </Btn>
      </div>

      {/* Tabs Row */}
      <div style={{ display: "flex", gap: 8, background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 6, padding: 6, marginBottom: 36, width: "fit-content" }}>
        {(["announcements", "events", "prayer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={tabButtonStyle(tab)}
          >
            {tab === "prayer" ? "Prayer Times" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "announcements" && <AnnouncementsTab />}
      {activeTab === "events" && <EventsTab />}
      {activeTab === "prayer" && <PrayerTimesTab />}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: `1px solid ${ICH.border}`,
  borderRadius: 4,
  fontSize: 14,
  fontFamily: "Inter,sans-serif",
  background: "#fff",
  color: ICH.text,
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase" as const,
  color: ICH.textMuted,
  fontFamily: "Inter,sans-serif",
  marginBottom: 6,
};

function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/announcements")
      .then(r => r.json())
      .then(d => setAnnouncements(d.announcements || []));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, priority }),
    });
    if (res.ok) {
      const data = await res.json();
      setAnnouncements(prev => [data.announcement, ...prev]);
      setTitle(""); setBody(""); setPriority("normal");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete announcement?")) return;
    const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Bell className="h-5 w-5" style={{ color: ICH.primary }} />
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600 }}>Announcements</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Form */}
        <form onSubmit={handleSave} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20, height: "fit-content" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, color: ICH.primary }}>
            <Plus className="h-4 w-4" /> New Announcement
          </h3>
          
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
              placeholder="Announcement title"
            />
          </div>
          
          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Announcement text..."
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Priority:</label>
            <div style={{ display: "flex", gap: 16 }}>
              {(["normal", "urgent"] as const).map((p) => (
                <label key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", fontFamily: "Inter,sans-serif", color: ICH.text }}>
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                    style={{ accentColor: ICH.primary }}
                  />
                  <span style={{ textTransform: "capitalize" }}>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
            {saved ? "Saved!" : "Save Announcement"}
          </Btn>
        </form>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ICH.textMuted, marginBottom: 8 }}>
            Current Announcements
          </h3>
          {announcements.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: ICH.textMuted, border: `1px dashed ${ICH.border}`, borderRadius: 8 }}>
              No announcements
            </div>
          ) : announcements.map(a => (
            <div key={a.id} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 6, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <h4 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.text, marginBottom: 4 }}>
                    {a.priority === "urgent" ? "🚨 " : ""}{a.title}
                  </h4>
                  <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.6 }}>{a.body}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", padding: 4 }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", location: "", category: "community",
  });

  useEffect(() => {
    fetch("/api/admin/events")
      .then(r => r.json())
      .then(d => setEvents(d.events || []));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, featured: false }),
    });
    if (res.ok) {
      const data = await res.json();
      setEvents(prev => [...prev, data.event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setForm({ title: "", description: "", date: "", time: "", location: "", category: "community" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete event?")) return;
    const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Calendar className="h-5 w-5" style={{ color: ICH.primary }} />
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600 }}>Events</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Form */}
        <form onSubmit={handleSave} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20, height: "fit-content" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, color: ICH.primary }}>
            <Plus className="h-4 w-4" /> Add Event
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, height: "40px" }}
              >
                {["jumuah", "eid", "halaqa", "fundraiser", "construction", "community", "other"].map((c) => (
                  <option key={c} value={c} style={{ textTransform: "capitalize" }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="ICH Main Hall" />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
            {saved ? "Saved!" : "Save Event"}
          </Btn>
        </form>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ICH.textMuted, marginBottom: 8 }}>
            Upcoming Events
          </h3>
          {events.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: ICH.textMuted, border: `1px dashed ${ICH.border}`, borderRadius: 8 }}>
              No events
            </div>
          ) : events.map(a => (
            <div key={a.id} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 6, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <h4 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.text, marginBottom: 4 }}>
                    {a.title}
                  </h4>
                  <div style={{ fontSize: 12, color: ICH.primary, fontWeight: 600, marginBottom: 4 }}>{a.date} {a.time && `at ${a.time}`}</div>
                  <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.6 }}>{a.description}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", padding: 4 }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrayerTimesTab() {
  const [times, setTimes] = useState({ fajr: "", sunrise: "", dhuhr: "", asr: "", maghrib: "", isha: "" });
  const [jumuah, setJumuah] = useState({ khutbah: "", salah: "", speaker: "", topic: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/prayer-times")
      .then(r => r.json())
      .then(d => {
        if (d.overrides) {
          const overrides = d.overrides;
          setTimes({
            fajr: overrides.fajr || "",
            sunrise: overrides.sunrise || "",
            dhuhr: overrides.dhuhr || "",
            asr: overrides.asr || "",
            maghrib: overrides.maghrib || "",
            isha: overrides.isha || "",
          });
          setJumuah({
            khutbah: overrides.jumuah_khutbah || "",
            salah: overrides.jumuah_salah || "",
            speaker: overrides.jumuah_speaker || "",
            topic: overrides.jumuah_topic || "",
          });
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/prayer-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...times, 
        jumuah_khutbah: jumuah.khutbah,
        jumuah_salah: jumuah.salah,
        jumuah_speaker: jumuah.speaker,
        jumuah_topic: jumuah.topic
      }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Clock className="h-5 w-5" style={{ color: ICH.primary }} />
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600 }}>Prayer Times Override</h2>
      </div>
      <p style={{ fontSize: 13, color: ICH.textMuted, marginBottom: 20 }}>
        Override prayer times if the automatic fetch fails. Leave blank to use fetched times.
      </p>

      <form onSubmit={handleSave} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 30 }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.primary, marginBottom: 16 }}>Daily Prayers</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {(["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const).map((p) => (
              <div key={p}>
                <label style={{ ...labelStyle, textTransform: "capitalize" }}>{p}</label>
                <input type="time" value={times[p]} onChange={(e) => setTimes({ ...times, [p]: e.target.value })} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${ICH.border}`, paddingTop: 20 }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.primary, marginBottom: 16 }}>Jumuah Schedule</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>Khutbah Time</label>
              <input type="time" value={jumuah.khutbah} onChange={(e) => setJumuah({ ...jumuah, khutbah: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Salah Time</label>
              <input type="time" value={jumuah.salah} onChange={(e) => setJumuah({ ...jumuah, salah: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Speaker</label>
              <input type="text" value={jumuah.speaker} onChange={(e) => setJumuah({ ...jumuah, speaker: e.target.value })} placeholder="Imam name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Topic</label>
              <input type="text" value={jumuah.topic} onChange={(e) => setJumuah({ ...jumuah, topic: e.target.value })} placeholder="Khutbah topic" style={inputStyle} />
            </div>
          </div>
        </div>

        <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
          {saved ? "Saved!" : "Save Times"}
        </Btn>
      </form>
    </div>
  );
}
