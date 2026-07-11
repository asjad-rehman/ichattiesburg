import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const announcements = await store.getAnnouncements(true);
    return NextResponse.json({ announcements });
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch announcements${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, body, priority = "normal" } = await req.json();
    if (!title || !body) return NextResponse.json({ error: "title and body required" }, { status: 400 });
    const announcement = await store.addAnnouncement({ title, body, priority });
    return NextResponse.json({ success: true, announcement });
  } catch (e) {
    return NextResponse.json({ error: `Failed to add announcement${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const announcement = await store.updateAnnouncement(id, updates);
    if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, announcement });
  } catch (e) {
    return NextResponse.json({ error: `Failed to update announcement${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await store.deleteAnnouncement(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Failed to delete announcement${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}
