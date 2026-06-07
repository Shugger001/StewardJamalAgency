import type { ServicePageContent } from "./types";

export const digitalMarketingPage: ServicePageContent = {
  href: "/services/digital-marketing",
  title: "Digital Marketing & PPC Ads",
  subtitle: "Digital marketing services in Ghana — campaigns that drive leads, sales, and measurable ROI.",
  heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  heroImageAlt: "Digital marketing analytics dashboard",
  introTitle: "Marketing that delivers tangible results — not just impressions",
  introBody:
    "Marketing isn't just about being seen—it's about delivering results. Our digital marketing solutions for businesses in Ghana create tangible outcomes: more leads, more sales, and stronger customer engagement across Accra, Kumasi, and nationwide.",
  highlightEyebrow: "Digital marketing services in Ghana that drive real results",
  highlightTitle: "Grow your brand with data-driven campaigns",
  highlightBody:
    "We plan, launch, and optimize campaigns across search, social, and display—aligned with your funnel from awareness to conversion. Every campaign ties back to metrics that matter: cost per lead, ROAS, and revenue growth.",
  whyChoose: [
    { title: "Performance-Focused Campaigns", body: "We optimize for leads and sales—not vanity metrics. Every campaign has clear KPIs and reporting." },
    { title: "Ghana Market Expertise", body: "Messaging, targeting, and ad formats tuned for how Ghanaian audiences discover and buy online." },
    { title: "Full-Funnel Strategy", body: "From brand awareness to retargeting and email nurture—we connect the dots across channels." },
    { title: "Integrated With Your Website", body: "Landing pages, tracking, and conversion paths built to support campaign performance." },
  ],
  results: [
    "More qualified leads through targeted PPC and social ad campaigns.",
    "Lower cost per acquisition with ongoing optimization and A/B testing.",
    "Stronger brand recall and engagement across digital channels.",
  ],
  offerings: [
    { id: "ppc", title: "Google Ads & PPC Management", intro: "Search and display campaigns that capture high-intent customers actively looking for your services.", features: ["Keyword and audience targeting.", "Ad copy and landing page alignment.", "Conversion tracking setup.", "Bid strategy and budget optimization.", "Monthly performance reporting."] },
    { id: "social", title: "Social Media Marketing", intro: "Build audience, engagement, and leads on Instagram, Facebook, LinkedIn, and X.", features: ["Content calendar and creative direction.", "Paid social campaign management.", "Community engagement strategy.", "Influencer collaboration support.", "Platform-specific analytics."] },
    { id: "email", title: "Email & Nurture Campaigns", intro: "Turn subscribers and leads into customers with automated email sequences.", features: ["Welcome and onboarding flows.", "Promotional campaign design.", "Segmentation and personalization.", "Newsletter setup and templates.", "Deliverability best practices."] },
    { id: "analytics", title: "Analytics & Conversion Tracking", intro: "Know exactly what's working with proper tracking across ads, site, and CRM.", features: ["Google Analytics 4 setup.", "Conversion and event tracking.", "UTM and attribution hygiene.", "Dashboard and monthly insights.", "Recommendations for improvement."] },
  ],
  extraSection: {
    title: "Pair marketing with a high-converting website",
    body: "Campaigns perform best when they land on fast, trust-building pages. Our web team builds landing pages and full sites optimized for the traffic we drive.",
    linkHref: "/services/web-development",
    linkLabel: "View web development services →",
  },
  faqs: [
    { q: "What's a typical digital marketing budget in Ghana?", a: "Budgets vary by industry and goals. We recommend starting with a clear monthly ad spend plus management fee—we'll propose a plan based on your targets." },
    { q: "Do you manage Google Ads and Meta ads?", a: "Yes. We manage search, display, and social campaigns with transparent reporting on spend and results." },
    { q: "How soon will I see results from PPC?", a: "PPC can generate leads within days of launch. Optimization continues over the first 4–8 weeks as we refine targeting and creative." },
    { q: "Can you create landing pages for campaigns?", a: "Yes. We design and build campaign landing pages integrated with your site and tracking stack." },
    { q: "Do you offer social media content creation?", a: "We provide creative direction, ad assets, and content calendars. Full production can be scoped based on your needs." },
  ],
};
