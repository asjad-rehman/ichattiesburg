import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Donation Successful" };

export default function DonationSuccess() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">JazakAllah Khair!</h1>
      <p className="text-muted-foreground text-lg mb-2">
        Your donation has been received.
      </p>
      <p className="text-muted-foreground mb-8">
        May Allah (SWT) accept your generosity and grant you barakah.
        A receipt has been sent to your email.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
          Return Home
        </Link>
        <Link href="/donate" className="px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-muted">
          Donate Again
        </Link>
      </div>
    </div>
  );
}
