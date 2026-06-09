import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer Times Display | Islamic Center of Hattiesburg",
};

export default function DisplayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
