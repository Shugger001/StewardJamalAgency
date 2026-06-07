import { PublicChrome } from "@/components/public/public-chrome";
import { ServiceDetailView } from "@/components/public/service-detail-view";
import { ecommercePage } from "@/content/services/ecommerce";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "e-Commerce Development in Ghana",
  description:
    "E-commerce website development in Ghana. Online stores with MoMo checkout, mobile-first design, and product pages built to sell.",
};

export default function EcommerceServicePage() {
  return (
    <PublicChrome>
      <ServiceDetailView content={ecommercePage} />
    </PublicChrome>
  );
}
