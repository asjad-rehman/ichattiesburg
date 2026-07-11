"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ICH } from "./ui-primitives";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  const address = settings?.address || "211 N 25th Avenue, Hattiesburg, MS 39401";
  const addressUrl = settings?.addressUrl || "https://www.google.com/maps/search/?api=1&query=211+N+25th+Avenue,+Hattiesburg,+MS+39401";
  const email = settings?.email || "ichattiesburg@gmail.com";
  const phone = settings?.phone || "";
  const shortName = settings?.masjidShortName || "ICH";
  const description = settings?.footerDescription || "Serving the Muslim community of Hattiesburg, Mississippi with prayer, education, and community programs.";
  
  const socialLinks = [];
  if (settings?.facebookUrl) socialLinks.push({ name: "Facebook", url: settings.facebookUrl });
  else socialLinks.push({ name: "Facebook", url: "https://www.facebook.com/share/1EJ8ZYq7nT/?mibextid=wwXIfr" });

  if (settings?.instagramUrl) socialLinks.push({ name: "Instagram", url: settings.instagramUrl });
  else socialLinks.push({ name: "Instagram", url: "https://www.instagram.com/ichattiesburg" });

  const col = {
    label: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".14em",
      textTransform: "uppercase" as const,
      color: ICH.accent,
      marginBottom: 14,
      fontFamily: "Inter,sans-serif",
    },
    link: {
      background: "none",
      border: "none",
      cursor: "pointer",
      textAlign: "left" as const,
      padding: 0,
      color: "rgba(255,255,255,.6)",
      fontSize: 13.5,
      fontFamily: "Inter,sans-serif",
      transition: "color .15s",
      display: "block",
      marginBottom: 8,
      textDecoration: "none",
    },
  };

  const hov = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = "#fff";
  };
  const unhov = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = "rgba(255,255,255,.6)";
  };

  return (
    <footer style={{ background: ICH.footerBg, color: "#fff" }}>
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg,transparent,${ICH.accent},transparent)`,
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 36px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: 40,
            marginBottom: 44,
          }}
        >
          {/* Brand */}
          <div>
            <img
              src="/uploads/logo.png"
              alt={shortName}
              style={{
                height: 52,
                filter: "brightness(0) invert(1)",
                marginBottom: 16,
              }}
            />
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.75,
                marginBottom: 18,
              }}
            >
              {description}
            </p>
            <div className="arabic-text" style={{ fontSize: 19, color: ICH.accent, lineHeight: 2 }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={col.label}>Quick Links</div>
            {[
              ["/prayer-times", "Prayer Times"],
              ["/events", "Events Calendar"],
              ["/donate", "Donate"],
              [`/about`, `About ${shortName}`],
              ["/impact", "Our Impact"],
              ["/resources", "Islamic Resources"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={col.link}
                onMouseEnter={hov}
                onMouseLeave={unhov}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={col.label}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { icon: "📍", text: address, href: addressUrl },
                { icon: "✉️", text: email, href: `mailto:${email}` },
                ...(phone ? [{ icon: "📞", text: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` }] : []),
              ].map(({ icon, text, href }) => (
                <div key={icon} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,.7)",
                        lineHeight: 1.65,
                        whiteSpace: "pre-line",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px"
                      }}
                    >
                      {text}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div style={col.label}>Follow Us</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "7px 14px",
                    background: "rgba(255,255,255,.07)",
                    borderRadius: 4,
                    color: "rgba(255,255,255,.9)",
                    fontSize: 13,
                    fontFamily: "Inter,sans-serif",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.14)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,.9)";
                  }}
                >
                  {s.name}
                </a>
              ))}
            </div>
            <Link
              href="/admin"
              style={{
                textDecoration: "none",
                fontSize: 11,
                color: "rgba(255,255,255,.25)",
                fontFamily: "Inter,sans-serif",
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.25)")}
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.09)",
            paddingTop: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>
            © {new Date().getFullYear()} {settings?.masjidShortName === "ICH" ? "Islamic Center of Hattiesburg" : (settings?.missionText ? settings.missionText.split(" ").slice(0, 4).join(" ") : "Masjid")}. All rights reserved.{" "}
            <span style={{ margin: "0 6px" }}>|</span>{" "}
            Developed by{" "}
            <a
              href="https://asjadrehman.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(255,255,255,.5)",
                textDecoration: "none",
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
            >
              Muhammad Asjad Rehman Hashmi
            </a>
          </p>
          <div style={{ display: "flex", gap: 18 }}>
            {[
              { label: "Privacy Policy", url: "/privacy" },
              { label: "Sitemap", url: "/sitemap.xml" }
            ].map((t) => (
              <Link
                key={t.label}
                href={t.url}
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.35)",
                  textDecoration: "none",
                  fontFamily: "Inter,sans-serif",
                  transition: "color .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.35)")}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

