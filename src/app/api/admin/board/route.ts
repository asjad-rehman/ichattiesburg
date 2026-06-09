import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const board = await store.getBoard();
    return NextResponse.json({ board });
  } catch {
    return NextResponse.json({ error: "Failed to fetch board" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, role } = await req.json();
    if (!name || !role) return NextResponse.json({ error: "name and role required" }, { status: 400 });
    const member = await store.addBoardMember({ name, role });
    return NextResponse.json({ success: true, member });
  } catch {
    return NextResponse.json({ error: "Failed to add board member" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const member = await store.updateBoardMember(id, updates);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, member });
  } catch {
    return NextResponse.json({ error: "Failed to update board member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await store.deleteBoardMember(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete board member" }, { status: 500 });
  }
}
