import type { Metadata } from "next";
import { PublicChrome } from "@/components/public/public-chrome";
import { WebDevelopmentServiceView } from "@/components/public/web-development-service-view";

export const metadata: Metadata = {
  title: "Web Development And Design in Accra, Ghana",
  description:
    "Best web development and design services in Ghana. Custom websites, e-commerce, corporate sites, and redesigns that drive traffic, conversions, and growth.",
  openGraph: {
    title: "Web Development And Design | The Steward Jamal Agency",
    description:
      "Custom web development in Accra and Ghana—responsive design, SEO, e-commerce, and conversion-focused builds.",
    type: "website",
  },
};

export default function WebDevelopmentServicePage() {
  return (
    <PublicChrome>
      <WebDevelopmentServiceView />
    </PublicChrome>
  );
}
