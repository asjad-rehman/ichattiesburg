import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin-login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <div className="page-enter" style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
      <AdminLoginForm />
    </div>
  );
}
