import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ events: memoryStore.events });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newEvent = {
      ...data,
      id: randomUUID(),
    };
    memoryStore.events.push(newEvent);
    // Sort events by date
    memoryStore.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    memoryStore.events = memoryStore.events.filter(e => e.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
