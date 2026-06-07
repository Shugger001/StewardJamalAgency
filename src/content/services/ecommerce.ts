import type { ServicePageContent } from "./types";

export const ecommercePage: ServicePageContent = {
  href: "/services/ecommerce",
  title: "e-Commerce Development",
  subtitle: "Online stores for Ghana—MoMo checkout, mobile-first design, and product pages built to sell.",
  heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  heroImageAlt: "E-commerce shopping experience",
  introTitle: "Sell online with checkout your customers already use",
  introBody:
    "Ghanaian shoppers expect fast mobile pages, clear pricing, and payment options like MoMo. We build stores around those expectations—from catalog setup to order notifications—so you can reach buyers in Accra, Kumasi, and beyond.",
  highlightEyebrow: "E-commerce development for Ghanaian retailers and brands",
  highlightTitle: "Stores designed for mobile buyers",
  highlightBody:
    "Most of your traffic will come from phones. We prioritize thumb-friendly navigation, quick product loads, simple checkout, and trust signals (reviews, delivery info, secure payment badges) that reduce abandoned carts.",
  whyChoose: [
    { title: "Payments Locals Trust", body: "MTN MoMo, Telecel Cash, AT, and card options integrated into a clear checkout flow." },
    { title: "Product Pages That Convert", body: "Strong imagery, variants, shipping notes, and CTAs placed where shoppers expect them." },
    { title: "Search-Friendly Catalogs", body: "Clean URLs, structured data, and fast category pages so products can rank organically." },
    { title: "Room to Grow", body: "Architecture that handles more SKUs, traffic, and fulfillment workflows as sales increase." },
  ],
  results: [
    "Checkout experiences aligned with how Ghanaian customers pay on mobile.",
    "Product and category pages that load quickly on common network speeds.",
    "Admin tools your team can use to update stock, prices, and promotions.",
  ],
  offerings: [
    { id: "store-setup", title: "Full Online Store Setup", intro: "End-to-end store build: catalog structure, design, payments, and launch checklist.", features: ["Product, variant, and category setup.", "Mobile-first storefront theme.", "Order emails and admin notifications.", "Basic sales and traffic analytics.", "Training for day-to-day store management."] },
    { id: "payments", title: "Payment Gateway Integration", intro: "Connect the gateways your customers already use—with clear success, pending, and failed states.", features: ["MTN Mobile Money flows.", "Card processing via Paystack or similar.", "Receipt and confirmation pages.", "Deposit or milestone billing for custom builds.", "Security-conscious implementation patterns."] },
    { id: "marketplace", title: "Multi-Vendor & Marketplace Builds", intro: "Platforms where multiple sellers list products under one brand with separate vendor dashboards.", features: ["Vendor onboarding and product approval.", "Commission and payout rules.", "Ratings and review modules.", "Search and filters across listings.", "Admin tools for moderation and reporting."] },
    { id: "optimization", title: "Store Optimization & CRO", intro: "Improve an existing shop's speed, UX, and conversion rate without rebuilding from zero.", features: ["Checkout funnel review.", "Speed and Core Web Vitals fixes.", "Layout tests for product and cart pages.", "Upsell and cross-sell placement.", "Post-purchase email capture."] },
  ],
  extraSection: {
    title: "Need branding and content pages too?",
    body: "Many store projects include about pages, campaign landing pages, and blog content. Our web team can handle the full customer journey—not just the cart.",
    linkHref: "/services/web-development",
    linkLabel: "View web development →",
  },
  faqs: [
    { q: "Can customers pay with Mobile Money?", a: "Yes. MoMo and other local methods can sit alongside card payments in the same checkout." },
    { q: "How long does an online store take to launch?", a: "Typical stores go live in 6–10 weeks. Large catalogs or marketplace features may need longer." },
    { q: "Do you upload products for us?", a: "We set up structure and templates. Bulk product entry can be scoped based on your catalog size." },
    { q: "Can you migrate from Shopify or WooCommerce?", a: "Yes. We migrate products, categories, and customer-facing content where possible." },
    { q: "Will the store work on low-end phones?", a: "Mobile performance is a default requirement—we optimize images, scripts, and layout for everyday devices." },
  ],
};
