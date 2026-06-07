export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  dateIso: string;
  excerpt: string;
  image: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ecommerce-website-features-ghana-2026",
    title: "10 Must-Have Features for a Successful E-commerce Website in Ghana 2026",
    category: "Web Development and Design",
    date: "05 Jan",
    dateIso: "2026-01-05",
    excerpt:
      "Discover the essential features that make an e-commerce website thrive in Ghana's growing digital marketplace.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Ghana's e-commerce sector is expanding rapidly. Customers expect fast mobile checkout, MoMo payment options, and clear delivery timelines before they complete a purchase.",
      "A successful store needs product search, category filters, trust signals (reviews, secure checkout badges), and SEO-friendly product URLs. Local payment rails—MTN MoMo, Telecel Cash, and card—should be visible early in the funnel.",
      "Performance matters: compress images, lazy-load galleries, and keep Core Web Vitals green. Analytics and conversion tracking help you iterate on what actually drives sales.",
      "The Steward Jamal Agency builds e-commerce experiences tuned for Ghanaian buyers—from catalog structure to launch-ready payment integration.",
    ],
  },
  {
    slug: "affordable-web-design-services-ghana",
    title: "Affordable Web Design Services in Ghana: Your Guide to Quality and Value",
    category: "Web Development",
    date: "12 Dec",
    dateIso: "2025-12-12",
    excerpt:
      "How to get premium web design without overspending—and what to look for in a Ghana-based agency partner.",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Affordable does not mean cheap. The best value comes from clear scope, reusable design systems, and SEO baked in from day one—not from cutting corners on mobile responsiveness or page speed.",
      "Ask agencies about revision rounds, hosting, SSL, analytics setup, and post-launch support. Transparent milestone billing (deposit + build phases) protects both sides.",
      "Starter sites suit lean brands that need credibility fast. Growth packages add content strategy, lead capture, and conversion optimization for teams ready to scale inbound demand.",
      "We publish package pricing on our site and tailor every build to your industry, audience, and revenue goals.",
    ],
  },
  {
    slug: "premium-web-design-accra-business-potential",
    title: "Unlocking Your Business Potential with Premium Web Design in Accra",
    category: "Digital Marketing",
    date: "28 Nov",
    dateIso: "2025-11-28",
    excerpt:
      "Why Accra businesses invest in premium digital experiences—and how design, SEO, and marketing work together.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Accra's competitive service economy rewards brands that look established online. Your website is often the first sales conversation—before a call, DM, or walk-in.",
      "Premium design pairs strong visual hierarchy with proof: case studies, testimonials, certifications, and clear offers. SEO ensures the right people find that story when they search.",
      "Digital marketing amplifies what the site converts: retargeting, email capture, and localized campaigns for neighborhoods and regions you serve.",
      "We help Accra and nationwide brands unify design, development, and growth into one measurable roadmap.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
