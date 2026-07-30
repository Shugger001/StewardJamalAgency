import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";
import { loadPortfolioItems } from "@/lib/load-portfolio-items";

export const metadata: Metadata = {
  title: "Web Design & Development in Ghana",
  description:
    "The Steward Jamal Agency builds fast, conversion-focused websites, e-commerce, SEO, and digital marketing for businesses in Accra and across Ghana.",
  openGraph: {
    title: "The Steward Jamal Agency | Web Design & Development in Ghana",
    description:
      "Custom websites, SEO, and digital marketing for Ghanaian businesses. Launch a site that looks credible and generates enquiries.",
    images: [{ url: "/hero-landing.png", width: 1200, height: 630, alt: "Steward Jamal Agency" }],
  },
};

export default async function Home() {
  const portfolioItems = await loadPortfolioItems();

  return <AgencyLanding mode="home" view="home" portfolioItems={portfolioItems} />;
}
