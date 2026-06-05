import { NextResponse } from "next/server";

// In production, fetch from DB. Return sample data for MVP.
export async function GET() {
  const announcements = [
    {
      id: "1",
      title: "Jumuah This Friday",
      body: "Khutbah at 1:00 PM, Salah at 1:30 PM. All are welcome.",
      priority: "normal",
      createdAt: new Date().toISOString(),
    },
  ];
  return NextResponse.json({ announcements });
}
