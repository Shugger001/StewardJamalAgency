import { PublicChrome } from "@/components/public/public-chrome";
import { ServiceDetailView } from "@/components/public/service-detail-view";
import { seoPage } from "@/content/services/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Services in Accra, Ghana",
  description:
    "SEO services in Ghana. Technical audits, on-page optimization, and local search strategy to improve rankings and organic enquiries.",
};

export default function SeoServicePage() {
  return (
    <PublicChrome>
      <ServiceDetailView content={seoPage} />
    </PublicChrome>
  );
}
