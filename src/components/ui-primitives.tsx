"use client";

import React, { useState } from "react";
import Link from "next/link";

import { ICH } from "@/lib/theme";
export { ICH };


interface BtnProps {
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'outline' | 'ghost-dark' | 'muted';
  onClick?: () => void;
  href?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
  type?: "submit" | "button" | "reset";
}

export function Btn({ children, variant = 'primary', onClick, href, style = {}, size = 'md', type = 'button' }: BtnProps) {
  const pad = size === 'sm' ? '7px 16px' : size === 'lg' ? '13px 30px' : '10px 22px';
  const fs  = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: pad,
    borderRadius: 3,
    fontSize: fs,
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    transition: 'all .18s ease',
    letterSpacing: '.015em',
    whiteSpace: 'nowrap',
  };
  const variants = {
    primary:      { background: ICH.primary,     color: '#fff' },
    gold:         { background: ICH.gold,         color: '#fff' },
    'outline':    { background: 'transparent',   color: ICH.primary,  border: `1.5px solid ${ICH.primary}` },
    'ghost-dark': { background: 'rgba(255,255,255,.13)', color: '#fff', border: '1.5px solid rgba(255,255,255,.28)' },
    muted:        { background: ICH.bgCard2,      color: ICH.text,     border: `1px solid ${ICH.border}` },
  };

  const finalStyle = { ...base, ...variants[variant], ...style };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.opacity = '.84';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  if (href) {
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
      return (
        <a href={href} onClick={onClick} style={finalStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} style={finalStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} style={finalStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </button>
  );
}

export function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:12 }}>
      <span style={{ width:22, height:1.5, background:ICH.gold, display:'block' }}/>
      <span style={{ fontSize:11, fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:ICH.gold, fontFamily:'Inter, sans-serif' }}>
        {children}
      </span>
      <span style={{ width:22, height:1.5, background:ICH.gold, display:'block' }}/>
    </div>
  );
}

interface SectionHeadProps {
  label?: string;
  title: string;
  sub?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionHead({ label, title, sub, center, light }: SectionHeadProps) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 40 }}>
      {label && <GoldLabel>{label}</GoldLabel>}
      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontWeight: 600,
        fontSize: 'clamp(26px,3.8vw,40px)',
        color: light ? '#fff' : ICH.text,
        marginBottom: sub ? 12 : 0,
      }}>{title}</h2>
      {sub && <p style={{ fontSize:16, color: light ? 'rgba(255,255,255,.7)' : ICH.textMuted, maxWidth: center ? 520 : 'none', margin: center ? '0 auto' : 0, lineHeight:1.7 }}>{sub}</p>}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
}

export function Card({ children, style = {}, hover = false }: CardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        background: ICH.bgCard,
        border: `1px solid ${hov && hover ? ICH.primary+'55' : ICH.border}`,
        borderRadius:6,
        padding:24,
        transition:'border-color .2s, box-shadow .2s',
        boxShadow: hov && hover ? '0 4px 18px rgba(27,94,32,.09)' : 'none',
        ...style
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </div>
  );
}

interface TagProps {
  children: React.ReactNode;
  color?: 'green' | 'yellow' | 'blue' | 'purple' | 'orange' | 'teal' | 'gray';
}

export function Tag({ children, color = 'gray' }: TagProps) {
  const colors = {
    green:  ['#dcf5e4','#1b5e20'],
    yellow: ['#fef9e0','#7a6000'],
    blue:   ['#e0eeff','#1a3a7a'],
    purple: ['#f0e0ff','#4a1a7a'],
    orange: ['#fff0e0','#7a3a00'],
    teal:   ['#e0f5f5','#0a4a4a'],
    gray:   ['#f0f0f0','#404040'],
  };
  const [bg, fg] = colors[color] || colors.gray;
  return (
    <span style={{
      display:'inline-block',
      padding:'3px 10px',
      borderRadius:20,
      fontSize:11,
      fontWeight:600,
      background:bg,
      color:fg,
      letterSpacing:'.04em',
      textTransform:'capitalize',
      fontFamily:'Inter, sans-serif'
    }}>
      {children}
    </span>
  );
}
