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
    title: "What Ghanaian Online Stores Need in 2026",
    category: "E-Commerce",
    date: "05 Jan",
    dateIso: "2026-01-05",
    excerpt:
      "The features that matter most when you sell online in Ghana—from MoMo checkout to mobile product pages.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Shoppers in Ghana compare prices on their phones, expect MoMo at checkout, and abandon carts when delivery details are unclear. Your store has to answer those questions early.",
      "Start with fast category pages, working search, variant selectors, and trust cues—reviews, refund policy, and secure payment badges. Product URLs should be readable and indexable.",
      "Compress images, lazy-load galleries, and monitor Core Web Vitals. Pair analytics with conversion events so you know which products and traffic sources actually sell.",
      "We build stores around these realities—from catalog architecture through payment integration and launch QA.",
    ],
  },
  {
    slug: "affordable-web-design-services-ghana",
    title: "Getting Quality Web Design in Ghana Without Overpaying",
    category: "Web Development",
    date: "12 Dec",
    dateIso: "2025-12-12",
    excerpt:
      "How to evaluate agency quotes, scope, and deliverables when budget matters but quality still counts.",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    body: [
      "Low cost only helps if the site still loads quickly, works on mobile, and gives visitors a clear next step. Value comes from defined scope—not skipped essentials.",
      "Before signing, confirm revision rounds, hosting, SSL, analytics, and what happens after launch. Milestone billing protects both you and the agency.",
      "A starter site may cover brand credibility and contact capture. A growth package adds deeper content, lead workflows, and conversion tuning when inbound demand matters.",
      "We publish starting prices openly and adjust scope to your industry, audience, and revenue model.",
    ],
  },
  {
    slug: "premium-web-design-accra-business-potential",
    title: "Why Accra Service Brands Invest in Better Web Design",
    category: "Digital Strategy",
    date: "28 Nov",
    dateIso: "2025-11-28",
    excerpt:
      "How strong design, search visibility, and paid campaigns work together for businesses in Accra.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    body: [
      "In a crowded market, your website is often the first impression—before a phone call, WhatsApp message, or office visit.",
      "Effective design combines clear offers with proof: testimonials, case snapshots, credentials, and straightforward contact paths. SEO helps the right searches surface that story.",
      "Paid campaigns amplify pages that already convert—retargeting warm visitors, capturing emails, and targeting neighborhoods you serve.",
      "We help Accra and nationwide clients align design, development, and growth work under one roadmap with measurable checkpoints.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
