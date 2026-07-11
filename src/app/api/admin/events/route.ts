import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await store.getEvents(true);
    return NextResponse.json({ events });
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch events${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.title || !data.date) return NextResponse.json({ error: "title and date required" }, { status: 400 });
    const event = await store.addEvent({ featured: false, category: "community", ...data });
    return NextResponse.json({ success: true, event });
  } catch (e) {
    return NextResponse.json({ error: `Failed to add event${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const event = await store.updateEvent(id, updates);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, event });
  } catch (e) {
    return NextResponse.json({ error: `Failed to update event${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await store.deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Failed to delete event${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}
