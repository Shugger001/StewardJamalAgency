import { PublicChrome } from "@/components/public/public-chrome";
import { ServiceDetailView } from "@/components/public/service-detail-view";
import { seoPage } from "@/content/services/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Services in Accra, Ghana",
  description:
    "Search engine optimization services in Ghana. Technical SEO, local SEO, and content strategy to rank higher and drive organic traffic.",
};

export default function SeoServicePage() {
  return (
    <PublicChrome>
      <ServiceDetailView content={seoPage} />
    </PublicChrome>
  );
}
