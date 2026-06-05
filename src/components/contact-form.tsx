"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", hp: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.hp) return; // honeypot
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">
          JazakAllah Khair. We&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "", hp: "" }); }}
          className="mt-6 px-4 py-2 text-sm text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-4">Send a Message</h2>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={form.hp}
        onChange={(e) => setForm({ ...form, hp: e.target.value })}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="subject">Subject</label>
        <select
          id="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="">Select a subject</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Prayer Times">Prayer Times</option>
          <option value="Events & Programs">Events & Programs</option>
          <option value="Donation Inquiry">Donation Inquiry</option>
          <option value="Oak Grove Project">Oak Grove Project</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="message">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          placeholder="Your message..."
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error || "Something went wrong. Please try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
