import type { Metadata } from "next";
import { AgencyLanding } from "@/components/public/agency-landing";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a quote or start a project with The Steward Jamal Agency—no account required. We reply within one business day.",
};

export default function ContactPage() {
  return <AgencyLanding mode="home" view="contact" portfolioItems={[]} />;
}
