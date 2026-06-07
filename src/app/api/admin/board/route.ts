import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ board: memoryStore.board });
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updates } = data;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const index = memoryStore.board.findIndex((b: any) => b.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    memoryStore.board[index] = { ...memoryStore.board[index], ...updates };
    return NextResponse.json({ success: true, member: memoryStore.board[index] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update board member" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newMember = {
      ...data,
      id: randomUUID(),
    };
    memoryStore.board.push(newMember);
    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create board member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    memoryStore.board = memoryStore.board.filter(b => b.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete board member" }, { status: 500 });
  }
}
