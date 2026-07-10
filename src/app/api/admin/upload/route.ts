import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { remoteWriteFile } from "@/lib/remote-storage";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = getAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString("base64");

    const originalName = file.name || "upload.jpg";
    const extension = originalName.includes(".") 
      ? originalName.substring(originalName.lastIndexOf(".")) 
      : ".jpg";
    const filename = `${randomUUID()}${extension}`;

    // Write file locally and to GitHub remote storage (public/uploads/)
    await remoteWriteFile(filename, base64Content);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: "File upload failed: " + err.message }, { status: 500 });
  }
}
