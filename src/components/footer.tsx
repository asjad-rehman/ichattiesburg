"use client";

import React from "react";
import Link from "next/link";
import { ICH } from "./ui-primitives";

export default function Footer() {
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
              alt="ICH"
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
              Serving the Muslim community of Hattiesburg, Mississippi with
              prayer, education, and community programs.
            </p>
            <div className="amiri" style={{ fontSize: 19, color: ICH.accent, lineHeight: 2 }}>
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
              ["/about", "About ICH"],
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
                ["📍", "211 N 25th Avenue\nHattiesburg, MS 39401"],
                ["✉️", "ICHattiesburg@protonmail.com"],
              ].map(([icon, text]) => (
                <div key={icon} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.65,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div style={col.label}>Follow Us</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["Facebook", "Instagram"].map((s) => (
                <a
                  key={s}
                  href={`https://www.${s.toLowerCase()}.com/ichattiesburg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "7px 14px",
                    background: "rgba(255,255,255,.07)",
                    color: "rgba(255,255,255,.75)",
                    borderRadius: 3,
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,.1)",
                    fontFamily: "Inter,sans-serif",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.14)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,.75)";
                  }}
                >
                  {s}
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
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", fontFamily: "Inter,sans-serif" }}>
            © {new Date().getFullYear()} Islamic Center of Hattiesburg. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 18 }}>
            {["Privacy Policy", "Sitemap"].map((t) => (
              <a
                key={t}
                href="#"
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
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
