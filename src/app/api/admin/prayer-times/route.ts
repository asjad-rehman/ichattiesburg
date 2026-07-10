import { NextRequest, NextResponse } from "next/server";
import { getJamaatTimes, saveJamaatTimes } from "@/lib/jamaat";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getJamaatTimes(true);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await saveJamaatTimes(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
