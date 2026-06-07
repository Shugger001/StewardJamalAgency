import type { ServicePageContent } from "./types";

export const digitalMarketingPage: ServicePageContent = {
  href: "/services/digital-marketing",
  title: "Digital Marketing & PPC Ads",
  subtitle: "Paid campaigns and growth strategy for Ghanaian businesses—measured against leads and revenue.",
  heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  heroImageAlt: "Digital marketing analytics dashboard",
  introTitle: "Spend ad budget where it produces enquiries—not just clicks",
  introBody:
    "We plan and manage search and social campaigns for teams in Ghana that need predictable lead flow. Every setup includes tracking, landing page alignment, and reporting on cost per lead, booked calls, and return on ad spend.",
  highlightEyebrow: "Performance marketing for Accra and nationwide brands",
  highlightTitle: "Campaigns connected to your sales funnel",
  highlightBody:
    "Ads work best when the destination page matches the promise. We coordinate targeting, creative, landing pages, and follow-up capture so budget moves people from impression to conversation—not into a dead end.",
  whyChoose: [
    { title: "KPIs You Can Explain", body: "Reports focused on leads, sales, and acquisition cost—not vanity metrics alone." },
    { title: "Ghana-Aware Targeting", body: "Geo, language, and offer framing tuned for local buying behaviour." },
    { title: "Cross-Channel Planning", body: "Search, social, retargeting, and email nurture mapped to your funnel stages." },
    { title: "Tight Site Integration", body: "Tracking, forms, and landing pages built to support campaign performance." },
  ],
  results: [
    "Steadier inbound enquiries from high-intent search and social audiences.",
    "Lower acquisition cost through ongoing testing and budget allocation.",
    "Clear picture of which channels and ads produce qualified leads.",
  ],
  offerings: [
    { id: "ppc", title: "Google Ads & PPC Management", intro: "Search and display campaigns for people actively looking for your services.", features: ["Keyword and audience research.", "Ad copy aligned with landing pages.", "Conversion and event tracking.", "Bid and budget adjustments.", "Monthly performance summaries."] },
    { id: "social", title: "Social Media Marketing", intro: "Organic and paid presence on Instagram, Facebook, LinkedIn, and X.", features: ["Content themes and posting cadence.", "Paid social setup and optimization.", "Community response guidelines.", "Creator or partner coordination when needed.", "Platform analytics reviews."] },
    { id: "email", title: "Email & Nurture Campaigns", intro: "Automated sequences that follow up with leads who are not ready to buy today.", features: ["Welcome and onboarding flows.", "Promotional sends and seasonal offers.", "List segmentation basics.", "Template design on brand.", "Deliverability and list hygiene checks."] },
    { id: "analytics", title: "Analytics & Conversion Tracking", intro: "Reliable data across ads, website, and forms so decisions are based on facts.", features: ["Google Analytics 4 configuration.", "Conversion and event mapping.", "UTM standards for campaigns.", "Simple dashboards for stakeholders.", "Recommendations each reporting cycle."] },
  ],
  extraSection: {
    title: "Pair ads with a high-performing website",
    body: "Traffic is wasted on slow or confusing pages. We build and optimize landing experiences that match your campaigns and capture leads properly.",
    linkHref: "/services/web-development",
    linkLabel: "View web development →",
  },
  faqs: [
    { q: "What budget should we start with?", a: "It depends on industry and lead value. We will propose ad spend and management fees after a short discovery call." },
    { q: "Do you run Google and Meta ads?", a: "Yes—search, display, and social campaigns with transparent spend reporting." },
    { q: "How fast can PPC generate leads?", a: "Leads can arrive within days of launch. Optimization continues over the first 4–8 weeks." },
    { q: "Can you build landing pages for ads?", a: "Yes. We design and develop pages integrated with your tracking and CRM or form tools." },
    { q: "Do you create ad creative?", a: "We provide direction, copy, and basic assets. Full photo or video production can be scoped separately." },
  ],
};
