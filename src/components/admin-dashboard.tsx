"use client";

import { useState } from "react";
import { LogOut, Plus, Bell, Calendar, Clock } from "lucide-react";
import { AdminUser } from "@/lib/auth";

export default function AdminDashboard({ user }: { user: AdminUser }) {
  const [activeTab, setActiveTab] = useState<"announcements" | "events" | "prayer">("announcements");

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 w-fit">
        {(["announcements", "events", "prayer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "prayer" ? "Prayer Times" : tab}
          </button>
        ))}
      </div>

      {activeTab === "announcements" && <AnnouncementsTab />}
      {activeTab === "events" && <EventsTab />}
      {activeTab === "prayer" && <PrayerTimesTab />}
    </div>
  );
}

function AnnouncementsTab() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/admin/announcements
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Announcements
        </h2>
      </div>
      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Announcement
        </h3>
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Announcement title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Announcement text..."
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Priority:</label>
          <div className="flex gap-3">
            {(["normal", "urgent"] as const).map((p) => (
              <label key={p} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="accent-primary"
                />
                <span className="capitalize">{p}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
        >
          {saved ? "Saved!" : "Save Announcement"}
        </button>
      </form>
    </div>
  );
}

function EventsTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", location: "", category: "community",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        Events
      </h2>
      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2"><Plus className="h-4 w-4" /> Add Event</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              {["jumuah", "eid", "halaqa", "fundraiser", "construction", "community", "other"].map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Time</label>
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Location</label>
          <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ICH Main Hall" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          {saved ? "Saved!" : "Save Event"}
        </button>
      </form>
    </div>
  );
}

function PrayerTimesTab() {
  const [times, setTimes] = useState({ fajr: "", sunrise: "", dhuhr: "", asr: "", maghrib: "", isha: "" });
  const [jumuah, setJumuah] = useState({ khutbah: "", salah: "", speaker: "", topic: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        Prayer Times Override
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Override prayer times if the automatic fetch fails. Leave blank to use fetched times.
      </p>
      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="font-medium mb-4">Daily Prayers</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {(["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const).map((p) => (
              <div key={p}>
                <label className="block text-sm font-medium mb-1.5 capitalize">{p}</label>
                <input type="time" value={times[p]} onChange={(e) => setTimes({ ...times, [p]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4">Jumuah Schedule</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Khutbah Time</label>
              <input type="time" value={jumuah.khutbah} onChange={(e) => setJumuah({ ...jumuah, khutbah: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Salah Time</label>
              <input type="time" value={jumuah.salah} onChange={(e) => setJumuah({ ...jumuah, salah: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Speaker</label>
              <input type="text" value={jumuah.speaker} onChange={(e) => setJumuah({ ...jumuah, speaker: e.target.value })}
                placeholder="Imam name"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Topic</label>
              <input type="text" value={jumuah.topic} onChange={(e) => setJumuah({ ...jumuah, topic: e.target.value })}
                placeholder="Khutbah topic"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </div>
        <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          {saved ? "Saved!" : "Save Times"}
        </button>
      </form>
    </div>
  );
}
