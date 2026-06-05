export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  endTime?: string;
  location?: string;
  category: "jumuah" | "eid" | "halaqa" | "fundraiser" | "construction" | "community" | "other";
  featured: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: "normal" | "urgent";
  expiresAt?: string;
  createdAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface DonationCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  zeffyFormUrl?: string;
}
