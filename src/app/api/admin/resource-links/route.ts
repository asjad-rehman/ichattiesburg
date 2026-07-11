import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const links = await store.getResourceLinks(true);
    return NextResponse.json({ links });
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch resource links${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { category, categoryIcon = "🔗", label, url, order = 99 } = await req.json();
    if (!category || !label || !url) {
      return NextResponse.json({ error: "category, label, and url required" }, { status: 400 });
    }
    const item = await store.addResourceLink({ category, categoryIcon, label, url, order });
    return NextResponse.json({ success: true, item });
  } catch (e) {
    return NextResponse.json({ error: `Failed to add resource link${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const item = await store.updateResourceLink(id, updates);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, item });
  } catch (e) {
    return NextResponse.json({ error: `Failed to update resource link${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await store.deleteResourceLink(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Failed to delete resource link${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}
