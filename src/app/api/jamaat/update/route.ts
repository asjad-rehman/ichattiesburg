import { getJamaatTimes, saveJamaatTimes, type JamaatTimes } from "@/lib/jamaat";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValid(x: unknown): x is JamaatTimes {
  if (!x || typeof x !== "object") return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.fajr === "string" &&
    typeof v.dhuhr === "string" &&
    typeof v.asr === "string" &&
    typeof v.maghrib === "string" &&
    typeof v.isha === "string" &&
    Array.isArray(v.jummah)
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const candidate = body.data ?? body;

    if (!isValid(candidate)) {
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const existing = await getJamaatTimes();
    const merged = { ...existing, ...candidate, jummah: candidate.jummah || existing.jummah };

    await saveJamaatTimes(merged);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Failed to save" }, { status: 500 });
  }
}
