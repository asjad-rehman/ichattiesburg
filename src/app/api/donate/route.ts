import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General Sadaqah – ICH",
  zakat: "Zakat – ICH",
  "oak-grove-project": "Oak Grove Masjid Project – ICH",
  "quran-programs": "Quran Programs – ICH",
  ramadan: "Ramadan Programs – ICH",
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const { amount, category, recurring } = await req.json();

    if (!amount || amount < 1 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const amountCents = Math.round(amount * 100);
    const label = CATEGORY_LABELS[category] || "Donation – ICH";
    const origin = req.headers.get("origin") || "https://ichattiesburg.org";

    if (recurring) {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: label },
              unit_amount: amountCents,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/donate`,
        metadata: { category, type: "recurring" },
      });
      return NextResponse.json({ url: session.url });
    } else {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: label },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/donate`,
        metadata: { category, type: "one-time" },
      });
      return NextResponse.json({ url: session.url });
    }
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Payment error" }, { status: 500 });
  }
}
