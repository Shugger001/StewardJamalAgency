import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Website packages and pricing for businesses in Ghana. Starter, Growth, and Premium builds.",
};

export default function PricingPage() {
  return <AgencyLanding mode="home" view="pricing" portfolioItems={[]} />;
}
