# Islamic Center of Hattiesburg — Website

A modern, fully-featured website for [ichattiesburg.org](https://ichattiesburg.org) built with Next.js 15, TypeScript, and Tailwind CSS.

## Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Auth**: JWT (httpOnly cookie) + bcryptjs
- **Payments**: Stripe Checkout (one-time & recurring)
- **Database**: PostgreSQL (optional, for persistence)
- **Deployment**: Vercel

## Features

- Home page with hero, prayer times strip, Jumuah info, donation CTA
- Prayer Times page — fetches from [asjad-rehman/masjid-times](https://github.com/asjad-rehman/masjid-times) with fallback
- Events calendar with categories (Jumuah, Eid, Halaqa, Fundraiser, etc.)
- Donate page with Stripe integration (sadaqah, zakat, Oak Grove project, recurring)
- About page with masjid history, programs, and Oak Grove project section
- Contact page with spam-protected form + SMTP email
- Islamic Resources page
- Admin dashboard (auth-protected) for managing announcements, events, prayer times
- Dark mode, mobile-first, WCAG 2.1 AA accessible
- SEO metadata, sitemap.xml, robots.txt

## Quick Start

```bash
git clone https://github.com/asjad-rehman/ichattiesburg
cd ichattiesburg
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long random string for JWT signing |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (see below) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP port (default 587) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `CONTACT_EMAIL` | Email address for contact form submissions |

### Generate Admin Password Hash

```bash
node -e "const b=require('bcryptjs');b.hash('YourSecurePassword',12).then(console.log)"
```

## Database Setup

Run `schema.sql` against your PostgreSQL database:

```bash
psql $DATABASE_URL < schema.sql
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy — Vercel auto-detects Next.js

## Prayer Times Source

Fetched hourly from [`asjad-rehman/masjid-times`](https://github.com/asjad-rehman/masjid-times). Expected format:

**`prayer-times.json`**
```json
{ "fajr": "5:30", "sunrise": "6:52", "dhuhr": "12:30", "asr": "3:45", "maghrib": "6:48", "isha": "8:15" }
```

**`jumuah.json`**
```json
{ "khutbah": "13:00", "salah": "13:30", "speaker": "Imam Name", "topic": "Khutbah topic" }
```

Admins can override times from the Admin Dashboard if needed.

## Admin Dashboard

Visit `/admin` → redirects to `/admin/login`. Manage announcements, events, and prayer time overrides.

## Extending

The architecture supports adding:
- Volunteer sign-up (add `volunteers` table)
- Class schedules (add `classes` table)
- Media gallery (add `media` + S3/Cloudinary)
- Email newsletter (Resend / Mailchimp)
- Stripe webhook handler for donation tracking

## Project Structure

```
src/
  app/
    page.tsx              # Home page
    prayer-times/         # Prayer times
    events/               # Events calendar
    about/                # About + Oak Grove project
    contact/              # Contact form
    resources/            # Islamic resources
    donate/               # Stripe donation
    admin/                # Auth-protected dashboard
    api/                  # API routes (contact, donate, admin)
  components/             # UI components
  lib/                    # Utils, auth, DB, prayer-times fetcher
  types/                  # Shared TypeScript types
schema.sql                # PostgreSQL schema
.env.example              # Environment variables template
```
