import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import PostDesignerClient from "@/components/post-designer-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Post Designer" };

export default async function PostDesignerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect("/admin/login");
  }

  return <PostDesignerClient />;
}
