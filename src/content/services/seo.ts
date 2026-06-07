import type { ServicePageContent } from "./types";

export const seoPage: ServicePageContent = {
  href: "/services/seo",
  title: "Search Engine Optimization (SEO Services In Ghana)",
  subtitle: "Improve rankings, attract qualified traffic, and grow organically in Ghana's search landscape.",
  heroImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?auto=format&fit=crop&w=1600&q=80",
  heroImageAlt: "SEO analytics and search rankings",
  introTitle: "Show up when your customers search on Google",
  introBody:
    "SEO is how people discover you without paying for every click. We audit your site, fix technical blockers, improve page content, and strengthen local signals so your business appears for searches that lead to real enquiries.",
  highlightEyebrow: "Organic search for Accra, Kumasi, and nationwide brands",
  highlightTitle: "Sustainable visibility—not quick tricks",
  highlightBody:
    "Rankings shift, but a solid foundation lasts: fast pages, clear structure, relevant content, and trustworthy local listings. We build that foundation and help you improve month over month with reporting you can actually read.",
  whyChoose: [
    { title: "Technical Health First", body: "Crawl errors, speed issues, and mobile problems fixed before chasing keywords." },
    { title: "Local Search Focus", body: "Google Business Profile, location pages, and citations for Ghana-based service areas." },
    { title: "Content Aligned to Intent", body: "Pages mapped to what prospects actually type—not generic filler text." },
    { title: "Honest Reporting", body: "Traffic, rankings, and conversion trends explained in plain language." },
  ],
  results: [
    "Stronger presence for service and product keywords that matter to your business.",
    "More organic visits from people already looking for what you offer.",
    "Better local map and directory visibility in your target cities.",
  ],
  offerings: [
    { id: "audit", title: "SEO Audit & Strategy", intro: "A full review of your site's search health with a prioritized plan for fixes and growth.", features: ["Technical and on-page audit.", "Keyword and competitor review.", "Content and internal linking gaps.", "Local listing assessment.", "Roadmap for the next 90 days."] },
    { id: "on-page", title: "On-Page SEO Optimization", intro: "Titles, descriptions, headings, and body copy tuned for target queries without keyword stuffing.", features: ["Page-level metadata updates.", "Header structure and internal links.", "Image alt text and schema where relevant.", "Landing page optimization for campaigns.", "Content briefs for new pages."] },
    { id: "local", title: "Local SEO in Ghana", intro: "Help nearby customers find you when they search for services in Accra, Kumasi, or your region.", features: ["Google Business Profile setup and optimization.", "Consistent name, address, and phone across directories.", "Location and service-area pages.", "Review strategy guidance.", "Map pack improvement tactics."] },
    { id: "technical", title: "Technical SEO", intro: "Resolve backend issues that stop search engines from indexing and ranking your pages fairly.", features: ["Core Web Vitals and speed improvements.", "Sitemap, robots, and indexation fixes.", "Canonical and duplicate content handling.", "HTTPS and security checks.", "JavaScript rendering considerations for modern sites."] },
  ],
  extraSection: {
    title: "SEO included on new website builds",
    body: "Launching a new site? We bake in metadata, structure, sitemap, and performance basics so you start from a stronger position than a rushed template install.",
    linkHref: "/services/web-development",
    linkLabel: "View web development →",
  },
  faqs: [
    { q: "When will I see SEO results?", a: "Some technical fixes show impact within weeks. Meaningful ranking movement usually takes 3–6 months depending on competition and content volume." },
    { q: "Can you optimize a site someone else built?", a: "Yes. We regularly audit and improve existing WordPress, custom, and e-commerce sites." },
    { q: "Is SEO part of every new website?", a: "Foundational SEO is included. Ongoing content, link building, and campaign-level SEO are separate retainers." },
    { q: "Do you work with businesses outside Accra?", a: "Yes. We support clients across Ghana and can target multiple cities or regions." },
    { q: "How is SEO different from Google Ads?", a: "SEO earns organic placements over time. Ads buy immediate visibility. Many clients use both for short-term leads and long-term discovery." },
  ],
};
