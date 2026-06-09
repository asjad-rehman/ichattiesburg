import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ announcements: store.getAnnouncements() });
}

export async function POST(req: NextRequest) {
  try {
    const { title, body, priority = "normal" } = await req.json();
    if (!title || !body) return NextResponse.json({ error: "title and body required" }, { status: 400 });
    const announcement = store.addAnnouncement({ title, body, priority });
    return NextResponse.json({ success: true, announcement });
  } catch {
    return NextResponse.json({ error: "Failed to add announcement" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const announcement = store.updateAnnouncement(id, updates);
    if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, announcement });
  } catch {
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    store.deleteAnnouncement(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
