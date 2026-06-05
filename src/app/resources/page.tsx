import React from "react";
import { Metadata } from "next";
import ResourcesClient from "@/components/resources-client";

export const metadata: Metadata = {
  title: "Islamic Resources",
  description: "Access curated online resources for learning Quran, Hadith, Islamic media, and Zakat calculators.",
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
