import type { ServicePageContent } from "./types";

export const webDevelopmentPage: ServicePageContent = {
  href: "/services/web-development",
  title: "Web Development And Design",
  subtitle: "Custom websites for Ghanaian businesses—built for speed, clarity, and lead generation.",
  heroImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
  heroImageAlt: "Web development workspace",
  introTitle: "Launch a site that represents your brand and supports sales",
  introBody:
    "The Steward Jamal Agency designs and builds websites for teams that need more than a template. We work through discovery, UX, development, and launch—so your site loads quickly, reads clearly on mobile, and gives visitors a straightforward path to contact you or buy.",
  highlightEyebrow: "Web design and development in Accra and across Ghana",
  highlightTitle: "From first wireframe to live launch",
  highlightBody:
    "Whether you need a five-page company site or a multi-section platform with forms, blogs, and integrations, we scope around your goals. Every build includes responsive layout, basic SEO setup, analytics hooks, and handoff documentation your team can use after go-live.",
  whyChoose: [
    { title: "Strategy Before Pixels", body: "We clarify your audience, offers, and conversion paths before design starts—so pages serve a purpose." },
    { title: "Modern, Maintainable Code", body: "Clean front-end architecture that loads fast on mobile networks and is straightforward to extend later." },
    { title: "Local Market Awareness", body: "Messaging, contact flows, and payment options shaped for how Ghanaian customers browse and buy." },
    { title: "Scope That Fits Your Stage", body: "Starter launches for new brands and fuller builds for teams ready to scale content, SEO, and integrations." },
  ],
  results: [
    "A professional site that builds trust on first visit.",
    "Faster load times and mobile layouts that reduce bounce rates.",
    "Lead capture, booking, or checkout flows aligned with how you sell.",
  ],
  offerings: [
    {
      id: "custom-design",
      title: "Custom Website Design and Development",
      intro: "Bespoke sites built around your brand—not generic themes. We handle information architecture, visual design, development, and launch.",
      features: [
        "Responsive layouts tested on common phone and tablet sizes.",
        "Clear page hierarchy so visitors find services and contact options quickly.",
        "Performance-focused assets and caching-friendly structure.",
        "CMS or static setup depending on how often you update content.",
        "Forms, maps, and third-party tools integrated where needed.",
      ],
    },
    {
      id: "corporate",
      title: "Corporate Website Development",
      intro: "Polished company sites for finance, healthcare, education, property, and professional services firms that need credibility and lead capture.",
      features: [
        "Industry-appropriate tone, imagery, and page structure.",
        "Team, service, and case-study sections that support sales conversations.",
        "Trust elements: certifications, partners, testimonials, and FAQs.",
        "Multi-language or multi-office layouts when required.",
        "Admin-friendly updates for news, jobs, or announcements.",
      ],
    },
    {
      id: "ecommerce",
      title: "E-Commerce Web Development",
      intro: "Online stores with product catalogs, MoMo and card checkout, and order flows tuned for Ghanaian shoppers.",
      features: [
        "Category and product templates optimized for search and mobile.",
        "Payment integration: MTN MoMo, cards, and other supported gateways.",
        "Cart, checkout, and order confirmation experiences with clear status.",
        "Inventory, variants, and promotional pricing support.",
        "Analytics to track product views, add-to-cart, and completed orders.",
      ],
    },
    {
      id: "redesign",
      title: "Website Redesign Services",
      intro: "Refresh outdated sites with modern design, improved navigation, and better performance—without losing valuable SEO equity.",
      features: [
        "Audit of current content, rankings, and conversion bottlenecks.",
        "Updated visual system aligned with your current brand.",
        "Redirect planning to preserve existing search visibility.",
        "Improved page speed and accessibility.",
        "Training or documentation for your team post-launch.",
      ],
    },
  ],
  extraSection: {
    id: "seo",
    title: "Search engine optimization (SEO)",
    body: "New sites include metadata, heading structure, sitemap setup, and performance basics. For ongoing ranking work—keyword strategy, content, and local search—we offer dedicated SEO packages.",
    linkHref: "/services/seo",
    linkLabel: "See SEO services →",
  },
  faqs: [
    { q: "What does a typical website project include?", a: "Discovery, design, development, content placement, basic SEO, analytics setup, and launch support. Exact deliverables depend on your package and scope." },
    { q: "How long does a website take to build in Ghana?", a: "Most business sites ship in 4–6 weeks. Larger e-commerce or corporate builds may run 8–12 weeks depending on content readiness and revision rounds." },
    { q: "Do you write the website copy?", a: "We structure pages and can refine draft copy you provide. Full copywriting can be added to scope if you need it." },
    { q: "Can you host and maintain the site after launch?", a: "Yes. We can recommend hosting, handle deployment, and offer maintenance for updates, security, and small content changes." },
    { q: "Why invest in a custom site instead of a template?", a: "Custom work fits your offers, brand, and conversion flow. Templates often need workarounds that slow the site down or confuse visitors." },
  ],
};
