import { PublicChrome } from "@/components/public/public-chrome";
import { ServiceDetailView } from "@/components/public/service-detail-view";
import { digitalMarketingPage } from "@/content/services/digital-marketing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing & PPC Ads in Ghana",
  description:
    "Digital marketing and PPC in Ghana. Google Ads, social campaigns, and tracking focused on leads, cost per enquiry, and return on ad spend.",
};

export default function DigitalMarketingServicePage() {
  return (
    <PublicChrome>
      <ServiceDetailView content={digitalMarketingPage} />
    </PublicChrome>
  );
}
