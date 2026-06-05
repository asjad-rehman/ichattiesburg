"use client";

import { useState } from "react";
import { Heart, RefreshCw, Sparkles, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type DonationType = "one-time" | "monthly";

const FORMS: Record<DonationType, string> = {
  monthly:
    "https://www.zeffy.com/embed/donation-form/e4338258-eef5-489e-ae60-75017200e9bc",
  "one-time":
    "https://www.zeffy.com/embed/donation-form/ba0c6cb0-70a2-41db-95c6-9ff75a30b42c",
};

export default function DonatePage() {
  const [type, setType] = useState<DonationType>("one-time");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Donate to ICH</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your generosity supports our masjid, community programs, and the Oak
          Grove masjid project. May Allah (SWT) accept your giving.
        </p>
      </div>

      {/* Type toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
          <button
            onClick={() => setType("one-time")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              type === "one-time"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="h-4 w-4" />
            One-Time
          </button>
          <button
            onClick={() => setType("monthly")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              type === "monthly"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Monthly
          </button>
        </div>
      </div>

      {/* Context copy per type */}
      <p className="text-center text-sm text-muted-foreground mb-6">
        {type === "monthly"
          ? "Set up a recurring monthly contribution — a consistent sadaqah that supports ICH year-round."
          : "Make a single gift of any amount toward any aspect of ICH's work."}
      </p>

      {/* Zeffy iframe */}
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="relative" style={{ overflow: "hidden", height: "900px" }}>
          <iframe
            key={type}
            title={`${type === "monthly" ? "Monthly" : "One-time"} donation form powered by Zeffy`}
            style={{
              position: "absolute",
              border: 0,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
            }}
            src={FORMS[type]}
            allow="payment"
          />
        </div>
      </div>

      {/* Large donation CTA */}
      <div className="mt-8 rounded-2xl border border-secondary/40 bg-secondary/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
          <Mail className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-0.5">Planning a large donation?</div>
          <p className="text-sm text-muted-foreground">
            Large gifts — including zakat, endowments, or construction
            contributions — can be coordinated directly with the ICH Treasury.
          </p>
        </div>
        <Link
          href="/contact?subject=Donation+Inquiry"
          className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Contact Treasury
        </Link>
      </div>

      {/* Tax note */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        The Islamic Center of Hattiesburg is a 501(c)(3) nonprofit organization.
        All donations are tax-deductible to the extent permitted by law.
        Powered by{" "}
        <a
          href="https://www.zeffy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Zeffy
        </a>{" "}
        — 100% of your donation goes to ICH.
      </p>
    </div>
  );
}
