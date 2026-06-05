import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ announcements: memoryStore.announcements });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newAnnouncement = {
      ...data,
      id: randomUUID(),
      created_at: new Date().toISOString(),
    };
    // Add to top of list
    memoryStore.announcements.unshift(newAnnouncement);
    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    memoryStore.announcements = memoryStore.announcements.filter(a => a.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
