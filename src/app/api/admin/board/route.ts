import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const board = await store.getBoard(true);
    return NextResponse.json({ board });
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch board${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, role } = await req.json();
    if (!name || !role) return NextResponse.json({ error: "name and role required" }, { status: 400 });
    const member = await store.addBoardMember({ name, role });
    return NextResponse.json({ success: true, member });
  } catch (e) {
    return NextResponse.json({ error: `Failed to add board member${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const member = await store.updateBoardMember(id, updates);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, member });
  } catch (e) {
    return NextResponse.json({ error: `Failed to update board member${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await store.deleteBoardMember(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Failed to delete board member${e instanceof Error && e.message ? ": " + e.message : ""}` }, { status: 500 });
  }
}
