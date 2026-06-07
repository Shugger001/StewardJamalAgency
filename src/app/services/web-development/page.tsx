import type { Metadata } from "next";
import { PublicChrome } from "@/components/public/public-chrome";
import { ServiceDetailView } from "@/components/public/service-detail-view";
import { webDevelopmentPage } from "@/content/services/web-development";

export const metadata: Metadata = {
  title: "Web Development And Design in Accra, Ghana",
  description:
    "Custom website design and development in Ghana. Company sites, e-commerce, corporate builds, and redesigns focused on speed, clarity, and lead generation.",
  openGraph: {
    title: "Web Development And Design | The Steward Jamal Agency",
    description:
      "Web design and development in Accra and across Ghana—responsive builds, SEO basics, e-commerce, and conversion-focused pages.",
    type: "website",
  },
};

export default function WebDevelopmentServicePage() {
  return (
    <PublicChrome>
      <ServiceDetailView content={webDevelopmentPage} />
    </PublicChrome>
  );
}
