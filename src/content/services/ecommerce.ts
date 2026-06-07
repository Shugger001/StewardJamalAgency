import type { ServicePageContent } from "./types";

export const ecommercePage: ServicePageContent = {
  href: "/services/ecommerce",
  title: "e-Commerce Development",
  subtitle: "Online store development in Ghana — MoMo payments, SEO product pages, and checkout flows that convert.",
  heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  heroImageAlt: "E-commerce shopping experience",
  introTitle: "Take your business online and sell more in Ghana",
  introBody:
    "Ghana's e-commerce market is growing fast. We build powerful online stores with intuitive product pages, secure MoMo and card checkout, and SEO-ready catalogs—so you can reach customers in Accra, Kumasi, and nationwide without friction.",
  highlightEyebrow: "E-commerce development in Accra for scalable online sales",
  highlightTitle: "E-commerce services in Ghana — maximize online revenue",
  highlightBody:
    "From fashion and food to services and B2B, we design e-commerce experiences that reduce cart abandonment and increase average order value. Every store we build is mobile-first, fast-loading, and optimized for how Ghanaian customers actually shop and pay.",
  whyChoose: [
    { title: "Local Payment Integration", body: "MTN MoMo, Telecel Cash, AT, Visa, and Mastercard—checkout options your customers already trust." },
    { title: "Conversion-Optimized Storefronts", body: "Product pages, filters, and checkout flows designed to turn browsers into repeat buyers." },
    { title: "SEO-Ready Product Catalogs", body: "Structured data, fast pages, and keyword-rich listings so your products get found on Google." },
    { title: "Scalable From Day One", body: "Architecture that grows with your inventory, traffic, and fulfillment needs." },
  ],
  results: [
    "Higher online sales with checkout flows tuned for Ghanaian mobile money users.",
    "Improved product visibility through SEO-optimized category and product pages.",
    "Stronger customer trust with secure payments and professional store design.",
  ],
  offerings: [
    { id: "store-setup", title: "Full Online Store Setup", intro: "Launch-ready e-commerce with catalog structure, categories, product templates, and admin-friendly content management.", features: ["Product and category architecture.", "Mobile-responsive storefront design.", "Inventory and variant support.", "Order notification workflows.", "Analytics and conversion tracking."] },
    { id: "payments", title: "Payment Gateway Integration", intro: "Seamless checkout with the payment methods Ghanaian customers use every day.", features: ["MTN Mobile Money integration.", "Card payments via Paystack and similar providers.", "Clear payment status and receipt flows.", "Deposit and milestone billing for custom builds.", "Secure, PCI-aware implementation patterns."] },
    { id: "marketplace", title: "Multi-Vendor & Marketplace Builds", intro: "Platforms where multiple sellers or service providers can list, sell, and manage orders under one brand.", features: ["Vendor dashboards and onboarding.", "Commission and payout structures.", "Review and rating systems.", "Search and filter across listings.", "Admin moderation tools."] },
    { id: "optimization", title: "Store Optimization & CRO", intro: "Improve an existing store's speed, UX, and conversion rate without starting from scratch.", features: ["Checkout funnel analysis.", "Page speed and Core Web Vitals fixes.", "A/B-ready layout improvements.", "Upsell and cross-sell placement.", "Post-purchase email capture."] },
  ],
  extraSection: {
    title: "Need a full website too?",
    body: "Many e-commerce projects include custom landing pages, brand design, and SEO. Our web development team handles the complete digital experience.",
    linkHref: "/services/web-development",
    linkLabel: "View web development services →",
  },
  faqs: [
    { q: "Can customers pay with Mobile Money on my online store?", a: "Yes. We integrate MTN MoMo and other local payment options alongside card payments so checkout feels natural for Ghanaian buyers." },
    { q: "How long does an e-commerce website take to build?", a: "Standard stores typically launch in 6–10 weeks. Larger catalogs or marketplace features may take 2–3 months." },
    { q: "Do you help with product photography and content?", a: "We can guide content structure and SEO copy. Photography and bulk product entry can be scoped as part of your project plan." },
    { q: "Can you migrate my existing store?", a: "Yes. We migrate products, categories, and customer-facing content from platforms like Shopify, WooCommerce, or custom setups." },
    { q: "Will my store work well on mobile?", a: "Absolutely. Mobile-first design is standard—most Ghanaian e-commerce traffic comes from smartphones." },
  ],
};
