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
      "Shoppers in Ghana compare prices on their phones, expect MoMo at checkout, and abandon carts when delivery details are unclear. Your store has to answer those questions early—on the product page, not only in a FAQ buried in the footer.",
      "Start with fast category pages, working search, variant selectors, and trust cues: reviews, refund policy, delivery zones, and secure payment badges. Product URLs should be readable and indexable so paid and organic traffic land on pages that convert.",
      "Compress images, lazy-load galleries, and monitor Core Web Vitals. Pair analytics with conversion events (add-to-cart, checkout start, purchase) so you know which products and traffic sources actually sell—not just which pages get views.",
      "We build stores around these realities—from catalog architecture through payment integration and launch QA—so you launch with a storefront that matches how Ghanaian buyers already shop.",
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
      "Low cost only helps if the site still loads quickly, works on mobile, and gives visitors a clear next step. Value comes from defined scope—not skipped essentials like SSL, analytics, or a working contact path.",
      "Before signing, confirm revision rounds, hosting, content ownership, and what happens after launch. Milestone billing protects both you and the agency when priorities shift mid-project.",
      "A starter site may cover brand credibility and contact capture. A growth package adds deeper content, lead workflows, and conversion tuning when inbound demand matters enough to measure.",
      "We publish starting prices openly and adjust scope to your industry, audience, and revenue model—so you know what you are buying before work starts.",
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
      "In a crowded market, your website is often the first impression—before a phone call, WhatsApp message, or office visit. If the page is slow or vague, people move on to a competitor who looks ready.",
      "Effective design combines clear offers with proof: testimonials, case snapshots, credentials, and straightforward contact paths. SEO helps the right searches surface that story when buyers are already looking.",
      "Paid campaigns amplify pages that already convert—retargeting warm visitors, capturing emails, and targeting neighborhoods you serve. Ads cannot fix a weak landing page; they only scale what works.",
      "We help Accra and nationwide clients align design, development, and growth work under one roadmap with measurable checkpoints—so spend and design decisions point at the same outcomes.",
    ],
  },
  {
    slug: "get-a-quote-without-signing-up",
    title: "How to Request a Website Quote Without Creating an Account",
    category: "Getting Started",
    date: "22 Jul",
    dateIso: "2026-07-22",
    excerpt:
      "What to include in a project request so we can reply with clear scope and pricing—no signup required.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    body: [
      "You do not need a portal account to start. Use the contact form: describe the business, the goal (enquiries, sales, bookings), and any examples of sites you like. That is enough for a first reply.",
      "Helpful extras: preferred timeline, approximate budget band, whether you need MoMo or card payments, and who will provide copy or photos. Missing details slow quotes; clear goals speed them up.",
      "We reply within one business day with clarifying questions or a package recommendation. If we move ahead, deposits and milestones are agreed in writing—not through a surprise checkout on the marketing site.",
      "When you are ready, open Contact, send the brief, and we will take it from there. Client portal access comes later only if your project needs shared updates and files.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
