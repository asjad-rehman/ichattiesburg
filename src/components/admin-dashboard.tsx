"use client";

import { useState, useEffect } from "react";
import { LogOut, Plus, Bell, Calendar, Clock, Trash2, Edit2, Users } from "lucide-react";
import { AdminUser } from "@/lib/auth";
import { ICH, Btn, Card } from "./ui-primitives";
import { parseLocalDate } from "@/lib/utils";

export default function AdminDashboard({ user }: { user: AdminUser }) {
  const [activeTab, setActiveTab] = useState<"announcements" | "events" | "prayer" | "board" | "resources">("announcements");

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const tabButtonStyle = (tab: "announcements" | "events" | "prayer" | "board" | "resources") => ({
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
        {(["announcements", "events", "prayer", "board", "resources"] as const).map((tab) => (
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
      {activeTab === "board" && <BoardTab />}
      {activeTab === "resources" && <ResourcesTab />}
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/announcements")
      .then(r => r.json())
      .then(d => setAnnouncements(d.announcements || []));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const res = await fetch("/api/admin/announcements", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { id: editingId, title, body, priority } : { title, body, priority }),
    });
    if (res.ok) {
      const data = await res.json();
      if (isEdit) {
        setAnnouncements(prev => prev.map(a => a.id === editingId ? data.announcement : a));
      } else {
        setAnnouncements(prev => [data.announcement, ...prev]);
      }
      setTitle(""); setBody(""); setPriority("normal"); setEditingId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleEdit = (a: any) => {
    setEditingId(a.id);
    setTitle(a.title);
    setBody(a.body);
    setPriority(a.priority || "normal");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle(""); setBody(""); setPriority("normal");
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
            {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? "Edit Announcement" : "New Announcement"}
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

          <div style={{ display: "flex", gap: 12 }}>
            <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
              {saved ? "Saved!" : (editingId ? "Update Announcement" : "Save Announcement")}
            </Btn>
            {editingId && (
              <Btn variant="outline" onClick={cancelEdit} style={{ width: "fit-content" }}>
                Cancel Edit
              </Btn>
            )}
          </div>
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
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => handleEdit(a)} style={{ background: "none", border: "none", color: ICH.primary, cursor: "pointer", padding: 4 }}>
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(a.id)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", padding: 4 }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", location: "", category: "community", recurring: false,
  });

  useEffect(() => {
    fetch("/api/admin/events")
      .then(r => r.json())
      .then(d => setEvents(d.events || []));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const res = await fetch("/api/admin/events", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId, featured: false }),
    });
    if (res.ok) {
      const data = await res.json();
      if (isEdit) {
        setEvents(prev => prev.map(ev => ev.id === editingId ? data.event : ev).sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()));
      } else {
        setEvents(prev => [...prev, data.event].sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()));
      }
      setForm({ title: "", description: "", date: "", time: "", location: "", category: "community", recurring: false });
      setEditingId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleEdit = (a: any) => {
    setEditingId(a.id);
    setForm({ title: a.title, description: a.description, date: a.date, time: a.time || "", location: a.location || "", category: a.category || "community", recurring: a.recurring || false });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", date: "", time: "", location: "", category: "community", recurring: false });
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
            {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? "Edit Event" : "Add Event"}
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

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="recurring" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} style={{ width: 18, height: 18 }} />
            <label htmlFor="recurring" style={{ fontSize: 15, fontWeight: 600, color: ICH.text }}>Recurring Every Week</label>
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="ICH Main Hall" />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
              {saved ? "Saved!" : (editingId ? "Update Event" : "Save Event")}
            </Btn>
            {editingId && (
              <Btn variant="outline" onClick={cancelEdit} style={{ width: "fit-content" }}>
                Cancel Edit
              </Btn>
            )}
          </div>
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
                    {a.featured && <span style={{ fontSize: 10, background: ICH.gold, color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 6, verticalAlign: "middle" }}>Featured</span>}
                    {a.recurring && <span style={{ fontSize: 10, background: ICH.primary, color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 6, verticalAlign: "middle" }}>Weekly</span>}
                  </h4>
                  <div style={{ fontSize: 12, color: ICH.primary, fontWeight: 600, marginBottom: 4 }}>{a.date} {a.time && `at ${a.time}`}</div>
                  <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.6 }}>{a.description}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => handleEdit(a)} style={{ background: "none", border: "none", color: ICH.primary, cursor: "pointer", padding: 4 }}>
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(a.id)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", padding: 4 }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type JummahSlot = { khutbah: string; salah: string };

function PrayerTimesTab() {
  const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
  const [times, setTimes] = useState<Record<typeof PRAYER_KEYS[number], string>>({ fajr: "", dhuhr: "", asr: "", maghrib: "", isha: "" });
  const [jummah, setJummah] = useState<JummahSlot[]>([{ khutbah: "", salah: "" }]);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetch("/api/jamaat")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const data = d.data;
          setTimes({ fajr: data.fajr || "", dhuhr: data.dhuhr || "", asr: data.asr || "", maghrib: data.maghrib || "", isha: data.isha || "" });
          if (Array.isArray(data.jummah) && data.jummah.length) setJummah(data.jummah);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    try {
      const res = await fetch("/api/jamaat/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { ...times, jummah } }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError(json.error || `Server error (${res.status})`);
      }
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Network error");
    }
  };

  const updateSlot = (i: number, field: keyof JummahSlot, value: string) => {
    const next = [...jummah];
    next[i] = { ...next[i], [field]: value };
    setJummah(next);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Clock className="h-5 w-5" style={{ color: ICH.primary }} />
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600 }}>Jamaat Times</h2>
      </div>
      <p style={{ fontSize: 13, color: ICH.textMuted, marginBottom: 20 }}>
        Set congregation (jamaat) times. Adhan times are calculated automatically from the sun&apos;s position.
      </p>

      <form onSubmit={handleSave} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 30 }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.primary, marginBottom: 16 }}>Daily Jamaat Times</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {PRAYER_KEYS.map((p) => (
              <div key={p}>
                <label style={{ ...labelStyle, textTransform: "capitalize" }}>{p}</label>
                <input type="time" value={times[p]} onChange={(e) => setTimes({ ...times, [p]: e.target.value })} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${ICH.border}`, paddingTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.primary }}>Jumuah Slots</h3>
            <button type="button" onClick={() => setJummah([...jummah, { khutbah: "", salah: "" }])} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 4, border: `1px solid ${ICH.border}`, background: "#fff", cursor: "pointer", color: ICH.primary, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>
              + Add Slot
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {jummah.map((slot, i) => (
              <div key={i} style={{ background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 6, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ICH.primary, fontFamily: "Inter,sans-serif" }}>Jummah {i + 1}</span>
                  {jummah.length > 1 && (
                    <button type="button" onClick={() => setJummah(jummah.filter((_, j) => j !== i))} style={{ fontSize: 11, color: "#e53935", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Remove</button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Khutbah</label>
                    <input type="time" value={slot.khutbah} onChange={(e) => updateSlot(i, "khutbah", e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Salah</label>
                    <input type="time" value={slot.salah} onChange={(e) => updateSlot(i, "salah", e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
            {saved ? "✓ Saved!" : "Save Times"}
          </Btn>
          {saved && (
            <span style={{ fontSize: 13, color: "#2e7d32", fontFamily: "Inter,sans-serif" }}>
              Times updated — changes live on the site immediately.
            </span>
          )}
          {saveError && (
            <span style={{ fontSize: 13, color: "#c62828", fontFamily: "Inter,sans-serif", maxWidth: 400 }}>
              ⚠ {saveError}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function BoardTab() {
  const [board, setBoard] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "" });

  useEffect(() => {
    fetch("/api/admin/board")
      .then(r => r.json())
      .then(d => setBoard(d.board || []));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const res = await fetch("/api/admin/board", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (isEdit) {
        setBoard(prev => prev.map(b => b.id === editingId ? data.member : b));
      } else {
        setBoard(prev => [...prev, data.member]);
      }
      setForm({ name: "", role: "" });
      setEditingId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleEdit = (b: any) => {
    setEditingId(b.id);
    setForm({ name: b.name, role: b.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", role: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete board member?")) return;
    const res = await fetch(`/api/admin/board?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setBoard(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Users className="h-5 w-5" style={{ color: ICH.primary }} />
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600 }}>Board Members</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Form */}
        <form onSubmit={handleSave} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20, height: "fit-content" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, color: ICH.primary }}>
            {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? "Edit Member" : "Add Member"}
          </h3>

          <div>
            <label style={labelStyle}>Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} placeholder="John Doe" />
          </div>

          <div>
            <label style={labelStyle}>Role</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required style={inputStyle} placeholder="President" />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Btn type="submit" variant="primary" style={{ width: "fit-content" }}>
              {saved ? "Saved!" : (editingId ? "Update Member" : "Save Member")}
            </Btn>
            {editingId && (
              <Btn variant="outline" onClick={cancelEdit} style={{ width: "fit-content" }}>
                Cancel Edit
              </Btn>
            )}
          </div>
        </form>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ICH.textMuted, marginBottom: 8 }}>
            Current Board
          </h3>
          {board.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: ICH.textMuted, border: `1px dashed ${ICH.border}`, borderRadius: 8 }}>
              No board members
            </div>
          ) : board.map(b => (
            <div key={b.id} style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 6, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <h4 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.text, marginBottom: 4 }}>
                    {b.name}
                  </h4>
                  <p style={{ fontSize: 13, color: ICH.primary, fontWeight: 600 }}>{b.role}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => handleEdit(b)} style={{ background: "none", border: "none", color: ICH.primary, cursor: "pointer", padding: 4 }}>
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(b.id)} style={{ background: "none", border: "none", color: "#e53935", cursor: "pointer", padding: 4 }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesTab() {
  const [resources, setResources] = useState<any>({ restaurants: "", meatSupply: "" });
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/resources")
      .then(r => r.json())
      .then(d => setResources(d.resources || { restaurants: "", meatSupply: "" }));
  }, []);

  const handleSave = async (type: "restaurants" | "meatSupply") => {
    setSaving(type);
    setMessage("");

    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: resources[type] }),
      });
      const data = await res.json();
      if (res.ok) {
        setResources(data.resources);
        setMessage(`${type === "restaurants" ? "Restaurants" : "Meat Supply"} updated successfully!`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>🍽️</span>
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600 }}>Halal Resources</h2>
      </div>
      <p style={{ fontSize: 13, color: ICH.textMuted, marginBottom: 20 }}>
        Manage text content for Halal Restaurants and Meat Supply lists.
      </p>

      {message && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "#e8f5e9", color: "#2e7d32", borderRadius: 6, fontSize: 13, border: "1px solid #c8e6c9" }}>
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        
        {/* Restaurants Form */}
        <div style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.primary }}>
            Halal Restaurants
          </h3>
          
          <div>
            <label style={labelStyle}>Content</label>
            <textarea 
              rows={8}
              value={resources.restaurants || ""}
              onChange={(e) => setResources({ ...resources, restaurants: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="List local restaurants here..."
              disabled={saving === "restaurants"}
            />
          </div>
          
          <Btn 
            onClick={() => handleSave("restaurants")} 
            variant="primary" 
            style={{ width: "fit-content" }}
            disabled={saving === "restaurants"}
          >
            {saving === "restaurants" ? "Saving..." : "Save Restaurants"}
          </Btn>
        </div>

        {/* Meat Supply Form */}
        <div style={{ background: "#fff", border: `1px solid ${ICH.border}`, borderRadius: 8, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 600, color: ICH.primary }}>
            Halal Meat Supply
          </h3>
          
          <div>
            <label style={labelStyle}>Content</label>
            <textarea 
              rows={8}
              value={resources.meatSupply || ""}
              onChange={(e) => setResources({ ...resources, meatSupply: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="List meat supply sources here..."
              disabled={saving === "meatSupply"}
            />
          </div>
          
          <Btn 
            onClick={() => handleSave("meatSupply")} 
            variant="primary" 
            style={{ width: "fit-content" }}
            disabled={saving === "meatSupply"}
          >
            {saving === "meatSupply" ? "Saving..." : "Save Meat Supply"}
          </Btn>
        </div>

      </div>
    </div>
  );
}
