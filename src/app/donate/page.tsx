import type { Metadata } from "next";
import DonateClient from "@/components/donate-client";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support the Islamic Center of Hattiesburg with a donation for sadaqah, zakat, or the Oak Grove masjid project.",
};

export default function DonatePage() {
  return <DonateClient />;
}
