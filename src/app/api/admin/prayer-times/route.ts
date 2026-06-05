import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ overrides: memoryStore.prayerOverrides });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    memoryStore.prayerOverrides = {
      ...memoryStore.prayerOverrides,
      ...data,
    };
    return NextResponse.json({ success: true, overrides: memoryStore.prayerOverrides });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update prayer times" }, { status: 500 });
  }
}
