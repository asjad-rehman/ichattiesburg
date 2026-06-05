"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { Suspense } from "react";

const CATEGORIES = [
  { id: "general", label: "General Sadaqah", description: "Support ICH's general operations and programs" },
  { id: "zakat", label: "Zakat", description: "Fulfill your obligatory annual charity" },
  { id: "oak-grove-project", label: "Oak Grove Project", description: "Help build our new masjid facility" },
  { id: "quran-programs", label: "Quran Programs", description: "Support Islamic education for youth and adults" },
  { id: "ramadan", label: "Ramadan", description: "Support iftar, tarawih, and Ramadan programs" },
];

const AMOUNTS = [25, 50, 100, 250, 500, 1000];

function DonateForm() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("general");
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.find((c) => c.id === cat)) {
      setCategory(cat);
    }
  }, [searchParams]);

  const finalAmount = amount !== "" ? amount : Number(customAmount);

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) {
      setError("Please enter a valid donation amount.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, category, recurring }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate checkout");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Donate to ICH</h1>
        <p className="text-muted-foreground">
          Your generosity supports our masjid, community programs, and the Oak Grove project.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-8">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-3">Donation Type</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  category === cat.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="font-medium text-sm">{cat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{cat.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold mb-3">Amount (USD)</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustomAmount(""); }}
                className={`py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                  amount === a
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/40"
                }`}
              >
                ${a}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              min="1"
              placeholder="Other amount"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
              className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Recurring */}
        <div className="flex items-center gap-3">
          <button
            role="checkbox"
            aria-checked={recurring}
            onClick={() => setRecurring(!recurring)}
            className={`w-10 h-6 rounded-full transition-colors relative ${
              recurring ? "bg-primary" : "bg-border"
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              recurring ? "translate-x-5" : "translate-x-1"
            }`} />
          </button>
          <span className="text-sm">
            Make this a <strong>monthly</strong> recurring donation
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleDonate}
          disabled={loading || (!finalAmount || finalAmount < 1)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Heart className="h-5 w-5" />
          {loading ? "Redirecting..." : `Donate${finalAmount ? ` $${finalAmount}` : ""}`}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Secure payment powered by Stripe
        </div>
      </div>

      {/* Tax note */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        The Islamic Center of Hattiesburg is a 501(c)(3) nonprofit organization.
        All donations are tax-deductible to the extent permitted by law.
      </p>
    </div>
  );
}

export default function DonateClient() {
  return (
    <Suspense>
      <DonateForm />
    </Suspense>
  );
}
