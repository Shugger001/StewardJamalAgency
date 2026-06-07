import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";
import { loadPortfolioItems } from "@/lib/load-portfolio-items";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet The Steward Jamal Agency—web design, development, and digital growth for businesses across Ghana.",
};

export default async function AboutPage() {
  const portfolioItems = await loadPortfolioItems();
  return <AgencyLanding mode="home" view="about" portfolioItems={portfolioItems} />;
}
