import { NextRequest, NextResponse } from "next/server";
import { getJamaatTimes, saveJamaatTimes } from "@/lib/jamaat";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getJamaatTimes(true);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await saveJamaatTimes(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
