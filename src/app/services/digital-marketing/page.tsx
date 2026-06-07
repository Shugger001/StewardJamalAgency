import { PublicChrome } from "@/components/public/public-chrome";
import { ServiceDetailView } from "@/components/public/service-detail-view";
import { digitalMarketingPage } from "@/content/services/digital-marketing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing & PPC Ads in Ghana",
  description:
    "Digital marketing and PPC services in Accra and Ghana. Google Ads, social media, and campaigns that drive leads and measurable ROI.",
};

export default function DigitalMarketingServicePage() {
  return (
    <PublicChrome>
      <ServiceDetailView content={digitalMarketingPage} />
    </PublicChrome>
  );
}
