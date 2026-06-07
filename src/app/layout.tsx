import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
      "https://steward-jamal-agency-eidc.vercel.app",
  ),
  title: {
    default: "The Steward Jamal Agency | Web Design & Development in Ghana",
    template: "%s · Steward Jamal Agency",
  },
  description:
    "Web design, development, SEO, and digital marketing for businesses in Accra and across Ghana. Custom sites built to load fast, rank well, and convert visitors into customers.",
  openGraph: {
    title: "The Steward Jamal Agency | Web Design & Development in Ghana",
    description:
      "Custom websites, SEO, and digital marketing for Ghanaian businesses. Launch a site that looks credible and generates enquiries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-950">{children}</body>
    </html>
  );
}
