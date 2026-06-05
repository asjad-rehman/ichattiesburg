import type { Metadata } from "next";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the Islamic Center of Hattiesburg with a donation for sadaqah, zakat, or the Oak Grove masjid project.",
};

export default function DonatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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

      {/* Zeffy embed */}
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
        <div
          className="relative"
          style={{ overflow: "hidden", height: "900px" }}
        >
          <iframe
            title="Donation form powered by Zeffy"
            style={{ position: "absolute", border: 0, top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%" }}
            src="https://www.zeffy.com/embed/donation-form/ichattiesburg"
            allow="payment"
          />
        </div>
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
