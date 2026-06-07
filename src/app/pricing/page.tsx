import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";
import { loadPortfolioItems } from "@/lib/load-portfolio-items";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Website packages and pricing for businesses in Ghana—Starter, Growth, and Premium builds.",
};

export default async function PricingPage() {
  const portfolioItems = await loadPortfolioItems();
  return <AgencyLanding mode="home" view="pricing" portfolioItems={portfolioItems} />;
}
