import type { Metadata } from "next";
import { Inter, Amiri, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ichattiesburg.org"),
  title: {
    default: "Islamic Center of Hattiesburg",
    template: "%s | Islamic Center of Hattiesburg",
  },
  description:
    "The Islamic Center of Hattiesburg (ICH) serves the Muslim community of Hattiesburg, Mississippi with prayer services, Islamic education, and community programs.",
  keywords: [
    "Islamic Center Hattiesburg",
    "ICH",
    "masjid",
    "mosque",
    "Muslim",
    "Mississippi",
    "prayer times",
    "Jumuah",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ichattiesburg.org",
    siteName: "Islamic Center of Hattiesburg",
    title: "Islamic Center of Hattiesburg",
    description: "Serving the Muslim community of Hattiesburg, Mississippi.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Islamic Center of Hattiesburg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Center of Hattiesburg",
    description: "Serving the Muslim community of Hattiesburg, Mississippi.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${amiri.variable} ${cormorant.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
