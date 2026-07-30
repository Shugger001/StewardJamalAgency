import type { LandingPortfolioItem } from "@/components/public/agency-landing";

/**
 * Marketing case studies shown when the websites table is empty.
 * Use external hrefs — never link to fake /sites/{uuid} routes.
 */
export const PORTFOLIO_SHOWCASE: LandingPortfolioItem[] = [
  {
    id: "case-retail-storefront",
    name: "Accra Retail Storefront",
    status: "published",
    domain: null,
    clientName: "Accra Retail Group",
    summary: "Mobile-first catalogue and checkout for a multi-branch retailer.",
    outcome: "Faster product discovery and clearer MoMo checkout flow.",
    href: "/services/ecommerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "case-wellness-portal",
    name: "Wellness Booking Portal",
    status: "published",
    domain: null,
    clientName: "Kumasi Wellness Co.",
    summary: "Appointment booking site with service packages and WhatsApp follow-up.",
    outcome: "Fewer missed enquiries and a cleaner booking path.",
    href: "/services/web-development",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "case-logistics-dashboard",
    name: "Logistics Client Dashboard",
    status: "published",
    domain: null,
    clientName: "Coastal Logistics GH",
    summary: "Client-facing status pages and admin ops view for shipment updates.",
    outcome: "Clients check progress without calling the ops desk.",
    href: "/services/web-development",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
];
