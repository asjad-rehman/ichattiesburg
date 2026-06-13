import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { remoteWriteFile } from "@/lib/remote-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resources = await store.getHalalResources(true);
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as "restaurants" | "meatSupply";
    const file = formData.get("file") as File | null;

    if (!type || !["restaurants", "meatSupply"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentB64 = buffer.toString("base64");

    const extension = file.name.split('.').pop() || "pdf";
    const filename = `halal-${type}-${Date.now()}.${extension}`;

    // Upload to public/uploads
    await remoteWriteFile(filename, contentB64);

    // Update store
    const url = `https://raw.githubusercontent.com/asjad-rehman/ichattiesburg/main/public/uploads/${filename}?v=${Date.now()}`;
    const updatePayload = {
      [type]: {
        filename: file.name,
        url
      }
    };

    const updated = await store.updateHalalResources(updatePayload);

    return NextResponse.json({ success: true, resources: updated });
  } catch (err: any) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: "Upload failed: " + err.message }, { status: 500 });
  }
}
