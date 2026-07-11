import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const impact = await store.getImpact(true);
    return NextResponse.json({ impact });
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch impact${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, count, image } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "title and description required" }, { status: 400 });
    }
    const item = await store.addImpactItem({ title, description, count, image });
    return NextResponse.json({ success: true, item });
  } catch (e) {
    return NextResponse.json({ error: `Failed to add impact item${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const item = await store.updateImpactItem(id, updates);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, item });
  } catch (e) {
    return NextResponse.json({ error: `Failed to update impact item${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await store.deleteImpactItem(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Failed to delete impact item${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}
