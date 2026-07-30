import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";
import { loadPortfolioItems } from "@/lib/load-portfolio-items";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a quote or start a project with The Steward Jamal Agency—no account required. We reply within one business day.",
};

export default async function ContactPage() {
  const portfolioItems = await loadPortfolioItems();
  return <AgencyLanding mode="home" view="contact" portfolioItems={portfolioItems} />;
}
