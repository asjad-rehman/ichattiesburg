# Mosque Website Template (Next.js 16)

A modern, high-performance, and fully responsive website template designed for masajid (mosques) and Islamic community centers. 

Originally built for the **Islamic Center of Hattiesburg (ICH)**, this codebase has been refactored so that any mosque in the world can copy/clone it and customize it with their own branding, prayer calculation configurations, donation forms, styling, and content.

---

## Table of Contents

- [Core Tech Stack](#core-tech-stack)
- [How to Clone and Brand Your Masjid](#how-to-clone-and-brand-your-masjid)
  - [Step 1: Core Configuration (Coordinates & Timezone)](#step-1-core-configuration-coordinates--timezone)
  - [Step 2: Brand Styling & Colors](#step-2-brand-styling--colors)
  - [Step 3: Logo & Graphic Assets](#step-3-logo--graphic-assets)
  - [Step 4: Meta SEO Branding](#step-4-meta-seo-branding)
- [Quick Start for Development](#quick-start-for-development)
- [Environment Variables](#environment-variables)
- [Data Storage Architecture](#data-storage-architecture)
- [Admin Dashboard Features](#admin-dashboard-features)
- [API Reference](#api-reference)
- [Deployment Instructions](#deployment-instructions)

---

## Core Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Inline styles + global CSS (highly performant, zero dependencies)
- **Calculations**: [ADHAN.js](https://github.com/batoulapps/adhan-js) for dynamic prayer time calculations based on coordinates
- **Database / Storage**: Multi-tier engine (Upstash Redis + GitHub Commits + local backup JSON files) — **no PostgreSQL or MySQL required**
- **Hosting**: Vercel-optimized

---

## How to Clone and Brand Your Masjid

Follow these 4 simple steps to brand this template for your own masjid.

### Step 1: Core Configuration (Coordinates & Timezone)

Open `src/config/masjid.ts` and set your mosque's name, timezone, coordinates (latitude/longitude), and prayer calculation method.

```typescript
// src/config/masjid.ts

type CalcMethod = "NORTH_AMERICA" | "MUSLIM_WORLD_LEAGUE" | "EGYPTIAN" | "KARACHI" | "UMM_AL_QURA";
type MadhabType = "HANAFI" | "SHAFI";

export const masjid = {
  name: "Your Masjid Name",
  timezone: "America/New_York",                  // IANA Timezone identifier
  coordinates: { lat: 40.7128, lon: -74.0060 },  // Used for Adhan time calculations
  calc: {
    method: "NORTH_AMERICA",                     // Calculation method
    fajrAngle: 15,                               // Custom Fajr angle (optional)
    ishaAngle: 15,                               // Custom Isha angle (optional)
    madhab: "SHAFI",                             // HANAFI (later Asr) or SHAFI (earlier Asr)
  },
};
```

### Step 2: Brand Styling & Colors

Open `src/lib/theme.ts` to customize the primary theme colors to match your brand logo.

```typescript
// src/lib/theme.ts

export const ICH = {
  primary:      '#145c70',  // Main brand color (e.g. Navbar, headers)
  primaryDark:  '#0d3d4a',  // Dark accent / Hero backgrounds
  primaryMid:   '#104b5c',  
  primaryLight: '#1f7a95',
  gold:         '#247c6c',  // Secondary brand color (e.g. buttons, borders)
  goldLight:    '#3ba491',
  goldDark:     '#18574a',
  accent:       '#5ce1cb',  // Bright contrast color for dark mode elements
  bg:           '#f4f8f9',  // Base page background
  bgCard:       '#e6f0f2',  // Card background
  bgCard2:      '#d3e3e8',
  text:         '#121d21',  // Default text color
  textMuted:    '#50676e',  // Muted subtitles/descriptions
  border:       '#c3d7dc',  
  footerBg:     '#08171c',  // Footer background color
};
```

### Step 3: Logo & Graphic Assets

Replace the following files in the `/public` directory:
1. **Logo**: Save your transparent logo PNG file as `/public/uploads/logo.png`. (It will automatically render in the navbar and footer).
2. **Favicon**: Place your browser shortcut icon at `/public/icon.png`.
3. **Hero Mosque Graphic**: The home page uses a custom hero Mosque outline SVG inside `/src/components/home-client.tsx` (function `MosqueHero`). If needed, replace or style the colors/paths of this SVG.

### Step 4: Meta SEO Branding

Open `src/app/layout.tsx` and configure your website domain and SEO meta tags:

- Change `https://ichattiesburg.org` to your own website domain.
- Update description, keywords, OpenGraph site name, and OG image references.

---

## Quick Start for Development

```bash
# Clone the repository
git clone https://github.com/asjad-rehman/ichattiesburg.git your-masjid-web
cd your-masjid-web

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your site. Access the Admin Dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Environment Variables

Your `.env.local` contains all server-side settings:

### Required

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key for admin session tokens (make this long and secure) |
| `ADMIN_EMAIL` | The admin email used to log in |
| `ADMIN_PASSWORD_HASH` | A bcrypt hash of the admin password |

*To generate a password hash, run:*
```bash
node -e "const b=require('bcryptjs'); b.hash('YourSecurePassword', 12).then(console.log)"
```

### Dynamic Storage Configuration (Highly Recommended)

This template uses a hybrid cache layer to prevent data loss on serverless cold starts. **For production, configure at least one of the following:**

1. **GitHub Commits (File-based Persistence)**:
   - Provide a `GITHUB_TOKEN` (Personal Access Token with `repo` scope).
   - Whenever an admin saves settings, announcements, or events, the server will commit the updated JSON file directly back to your GitHub repository in the `public/` directory!
   - Required variable: `GITHUB_TOKEN`

2. **Upstash Redis (High-speed Key-Value Cache)**:
   - Connect an Upstash Redis database to store settings.
   - Required variables: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or Vercel KV aliases `KV_REST_API_URL` and `KV_REST_API_TOKEN`).

---

## Data Storage Architecture

All customizable website sections are backed by local JSON files inside the `/public` folder. These files act as seed databases:

| File | Content |
|---|---|
| `public/settings.json` | Site settings (address, phone, email, Zeffy UUIDs, socials, mission) |
| `public/programs.json` | Pinned initiatives/classes shown on the About page |
| `public/resource_links.json` | Pinned link grid shown on the Resources page |
| `public/announcements.json` | Alerts banner displayed at the top of the site |
| `public/events.json` | Upcoming events and calendar items |
| `public/board.json` | Leadership board members |
| `public/halal_resources.json` | Text descriptions of local Halal dining and groceries |
| `public/impact.json` | Metrics and stories shown on the Impact page |
| `public/jamaat.json` | Iqama/congregation prayer times override |

---

## Admin Dashboard Features

Once logged in at `/admin`, you can manage all aspects of the site:

### ⚙️ Site Settings
Manage address, contact email, phone number, Facebook/Instagram links, about-page mission text, Oak Grove masjid project details, Zeffy donation form IDs, and the home-page Maghrib display text without writing any code.

### 📚 Programs & Initiatives
Add, edit, or delete programs/classes (e.g. Sunday School, Halaqahs). Each program supports:
- Emoji Icon (e.g., 🕌, 📚, 📖)
- Title & Schedule
- Full description
- Active toggle (instantly hide/show the program on your site)

### 🔗 Resource Links
Manage categorized links on your resources page (e.g. Quran.com, Hadith sites, prayer apps, local organizations). Easily sort links with custom display orders.

### 🕐 Prayer Times Override
While adhan calculations are automated, you can manually update the exact Congregation (Iqama) time offsets:
- Set congregation times for Fajr, Dhuhr, Asr, Maghrib, and Isha.
- Configure up to two Jumuah slots with individual khutbah and salah times.

---

## API Reference

### Public API Endpoints
- `GET /api/announcements` — Get active announcements banners.
- `GET /api/jamaat` — Get congregation/Jumuah overrides.
- `GET /api/admin/settings` — Read site settings configuration.
- `GET /api/admin/programs` — Read initiatives list.
- `GET /api/admin/resource-links` — Read Islamic links list.

### Auth & Write Endpoints (Admin Token Cookie Required)
- `POST /api/admin/login` / `POST /api/admin/logout`
- `GET/POST/PUT/DELETE /api/admin/announcements`
- `GET/POST/PUT/DELETE /api/admin/events`
- `GET/POST/PUT/DELETE /api/admin/board`
- `GET/POST/PUT/DELETE /api/admin/impact`
- `GET/POST/PUT/DELETE /api/admin/programs`
- `GET/POST/PUT/DELETE /api/admin/resource-links`
- `POST /api/admin/settings`
- `POST /api/admin/upload` (Upload image attachments)

---

## Deployment Instructions

### Deploy to Vercel (Fastest)

1. Push your rebranded codebase to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Open **Environment Variables** and enter:
   - `JWT_SECRET` (Base64 random string)
   - `ADMIN_EMAIL` & `ADMIN_PASSWORD_HASH`
   - `GITHUB_TOKEN` (To allow the admin dashboard to commit data directly to your repo)
5. Click **Deploy**. Vercel will build and launch your site in under 2 minutes!
