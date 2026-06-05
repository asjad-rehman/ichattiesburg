"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICH } from "./ui-primitives";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { id: "/", label: "Home" },
    { id: "/prayer-times", label: "Prayer Times" },
    { id: "/events", label: "Events" },
    { id: "/about", label: "About" },
    { id: "/resources", label: "Resources" },
    { id: "/contact", label: "Contact" },
  ];

  const isActive = (id: string) => {
    if (id === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(id);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: scrolled ? "rgba(250,249,246,.97)" : "rgba(250,249,246,.99)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${scrolled ? ICH.border : "transparent"}`,
        boxShadow: scrolled ? "0 1px 10px rgba(0,0,0,.07)" : "none",
        transition: "all .3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ cursor: "pointer", flexShrink: 0 }} aria-label="Home">
          <img
            src="/uploads/logo.png"
            alt="Islamic Center of Hattiesburg"
            style={{ height: 46, width: "auto", display: "block" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav
          className="desktop-nav"
          aria-label="Main"
          style={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {links.map((l) => {
            const active = isActive(l.id);
            return (
              <Link
                key={l.id}
                href={l.id}
                style={{
                  padding: "7px 12px",
                  background: active ? `${ICH.primary}14` : "transparent",
                  color: active ? ICH.primary : ICH.textMuted,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 13.5,
                  fontWeight: active ? 500 : 400,
                  borderRadius: 4,
                  transition: "all .15s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = ICH.text;
                    e.currentTarget.style.background = "rgba(0,0,0,.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = ICH.textMuted;
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/donate"
            style={{
              padding: "8px 20px",
              background: ICH.gold,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: 3,
              fontFamily: "Inter,sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".02em",
              transition: "background .15s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = ICH.goldDark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = ICH.gold)}
          >
            ♥ Donate
          </Link>

          <button
            className="mobile-btn"
            onClick={() => setOpen(!open)}
            style={{
              display: "none",
              padding: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: ICH.text,
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="mobile-menu"
          style={{
            borderTop: `1px solid ${ICH.border}`,
            background: ICH.bg,
            padding: "10px 16px 14px",
          }}
        >
          {links.map((l) => {
            const active = isActive(l.id);
            return (
              <Link
                key={l.id}
                href={l.id}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  background: active ? `${ICH.primary}14` : "transparent",
                  color: active ? ICH.primary : ICH.text,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 15,
                  fontWeight: active ? 500 : 400,
                  borderRadius: 4,
                  marginBottom: 2,
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 8,
              width: "100%",
              padding: "11px 12px",
              background: ICH.gold,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
              fontFamily: "Inter,sans-serif",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ♥ Donate Now
          </Link>
        </div>
      )}
    </header>
  );
}
