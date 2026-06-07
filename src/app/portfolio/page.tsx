import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";
import { loadPortfolioItems } from "@/lib/load-portfolio-items";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Websites, e-commerce stores, and custom platforms built by The Steward Jamal Agency.",
};

export default async function PortfolioPage() {
  const portfolioItems = await loadPortfolioItems();
  return <AgencyLanding mode="home" view="portfolio" portfolioItems={portfolioItems} />;
}
