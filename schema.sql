-- Islamic Center of Hattiesburg — Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  end_time TIME,
  location TEXT,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('jumuah','eid','halaqa','fundraiser','construction','community','other')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Prayer times overrides (fallback if GitHub fetch fails)
CREATE TABLE prayer_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  effective_date DATE NOT NULL,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  jumuah_khutbah TIME,
  jumuah_salah TIME,
  jumuah_speaker TEXT,
  jumuah_topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (effective_date)
);

-- Donations log (from Zeffy webhook or manual entry)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zeffy_reference TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  category TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  donor_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_announcements_expires ON announcements(expires_at);
CREATE INDEX idx_donations_created ON donations(created_at);
