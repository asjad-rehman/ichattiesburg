"use client";

import React, { useState } from "react";
import { ICH, Btn, GoldLabel, Card } from "@/components/ui-primitives";
import { useSettings } from "@/lib/use-settings";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", hp: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const settings = useSettings();

  const address = settings?.address || "211 N 25th Avenue, Hattiesburg, MS 39401";
  const addressUrl = settings?.addressUrl || "https://www.google.com/maps/search/?api=1&query=211+N+25th+Avenue,+Hattiesburg,+MS+39401";
  const email = settings?.email || "ichattiesburg@gmail.com";
  const phone = settings?.phone || "";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/share/1EJ8ZYq7nT/?mibextid=wwXIfr";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/ichattiesburg";

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.hp) return; // honeypot caught a bot
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "b016e544-980f-4a68-9a76-f67ab2e775aa",
          name: form.name,
          email: form.email,
          subject: form.subject || "General Inquiry from ICH Website",
          message: form.message,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Something went wrong.");
      }
      setStatus("sent");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message");
      setStatus("error");
    }
  };

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
    transition: "border-color .15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: ICH.textMuted,
    marginBottom: 5,
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
    fontFamily: "Inter,sans-serif",
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 24px 80px" }}>
      <div style={{ marginBottom: 44 }}>
        <GoldLabel>Get in Touch</GoldLabel>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, marginBottom: 10 }}>Contact Us</h1>
        <p style={{ fontSize: 16, color: ICH.textMuted }}>We&rsquo;d love to hear from you. Reach out with any questions or comments.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40 }}>
        {/* Info */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              { icon: "📍", label: "Address",      content: address, href: addressUrl },
              { icon: "✉️", label: "Email",         content: email, href: `mailto:${email}` },
              ...(phone ? [{ icon: "📞", label: "Phone", content: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` }] : []),
              { icon: "🕌", label: "Prayer Times", content: "Open for all five daily prayers.\nSee prayer times page for schedule.", href: "/prayer-times" },
            ].map((item) => (
              <Card key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: `${ICH.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ICH.primary, fontFamily: "Inter,sans-serif", marginBottom: 3 }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ textDecoration: "none" }}>
                      <p style={{ fontSize: 13, color: ICH.primary, lineHeight: 1.65, whiteSpace: "pre-line", textDecoration: "underline", textUnderlineOffset: "3px" }}>{item.content}</p>
                    </a>
                  ) : (
                    <p style={{ fontSize: 13, color: ICH.textMuted, lineHeight: 1.65, whiteSpace: "pre-line" }}>{item.content}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ICH.primary, fontFamily: "Inter,sans-serif", marginBottom: 12 }}>Social Media</div>
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "8px 16px", background: "#1877F2", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: "none", fontFamily: "Inter,sans-serif" }}
              >
                Facebook
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "8px 16px", background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: "none", fontFamily: "Inter,sans-serif" }}
              >
                Instagram
              </a>
              <a
                href="https://wa.me/15714476997"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "8px 16px", background: "#25D366", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: "none", fontFamily: "Inter,sans-serif" }}
              >
                WhatsApp
              </a>
            </div>
          </Card>
        </div>

        {/* Form */}
        <div>
          {status === "sent" ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: ICH.bgCard, borderRadius: 8, border: `1px solid ${ICH.primary}33` }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, marginBottom: 10 }}>Message Sent</h3>
              <p style={{ fontSize: 14, color: ICH.textMuted, lineHeight: 1.7 }}>JazakAllah Khayran! We&rsquo;ll be in touch soon, insha&rsquo;Allah.</p>
              <div style={{ marginTop: 20 }}>
                <Btn variant="outline" onClick={() => { setForm({ name: "", email: "", subject: "", message: "", hp: "" }); setStatus("idle"); }} size="sm">Send Another</Btn>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 600, marginBottom: 24 }}>Send a Message</h2>
              
              {/* Honeypot */}
              <input
                type="text"
                value={form.hp}
                onChange={(e) => set("hp", e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your name"
                      style={inputStyle}
                      required
                      onFocus={(e) => { e.target.style.borderColor = ICH.primary; }}
                      onBlur={(e) => { e.target.style.borderColor = ICH.border; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com"
                      style={inputStyle}
                      required
                      onFocus={(e) => { e.target.style.borderColor = ICH.primary; }}
                      onBlur={(e) => { e.target.style.borderColor = ICH.border; }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    placeholder="What is this about?"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = ICH.primary; }}
                    onBlur={(e) => { e.target.style.borderColor = ICH.border; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Your message..."
                    rows={6}
                    required
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={(e) => { e.target.style.borderColor = ICH.primary; }}
                    onBlur={(e) => { e.target.style.borderColor = ICH.border; }}
                  />
                </div>
                
                {status === "error" && (
                  <div style={{ fontSize: 13, color: "#9a2b2b", background: "#fdf3f3", border: "1px solid #f5caca", padding: "10px 14px", borderRadius: 4 }}>
                    ⚠️ {errorMessage || "Something went wrong. Please try again."}
                  </div>
                )}

                <Btn variant="primary" size="lg" type="submit" style={{ width: "100%", justifyContent: "center" }}>
                  {status === "sending" ? "⏳ Sending…" : "✉️ Send Message"}
                </Btn>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
