import type { Metadata } from "next";
import { headers } from "next/headers";
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
    images: [{ url: "/hero-landing.png", width: 1200, height: 630, alt: "Steward Jamal Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Steward Jamal Agency | Web Design & Development in Ghana",
    description:
      "Custom websites, SEO, and digital marketing for Ghanaian businesses.",
    images: ["/hero-landing.png"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "The Steward Jamal Agency",
  description:
    "Web design, development, SEO, and digital marketing for businesses in Accra and across Ghana.",
  url:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://steward-jamal-agency-eidc.vercel.app",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "stewardjamalagency@gmail.com",
  telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+233 54 311 1607",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  areaServed: "GH",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading headers opts the tree into dynamic rendering so Next can stamp script nonces.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <head>
        {nonce ? <meta name="csp-nonce" content={nonce} /> : null}
      </head>
      <body className="min-h-full bg-white text-zinc-950">
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
