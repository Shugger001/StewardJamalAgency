import type { LandingPortfolioItem } from "@/components/public/agency-landing";

/**
 * Marketing case studies shown when the websites table is empty.
 * Labeled as sample work until live client domains are published in the dashboard.
 * Prefer external live URLs when you have them; otherwise link related service pages.
 */
export const PORTFOLIO_SHOWCASE: LandingPortfolioItem[] = [
  {
    id: "case-retail-storefront",
    name: "Multi-branch retail catalogue",
    status: "published",
    domain: null,
    clientName: "Sample · Accra retail",
    summary:
      "Mobile-first product browsing with clear category paths, stock-aware listings, and MoMo-ready checkout framing for shoppers who buy on their phones.",
    outcome: "Sample outcome: shorter path from product discovery to enquiry or payment.",
    href: "/services/ecommerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "case-wellness-portal",
    name: "Service booking site",
    status: "published",
    domain: null,
    clientName: "Sample · Wellness studio",
    summary:
      "Package pages, appointment intent forms, and WhatsApp handoff so staff can confirm slots without losing leads in DMs.",
    outcome: "Sample outcome: fewer missed enquiries and a cleaner booking path.",
    href: "/services/web-development",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "case-logistics-dashboard",
    name: "Client status portal",
    status: "published",
    domain: null,
    clientName: "Sample · Logistics ops",
    summary:
      "Secure client-facing shipment updates with an admin ops view, so customers check progress without calling the desk.",
    outcome: "Sample outcome: fewer status calls; clearer trust for B2B clients.",
    href: "/services/web-development",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "case-local-seo-growth",
    name: "Local search foundation",
    status: "published",
    domain: null,
    clientName: "Sample · Accra service brand",
    summary:
      "Service pages structured for city and neighborhood intent, with technical SEO basics, Google Business alignment, and measurable enquiry goals.",
    outcome: "Sample outcome: clearer ranking targets and enquiry tracking from organic search.",
    href: "/services/seo",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
];
