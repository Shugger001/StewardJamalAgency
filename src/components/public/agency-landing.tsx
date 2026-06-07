"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Headphones,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { PublicLeadForm } from "@/components/leads/public-lead-form";
import { MobileMenuButton } from "@/components/public/mobile-menu-button";
import { PageHero } from "@/components/public/page-hero";
import { blogPosts } from "@/content/blog-posts";
import { PUBLIC_NAV, type PublicPageView } from "@/lib/public-site-config";

/** Hero visual — `public/hero-landing.png` */
const HERO_IMAGE_SRC = "/hero-landing.png";

const LANDING_GUTTER = "w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20";

/** Doctor Barns–inspired palette */
const DB = {
  navy: "#051B2E",
  navyMid: "#09243C",
  sky: "#DDEDF5",
  skyLight: "#F1F2F2",
  gold: "#FFCC53",
  orange: "#ff6900",
  teal: "#0693e3",
} as const;

const IMG = {
  bannerGlass:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80",
  strategySession: "/landing-discovery.jpg",
  designDesk: "/landing-design.jpg",
  buildLaptop: "/landing-build.jpg",
  uxWhiteboard:
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80",
  launchTeam:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
  portfolioMood:
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2400&q=80",
} as const;

const LANDING_IMAGE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" as const;

const heroSlides = [
  {
    eyebrow: "Web Design & Development · Ghana",
    title: "Websites that work as hard as you do",
    body: "Purpose-built design, reliable engineering, and SEO-ready structure—so your site attracts qualified visitors and turns interest into revenue.",
    image: HERO_IMAGE_SRC,
  },
  {
    eyebrow: "The Steward Jamal Agency",
    title: "Show up in search. Win more business.",
    body: "We build fast, mobile-first sites with search fundamentals baked in—helping Ghanaian brands capture more enquiries and close more sales online.",
    image: IMG.buildLaptop,
  },
  {
    eyebrow: "Accra · Kumasi · Nationwide",
    title: "Digital experiences your customers will trust",
    body: "Clear messaging, polished visuals, and conversion paths that guide visitors from first click to booked call, purchase, or signup.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2200&q=80",
  },
] as const;

type ServiceItem = {
  num: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const serviceItems: ServiceItem[] = [
  {
    num: "01",
    title: "Search Engine Optimization",
    body: "Research, technical fixes, and on-page tuning so the right people find your business when they search on Google.",
    icon: Search,
  },
  {
    num: "02",
    title: "E-Commerce Development",
    body: "Online stores with MoMo-friendly checkout, clear product pages, and layouts shaped around how Ghanaians shop on mobile.",
    icon: ShoppingCart,
  },
  {
    num: "03",
    title: "Custom Web Applications",
    body: "Client portals, booking systems, and internal dashboards tailored to your workflow—not off-the-shelf templates.",
    icon: Globe,
  },
  {
    num: "04",
    title: "Digital Marketing & PPC",
    body: "Paid search and social campaigns tracked against real outcomes: cost per lead, booked calls, and revenue.",
    icon: Megaphone,
  },
  {
    num: "05",
    title: "Web Development & Design",
    body: "Brand-aligned websites built for speed, clarity, and lead capture—from single-page launches to multi-section platforms.",
    icon: Sparkles,
  },
];

const whyChooseUs = [
  {
    title: "Design With Intent",
    body: "Every layout choice supports a goal—credibility, enquiry, signup, or purchase—not decoration for its own sake.",
    icon: Zap,
  },
  {
    title: "Built to Be Found",
    body: "Clean code, fast load times, and SEO basics included so your site can compete in local and national search.",
    icon: BarChart3,
  },
  {
    title: "Conversion-First UX",
    body: "Straightforward navigation, strong calls to action, and mobile layouts tested for real-world use.",
    icon: Star,
  },
  {
    title: "Flexible for Any Stage",
    body: "Whether you are launching a new venture or refreshing an established brand, scope and timeline fit your needs.",
    icon: Globe,
  },
] as const;

const faqItems = [
  {
    q: "What is the typical timeline for a business website?",
    a: "Most projects go live in three to six weeks. Timeline depends on page count, how quickly you provide content, and how many design rounds you need.",
  },
  {
    q: "Is SEO included when you build a site?",
    a: "Every build includes core SEO setup: page titles, descriptions, heading structure, sitemap, and performance tuning. Ongoing SEO campaigns are available separately.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept MTN MoMo, Telecel Cash, AT Money, and card payments. Projects are usually billed in milestones—deposit, design approval, and launch.",
  },
  {
    q: "Can you help after the site goes live?",
    a: "Yes. We offer maintenance plans for updates, security patches, content changes, and periodic performance reviews.",
  },
] as const;

const testimonials = [
  {
    quote:
      "We needed a site that could handle online orders and still feel personal. The Steward Jamal Agency delivered a clean storefront, set up MoMo checkout, and helped us rank for local search terms. Enquiries picked up within the first month.",
    name: "Ama Osei",
    role: "Founder, Sweet Crust Bakery",
  },
  {
    quote:
      "Our old website looked dated and loaded slowly on mobile. The rebuild was professional from kickoff to launch—clear milestones, fast turnaround, and a structure that makes it easy for our team to update content.",
    name: "Dr. Kwame Mensah",
    role: "Managing Director",
  },
  {
    quote:
      "They rebuilt our customer portal with a simpler login flow and clearer service menus. Support tickets dropped and self-service usage went up. The team listened to our ops team, not just our marketing wish list.",
    name: "Angela Boadu",
    role: "Head of Digital Strategy",
  },
  {
    quote:
      "From analytics setup to landing pages for our ad campaigns, everything was connected properly. We finally had visibility into which channels were actually producing leads—not just clicks.",
    name: "Samuel Upton",
    role: "Operations Lead",
  },
] as const;

const teamMembers = [
  {
    name: "Jamal Steward",
    role: "CEO / Founder",
    email: "hello@stewardjamal.com",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    name: "Ama Serwaa",
    role: "Lead Developer",
    email: "dev@stewardjamal.com",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    name: "Kofi Mensah",
    role: "Senior Designer",
    email: "design@stewardjamal.com",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
  },
] as const;

const pricingBenefits = [
  {
    title: "Momentum in the first quarter",
    body: "Launch-ready sites and campaign landing pages designed to generate early traction—not months of waiting.",
    icon: TrendingUp,
  },
  {
    title: "Support after go-live",
    body: "Optional maintenance for security patches, content edits, and performance checks once your site is live.",
    icon: RefreshCw,
  },
  {
    title: "Transparent pricing",
    body: "Published packages with clear deliverables so you know exactly what you are paying for before work begins.",
    icon: Headphones,
  },
] as const;

function readPublicEnvString(value: string | undefined) {
  if (typeof value !== "string") return "";
  return value.trim();
}

const FOOTER_CONTACT_EMAIL =
  readPublicEnvString(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "stewardjamalagency@gmail.com";
const FOOTER_CONTACT_PHONE =
  readPublicEnvString(process.env.NEXT_PUBLIC_CONTACT_PHONE) || "+233 54 311 1607";
const FOOTER_ADDRESS =
  readPublicEnvString(process.env.NEXT_PUBLIC_CONTACT_ADDRESS) || "Accra, Ghana";
const FOOTER_SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: readPublicEnvString(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL) },
  { label: "LinkedIn", href: readPublicEnvString(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL) },
  { label: "X", href: readPublicEnvString(process.env.NEXT_PUBLIC_SOCIAL_X_URL) },
].filter((item) => item.href.length > 0);

export type LandingPortfolioItem = {
  id: string;
  name: string;
  status: string;
  domain: string | null;
  clientName: string;
};

type AgencyLandingProps = {
  mode: "home" | "site";
  view?: PublicPageView;
  portfolioItems: LandingPortfolioItem[];
  previewTargets?: string[];
};

const brandLogos = [
  "Northwind Collective",
  "Cedar & Co.",
  "Harborline Realty",
  "Studio Lumen",
  "UrbanHomes",
  "Prime Retail",
];

const SERVICE_LINKS: Record<string, string> = {
  "Search Engine Optimization": "/services/seo",
  "E-Commerce Development": "/services/ecommerce",
  "Digital Marketing & PPC": "/services/digital-marketing",
  "Web Development & Design": "/services/web-development",
  "Custom Web Applications": "/services/web-development#custom-design",
};

const PAGE_HEADERS: Record<Exclude<PublicPageView, "home" | "all">, { eyebrow: string; title: string; description: string }> = {
  about: {
    eyebrow: "About us",
    title: "The team behind your next website",
    description: "We design and build digital products for Ghanaian businesses—from first launch to long-term growth.",
  },
  portfolio: {
    eyebrow: "Our work",
    title: "Projects and previews",
    description: "A selection of websites and platforms we have built for clients across Ghana.",
  },
  pricing: {
    eyebrow: "Packages",
    title: "Clear pricing for every stage",
    description: "Published packages with defined deliverables. Upgrade to priority delivery when you need a faster kickoff.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Start a conversation",
    description: "Tell us about your project—we will reply with scope options, timeline, and next steps.",
  },
};

export function AgencyLanding({ mode, view: viewProp, portfolioItems, previewTargets = [] }: AgencyLandingProps) {
  const isSite = mode === "site";
  const view: PublicPageView = viewProp ?? (isSite ? "all" : "home");
  const isCompactHome = view === "home";
  const [navOpen, setNavOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "done">("idle");
  const [pricingTier, setPricingTier] = useState<"standard" | "priority">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card">("momo");
  const basePath = isSite ? "/site" : "/";
  const contactHref = isSite ? `${basePath}#proposal` : "/contact";
  const navItems = isSite
    ? [
        { href: basePath, label: "Home" },
        { href: `${basePath}#about`, label: "About Us" },
        { href: "/services", label: "Service" },
        { href: `${basePath}#portfolio`, label: "Portfolio" },
        { href: "/blog", label: "Blog" },
        { href: `${basePath}#proposal`, label: "Contact Us" },
      ]
    : PUBLIC_NAV.map((item) => ({ href: item.href, label: item.label }));

  function renderNavLink(item: { href: string; label: string }, className: string, onNavigate?: () => void) {
    const isHashLink = item.href.includes("#");
    if (isHashLink) {
      return (
        <a
          key={item.href}
          href={item.href}
          onClick={(e) => {
            handleInPageAnchorClick(e, item.href);
            onNavigate?.();
          }}
          className={className}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link key={item.href} href={item.href} className={className} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }

  function handleInPageAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    try {
      const url = new URL(href, window.location.origin);
      const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p) || "/";
      if (norm(url.pathname) !== norm(window.location.pathname)) return;
      const id = url.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `${url.pathname}${url.hash}`);
    } catch {
      /* ignore malformed href */
    }
  }

  useEffect(() => {
    function syncTierFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const tierFromUrl = params.get("tier");
      if (tierFromUrl === "priority" || tierFromUrl === "standard") {
        setPricingTier(tierFromUrl);
      } else {
        setPricingTier("standard");
      }
    }

    syncTierFromUrl();
    window.addEventListener("popstate", syncTierFromUrl);
    return () => window.removeEventListener("popstate", syncTierFromUrl);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (view !== "home" && view !== "all") return;
    const timer = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [view]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  function handleTierChange(nextTier: "standard" | "priority") {
    setPricingTier(nextTier);
    const params = new URLSearchParams(window.location.search);
    if (nextTier === "standard") {
      params.delete("tier");
    } else {
      params.set("tier", nextTier);
    }
    const query = params.toString();
    const hash = window.location.hash;
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${hash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  return (
    <main className="agency-landing overflow-hidden bg-white text-zinc-900">
      {/* Top contact bar — Doctor Barns style */}
      <div className="hidden border-b border-zinc-200 lg:block" style={{ backgroundColor: DB.skyLight }}>
        <div className={`${LANDING_GUTTER} flex h-10 items-center justify-between text-xs text-zinc-600`}>
          <div className="flex items-center gap-5">
            <span className="font-semibold uppercase tracking-wider text-[#0693e3]">Contact</span>
            {FOOTER_CONTACT_PHONE ? (
              <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-[#051B2E]">
                <Phone className="h-3.5 w-3.5" />
                Call Us: {FOOTER_CONTACT_PHONE}
              </a>
            ) : null}
            {FOOTER_CONTACT_EMAIL ? (
              <a href={`mailto:${FOOTER_CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-[#051B2E]">
                <Mail className="h-3.5 w-3.5" />
                {FOOTER_CONTACT_EMAIL}
              </a>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {FOOTER_ADDRESS}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
        <div className={`${LANDING_GUTTER} flex h-[4.5rem] items-center gap-3`}>
          <Link href={basePath} className="min-w-0 shrink-0 truncate text-base font-bold tracking-tight" style={{ color: DB.navy }}>
            The Steward Jamal Agency
          </Link>
          <nav className="hidden flex-1 justify-center gap-6 xl:flex" aria-label="Page sections">
            {navItems.map((item) =>
              renderNavLink(item, "text-sm font-medium text-zinc-700 transition hover:text-[#0693e3]"),
            )}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href={isSite ? "/dashboard" : "/signup"}
              className="hidden h-10 items-center rounded-sm px-5 text-sm font-bold uppercase tracking-wide text-[#051B2E] shadow-sm transition hover:brightness-95 sm:inline-flex"
              style={{ backgroundColor: DB.gold }}
            >
              {isSite ? "Dashboard" : "Start a project"}
            </Link>
            <div className="relative xl:hidden">
              <MobileMenuButton
                open={navOpen}
                onClick={() => setNavOpen((o) => !o)}
                aria-controls="landing-mobile-nav"
              />
              {navOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40"
                    aria-label="Close menu"
                    onClick={() => setNavOpen(false)}
                  />
                  <div
                    id="landing-mobile-nav"
                    className="fixed left-0 right-0 top-[4.5rem] z-50 border-b border-zinc-200 bg-white px-4 py-3 shadow-lg xl:hidden"
                  >
                    <nav className="flex flex-col gap-0.5" aria-label="Page sections">
                      {navItems.map((item) =>
                        renderNavLink(
                          item,
                          "rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                          () => setNavOpen(false),
                        ),
                      )}
                    </nav>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {(view === "home" || view === "all") ? (
      <section className="relative min-h-[min(78vh,680px)] overflow-hidden" style={{ backgroundColor: DB.navy }}>
        <div aria-hidden="true" className="absolute inset-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.title}
              className={`agency-hero-bg ${idx === heroIndex ? "is-active" : ""}`}
            >
              <div className="agency-hero-bg-image absolute inset-0">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#051B2E]/96 via-[#09243C]/88 to-[#051B2E]/55" />
            </div>
          ))}
        </div>
        <div className={`${LANDING_GUTTER} relative z-10 flex min-h-[min(78vh,680px)] flex-col justify-center py-16 lg:py-20`}>
          <div className="agency-hero-slides relative max-w-3xl pb-14">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.title}
                className={`agency-hero-slide ${idx === heroIndex ? "is-active" : ""}`}
                aria-hidden={idx !== heroIndex}
              >
                <p className="agency-section-eyebrow text-xs font-semibold text-[#FFCC53]">{slide.eyebrow}</p>
                <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-[3.25rem]">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-200 sm:text-base">{slide.body}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/services/web-development"
                    className="inline-flex h-12 items-center gap-2 rounded-sm px-7 text-sm font-bold uppercase tracking-wide text-[#051B2E] transition hover:brightness-95"
                    style={{ backgroundColor: DB.gold }}
                  >
                    View Our Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
            <div className="absolute bottom-0 flex gap-2" aria-label="Hero slide indicators">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Show slide ${idx + 1}`}
                  aria-current={idx === heroIndex}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === heroIndex ? "w-10 bg-[#FFCC53]" : "w-6 bg-white/35 hover:bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Floating quick-call card */}
        <aside
          className="absolute bottom-6 right-4 z-20 hidden max-w-xs rounded-lg border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur sm:block lg:right-10"
          aria-label="Quick contact"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Ready to grow online?</p>
          {FOOTER_CONTACT_PHONE ? (
            <p className="mt-2 text-sm font-semibold text-[#051B2E]">
              Call us:{" "}
              <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="text-[#0693e3] hover:underline">
                {FOOTER_CONTACT_PHONE}
              </a>
            </p>
          ) : (
            <a
              href={contactHref}
              onClick={(e) => !contactHref.includes("#") ? undefined : handleInPageAnchorClick(e, contactHref)}
              className="mt-2 inline-block text-sm font-semibold text-[#0693e3] hover:underline"
            >
              Send us a brief →
            </a>
          )}
        </aside>
      </section>
      ) : (
        <PageHero {...PAGE_HEADERS[view as keyof typeof PAGE_HEADERS]} />
      )}

      {(view === "home" || view === "all" || view === "contact") && (
      <section style={{ backgroundColor: DB.teal }} className="text-white">
        <div className={`${LANDING_GUTTER} flex flex-wrap items-center justify-between gap-3 py-3.5`}>
          <p className="text-sm font-semibold sm:text-base">Ready to grow your business online?</p>
          {FOOTER_CONTACT_PHONE ? (
            <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Call us: {FOOTER_CONTACT_PHONE}
            </a>
          ) : (
            <a
              href={contactHref}
              className="text-sm font-medium underline-offset-2 hover:underline"
            >
              Send us a brief →
            </a>
          )}
        </div>
      </section>
      )}

      {(view === "home" || view === "about" || view === "all") && (
      <section id="about" className="scroll-mt-24 py-14 lg:py-20" style={{ backgroundColor: DB.skyLight }}>
        <div className={`${LANDING_GUTTER} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <div className="agency-reveal-up">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">The Steward Jamal Agency</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl" style={{ color: DB.navy }}>
              Web development that supports real business goals
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              A website should do more than sit online—it should bring in enquiries, support sales, and strengthen your
              reputation. We build{" "}
              <strong>custom websites for businesses across Ghana</strong>, with performance, mobile usability, and
              search fundamentals included from the start. From early-stage startups in Accra to established teams in
              Kumasi, we design around how you actually win customers.
            </p>
            {isCompactHome ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: DB.orange }}
                >
                  About our agency
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-full border border-[#051B2E] px-6 text-sm font-semibold text-[#051B2E] transition hover:bg-[#051B2E] hover:text-white"
                >
                  Request a quote
                </Link>
              </div>
            ) : (
              <Link
                href={contactHref}
                className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: DB.orange }}
              >
                Request a Quote
              </Link>
            )}
          </div>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[4/3] w-full">
              <Image src={IMG.strategySession} alt="Strategy and discovery session" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
        </div>
      </section>
      )}

      {(view === "about" || view === "all") && (
      <>
      <section className="py-14 lg:py-20">
        <div className={`${LANDING_GUTTER} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <figure className="agency-reveal-up order-2 overflow-hidden rounded-2xl shadow-lg lg:order-1">
            <div className="relative aspect-[4/3] w-full">
              <Image src={IMG.designDesk} alt="Web design and development workspace" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
          <div className="agency-reveal-up order-1 lg:order-2">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">
              Search visibility for Ghanaian brands
            </p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              Get found when customers are searching
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Ranking matters—but so does relevance. We improve site structure, page content, and technical health so your
              business appears for the searches that lead to calls, bookings, and purchases.
            </p>
            <Link
              href="/services/seo"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0693e3] hover:underline"
            >
              Explore our SEO work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20" style={{ backgroundColor: DB.sky }}>
        <div className={`${LANDING_GUTTER} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <div className="agency-reveal-up">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">
              Digital marketing for Ghana-based teams
            </p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              Advertising tied to outcomes you can track
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              We plan and manage campaigns across search and social with clear targets—lead volume, cost per enquiry, and
              return on ad spend—so marketing spend connects to business results.
            </p>
            <Link
              href="/services/digital-marketing"
              className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-[#051B2E] transition hover:brightness-95"
              style={{ backgroundColor: DB.gold }}
            >
              Explore marketing services
            </Link>
          </div>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[4/3] w-full">
              <Image src={IMG.buildLaptop} alt="Digital marketing and analytics dashboard" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
        </div>
      </section>
      </>
      )}

      {(view === "home" || view === "all") && (
      <section className="border-y border-zinc-200 bg-white py-8">
        <div className={LANDING_GUTTER}>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">Brands we&apos;ve supported</p>
          <div className="agency-marquee-wrap mt-4 overflow-hidden">
            <div className="agency-marquee-track flex w-max gap-3 text-sm font-medium text-zinc-600">
              {[...brandLogos, ...brandLogos].map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-center"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {view === "home" && (
      <section className={`${LANDING_GUTTER} py-14 lg:py-16`}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">What we do</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
            Services for every stage of growth
          </h2>
          <p className="mt-3 text-sm text-zinc-600">
            From your first company site to SEO, e-commerce, and paid campaigns—each service has its own page with full details.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const href = SERVICE_LINKS[item.title] ?? "/services";
            return (
              <Link
                key={item.num}
                href={href}
                className="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[#0693e3]/40 hover:shadow-md"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#DDEDF5] text-[#0693e3]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-sm font-bold" style={{ color: DB.navy }}>
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-600">{item.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0693e3]">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: DB.navy }}
          >
            View all services
          </Link>
        </div>
      </section>
      )}

      {view === "all" && (
      <section id="services" className={`${LANDING_GUTTER} scroll-mt-20 py-14 lg:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Talk to us</p>
              <a
                href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`}
                className="mt-2 flex items-center gap-2 text-base font-bold text-[#051B2E] hover:text-[#0693e3]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#0693e3]" />
                {FOOTER_CONTACT_PHONE}
              </a>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#051B2E]">Services</p>
              <nav className="mt-3 flex flex-col gap-1">
                <Link href="/services/web-development" className="rounded bg-[#DDEDF5] px-2 py-2 text-sm font-semibold text-[#051B2E]">
                  Web Development And Design
                </Link>
                <Link href="/services/ecommerce" className="rounded px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-[#0693e3]">
                  e-Commerce Development
                </Link>
                <Link href="/services/seo" className="rounded px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-[#0693e3]">
                  Search Engine Optimization
                </Link>
                <Link href="/services/digital-marketing" className="rounded px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-[#0693e3]">
                  Digital Marketing & PPC
                </Link>
                <Link href="/services/web-development#custom-design" className="rounded px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-[#0693e3]">
                  Custom Web Applications
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`${basePath}#proposal`} onClick={(e) => handleInPageAnchorClick(e, `${basePath}#proposal`)} className="inline-flex h-10 items-center justify-center rounded-sm px-4 text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: DB.orange }}>
                Start a project
              </Link>
              <Link href="/services/web-development" className="inline-flex h-10 items-center justify-center rounded-sm px-4 text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: DB.navy }}>
                Browse web services
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">
              Full-service digital under one roof
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl" style={{ color: DB.navy }}>
              Web design, development, SEO, and e-commerce for Ghanaian businesses
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Need a new company site, an online store, or a refresh of an outdated platform? We handle strategy, design,
              build, and launch—with room to add SEO and paid campaigns when you are ready to scale.
            </p>
            <div className="mt-8 space-y-4">
              {serviceItems.map((item, idx) => {
                const Icon = item.icon;
                const readMoreHref: Record<string, string> = {
                  "Search Engine Optimization": "/services/seo",
                  "E-Commerce Development": "/services/ecommerce",
                  "Digital Marketing & PPC": "/services/digital-marketing",
                  "Web Development & Design": "/services/web-development",
                  "Custom Web Applications": "/services/web-development#custom-design",
                };
                const href = readMoreHref[item.title] ?? `${basePath}#proposal`;
                return (
                  <article
                    key={item.num}
                    className="agency-reveal-up group flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-start sm:p-6"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <span className="agency-service-num shrink-0 font-bold">{item.num}.</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold" style={{ color: DB.navy }}>
                          {item.title}
                        </h3>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DDEDF5] text-[#0693e3]">
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
                      <Link
                        href={href}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0693e3] hover:underline"
                      >
                        Explore service <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-10 text-center lg:text-left">
              <p className="text-lg font-semibold" style={{ color: DB.navy }}>
                Need a site that turns visitors into customers?
              </p>
              <Link
                href="/services/web-development"
                className="mt-3 inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: DB.navy }}
              >
                Browse all services
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {(view === "about" || view === "all") && (
      <>
      <section className="py-14 lg:py-20" style={{ backgroundColor: DB.skyLight }}>
        <div className={LANDING_GUTTER}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">Why work with us?</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Practical digital work focused on your bottom line
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              We combine design, development, and growth basics so your online presence supports lead generation—not just
              aesthetics.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="agency-reveal-up rounded-lg border border-zinc-200 bg-white p-5 text-center shadow-sm"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#DDEDF5] text-[#0693e3]">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold" style={{ color: DB.navy }}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-sm border border-[#051B2E] px-6 text-sm font-bold uppercase tracking-wide text-[#051B2E] transition hover:bg-[#051B2E] hover:text-white"
            >
              Work with us
            </Link>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: DB.navy }} className="py-14 text-white lg:py-16">
        <div className={`${LANDING_GUTTER} grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center`}>
          <div className="text-center lg:text-left">
            <p className="text-5xl font-bold text-[#FFCC53]">10+</p>
            <p className="mt-1 text-sm uppercase tracking-wider text-zinc-300">Years in digital work</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">Client work across Ghana</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">120+ projects delivered for growing brands</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Our focus is simple: help businesses look credible online and turn that credibility into enquiries and sales.
            </p>
            <Link
              href={contactHref}
              className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-[#051B2E]"
              style={{ backgroundColor: DB.gold }}
            >
              Start your project
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 lg:py-16" style={{ backgroundColor: DB.sky }}>
        <div className={LANDING_GUTTER}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">
              The people behind your project
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Meet the team building your next site
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.email}
                className="agency-reveal-up overflow-hidden rounded-lg border border-zinc-200 bg-white text-center shadow-sm"
              >
                <div className="relative mx-auto mt-6 h-28 w-28 overflow-hidden rounded-full border-4 border-[#DDEDF5] shadow-md">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="p-6 pt-4">
                  <h3 className="text-lg font-bold" style={{ color: DB.navy }}>
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#0693e3]">{member.role}</p>
                  <a href={`mailto:${member.email}`} className="mt-3 block text-xs text-zinc-500 hover:text-[#0693e3]">
                    {member.email}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process gallery */}
      <section id="gallery" className={`${LANDING_GUTTER} scroll-mt-20 py-14`}>
        <div className="agency-reveal-up relative overflow-hidden rounded-2xl shadow-lg">
          <div className="relative aspect-[5/2] min-h-[200px] w-full sm:min-h-[260px]">
            <Image src={IMG.bannerGlass} alt="Modern professional workspace" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#051B2E]/90 via-[#051B2E]/60 to-transparent" />
            <div className="absolute inset-0 flex max-w-lg flex-col justify-center p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">Our process</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                How we take you from brief to live site
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { img: IMG.strategySession, label: "Discovery", text: "We clarify goals, audience, and must-have features before any design work starts." },
            { img: IMG.uxWhiteboard, label: "Design & UX", text: "Wireframes and visuals shaped around how visitors move toward enquiry or purchase." },
            { img: IMG.launchTeam, label: "Launch", text: "Deployment, analytics hooks, and a smooth handoff so your team can manage day one." },
          ].map((item, idx) => (
            <figure
              key={item.label}
              className="agency-reveal-up overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image src={item.img} alt={item.label} fill className="object-cover" sizes={LANDING_IMAGE_SIZES} />
              </div>
              <figcaption className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0693e3]">{item.label}</p>
                <p className="mt-1 text-sm text-zinc-600">{item.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      </>
      )}

      {(view === "about" || view === "pricing" || view === "all") && (
      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Sites shipped</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
              120+
            </p>
            <p className="mt-1 text-sm text-zinc-600">Corporate sites, shops, and custom web apps.</p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Typical go-live window</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
              3–6 weeks
            </p>
            <p className="mt-1 text-sm text-zinc-600">Structured milestones keep delivery on track.</p>
          </article>
          <article
            className="rounded-2xl border border-[#FFCC53]/50 p-5 shadow-sm"
            style={{ backgroundColor: "#FCDA8A33" }}
          >
            <p className="text-xs uppercase tracking-wide text-[#051B2E]">Limited availability</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
              Priority kickoffs
            </p>
            <p className="mt-1 text-sm text-zinc-700">Reserve a slot for faster project start dates.</p>
          </article>
        </div>
      </section>
      )}

      {(view === "pricing" || view === "all") && (
      <>
      <section className="py-12" style={{ backgroundColor: DB.sky }}>
        <div className={LANDING_GUTTER}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              Strong value without cutting corners
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Clear packages, honest timelines, and builds engineered to perform—not just look good in a screenshot.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pricingBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
                  <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FCDA8A] text-[#051B2E]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold" style={{ color: DB.navy }}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a
              href={isSite ? `${basePath}#pricing` : "/pricing"}
              onClick={(e) => {
                if (!isSite) return;
                handleInPageAnchorClick(e, `${basePath}#pricing`);
              }}
              className="inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: DB.orange }}
            >
              View package pricing
            </a>
          </div>
        </div>
      </section>

      <section id="pricing" className={`${LANDING_GUTTER} scroll-mt-20 pb-14`}>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0693e3]">Packages & pricing</p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
                Plans shaped around how you want to launch
              </h2>
            </div>
            <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1 text-xs">
              <button
                type="button"
                onClick={() => handleTierChange("standard")}
                className={`rounded-full px-4 py-1.5 font-semibold transition ${
                  pricingTier === "standard" ? "bg-[#051B2E] text-white" : "text-zinc-600 hover:bg-white"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => handleTierChange("priority")}
                className={`rounded-full px-4 py-1.5 font-semibold transition ${
                  pricingTier === "priority" ? "bg-[#051B2E] text-white" : "text-zinc-600 hover:bg-white"
                }`}
              >
                Priority
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Starter Website",
                price: pricingTier === "priority" ? "GH₵5,500" : "GH₵4,500",
                note:
                  pricingTier === "priority"
                    ? "Includes expedited kickoff and priority production queue."
                    : "Solid foundation for brands launching their first professional site.",
                featured: false,
              },
              {
                name: "Growth Package",
                price: pricingTier === "priority" ? "GH₵7,500" : "GH₵6,500",
                note:
                  pricingTier === "priority"
                    ? "Weekly check-ins, faster revisions, and priority support channel."
                    : "Popular choice for teams adding lead capture and content sections.",
                featured: true,
              },
              {
                name: "Premium Build",
                price: pricingTier === "priority" ? "GH₵10,500" : "GH₵9,000",
                note:
                  pricingTier === "priority"
                    ? "Dedicated lead contact with accelerated delivery windows."
                    : "For complex builds, integrations, and multi-stakeholder sign-off.",
                featured: false,
              },
            ].map((pkg) => (
              <article
                key={pkg.name}
                className={`rounded-xl border p-5 ${
                  pkg.featured
                    ? "border-[#0693e3]/40 bg-[#DDEDF5]/60 shadow-md"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-zinc-500">{pkg.name}</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
                  {pkg.price}
                </p>
                <p className="mt-2 text-xs text-zinc-600">{pkg.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-sm font-bold" style={{ color: DB.navy }}>
                Included in every package
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>• UX structure focused on enquiries and conversions</li>
                <li>• Responsive layout for phone, tablet, and desktop</li>
                <li>• Analytics setup and baseline SEO configuration</li>
                <li>• Launch checklist and post-go-live guidance</li>
              </ul>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-sm font-bold" style={{ color: DB.navy }}>
                Payment options preview
              </h3>
              <div className="mt-3 rounded-xl border border-[#0693e3]/25 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#0693e3]">Order total</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: DB.navy }}>
                  GH₵150.00
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("momo")}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      paymentMethod === "momo"
                        ? "border-[#0693e3] bg-[#DDEDF5] text-[#051B2E]"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Mobile Money (MTN, Telecel, AT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      paymentMethod === "card"
                        ? "border-[#0693e3] bg-[#DDEDF5] text-[#051B2E]"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Card Payment (Visa, Mastercard)
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      </>
      )}

      {(view === "portfolio" || view === "all") && (
      <section id="portfolio" className="py-14 lg:py-16" style={{ backgroundColor: DB.skyLight }}>
        <div className={LANDING_GUTTER}>
          <div className="agency-reveal-up relative mb-8 overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[5/2] min-h-[180px] w-full">
              <Image src={IMG.portfolioMood} alt="Portfolio showcase" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051B2E]/90 via-[#051B2E]/40 to-transparent" />
              <div className="absolute bottom-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">Portfolio</p>
                <p className="mt-1 max-w-xl text-lg font-bold text-white sm:text-xl">
                  Each project follows the same quality bar we use for client launches.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(portfolioItems.length ? portfolioItems : []).map((item) => {
              const target = item.domain || item.id;
              return (
                <article
                  key={item.id}
                  className="agency-reveal-up rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    {item.status === "published" ? "Published work" : "In development"}
                  </p>
                  <h3 className="mt-2 text-lg font-bold" style={{ color: DB.navy }}>
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{item.clientName}</p>
                  <Link
                    href={`/sites/${target}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0693e3] hover:underline"
                  >
                    Open preview <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
            {!portfolioItems.length && (
              <article className="agency-reveal-up rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-3">
                <p className="text-sm text-zinc-600">
                  Published client work will appear here. Sites go live from your dashboard once approved.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
      )}

      {isSite && previewTargets.length > 0 && (
        <section className={`${LANDING_GUTTER} pb-10`}>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Available preview links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {previewTargets.slice(0, 6).map((target) => (
                <Link
                  key={target}
                  href={`/sites/${target}`}
                  className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 hover:bg-white"
                >
                  /sites/{target}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {(view === "contact" || view === "all") && (
      <section id="faq" className={`${LANDING_GUTTER} scroll-mt-20 pb-14`}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Common questions
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Answers about scope, timelines, payments, and support for new projects.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <article key={item.q} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span className="text-sm font-semibold" style={{ color: DB.navy }}>
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-zinc-100 px-5 pb-4 pt-2 text-sm leading-relaxed text-zinc-600">
                      {item.a}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a
              href={`${basePath}#faq`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#faq`)}
              className="inline-flex h-11 items-center rounded-sm border border-[#051B2E] px-6 text-sm font-bold uppercase tracking-wide text-[#051B2E] transition hover:bg-[#051B2E] hover:text-white"
            >
              See all FAQs
            </a>
          </div>
        </div>
      </section>
      )}

      {(view === "home" || view === "about" || view === "all") && (
      <section className="py-14 lg:py-16" style={{ backgroundColor: DB.skyLight }}>
        <div className={LANDING_GUTTER}>
          <div className="text-center">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">Client stories</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Feedback from recent projects
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-600">
              <span className="flex text-[#FFCC53]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              Average client rating 4.9 / 5
            </div>
          </div>
          <div className="relative mx-auto mt-10 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md">
              {testimonials.map((item, idx) => (
                <blockquote
                  key={item.name}
                  className={`px-6 py-8 transition-opacity duration-500 sm:px-10 sm:py-10 ${
                    idx === testimonialIndex ? "block opacity-100" : "hidden opacity-0"
                  }`}
                  aria-hidden={idx !== testimonialIndex}
                >
                  <p className="text-center text-base leading-relaxed text-zinc-600 sm:text-lg">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <footer className="mt-6 text-center">
                    <p className="text-base font-bold" style={{ color: DB.navy }}>
                      {item.name}
                    </p>
                    <p className="text-sm text-zinc-500">{item.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() =>
                  setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((item, idx) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-label={`Show testimonial from ${item.name}`}
                    aria-current={idx === testimonialIndex}
                    onClick={() => setTestimonialIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === testimonialIndex ? "w-8 bg-[#0693e3]" : "w-2 bg-zinc-300"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => setTestimonialIndex((i) => (i + 1) % testimonials.length)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

      {view === "all" && (
      <section id="blog" className={`${LANDING_GUTTER} scroll-mt-20 pb-14`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">From our blog</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Guides for growing online in Ghana
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-[#0693e3] hover:underline">
            View all posts →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute left-4 top-4 rounded bg-white px-2 py-1 text-xs font-bold text-[#051B2E]">
                    {post.date}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#0693e3]">{post.category}</p>
                  <h3 className="mt-2 text-sm font-bold leading-snug group-hover:text-[#0693e3]" style={{ color: DB.navy }}>
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-zinc-600">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0693e3]">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      )}

      {(view === "home" || view === "all") && (
      <section style={{ backgroundColor: "#FCDA8A" }} className="py-10">
        <div className={`${LANDING_GUTTER} flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#051B2E]">New project incentive</p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              10% off new projects booked this month
            </h2>
          </div>
          <Link
            href={contactHref}
            className="inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: DB.orange }}
          >
            Claim 10% off
          </Link>
        </div>
      </section>
      )}

      {(view === "home" || view === "all") && (
      <section style={{ backgroundColor: DB.navy }} className="py-12 text-white">
        <div className={`${LANDING_GUTTER} flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">Start your project</p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">Work with The Steward Jamal Agency</h2>
            <p className="mt-2 text-sm text-zinc-300">Tell us what you need—we will map the right scope and timeline.</p>
          </div>
          <Link
            href={contactHref}
            className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-[#051B2E]"
            style={{ backgroundColor: DB.gold }}
          >
            Get started
          </Link>
        </div>
      </section>
      )}

      {(view === "contact" || view === "all") && (
      <>
      <section id="proposal" className={`${LANDING_GUTTER} scroll-mt-20 py-14 lg:py-16`}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-xl font-bold" style={{ color: DB.navy }}>
              Get in touch
            </h2>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Address</p>
                <p className="mt-1 inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0693e3]" />
                  {FOOTER_ADDRESS}
                </p>
              </div>
              {FOOTER_CONTACT_EMAIL ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email address</p>
                  <a href={`mailto:${FOOTER_CONTACT_EMAIL}`} className="mt-1 inline-flex items-center gap-2 font-medium text-[#0693e3] hover:underline">
                    <Mail className="h-4 w-4" />
                    {FOOTER_CONTACT_EMAIL}
                  </a>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Working time</p>
                <p className="mt-1 inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0693e3]" />
                  Mon – Sat: 8:00am – 5:00pm
                </p>
              </div>
              {FOOTER_CONTACT_PHONE ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone</p>
                  <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="mt-1 inline-flex items-center gap-2 font-semibold text-[#051B2E] hover:text-[#0693e3]">
                    <Phone className="h-4 w-4" />
                    {FOOTER_CONTACT_PHONE}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold" style={{ color: DB.navy }}>
              Tell us about your project
            </p>
            <div className="mt-4">
              <PublicLeadForm />
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: DB.sky }} className="border-y border-zinc-200 py-10">
        <div className={`${LANDING_GUTTER} grid gap-8 md:grid-cols-2`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Studio location</p>
            <p className="mt-2 text-sm text-zinc-700">{FOOTER_ADDRESS}</p>
            <p className="mt-1 text-sm text-zinc-600">Hours: Mon–Sat, 8:00am – 5:00pm</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Reach us directly</p>
            {FOOTER_CONTACT_EMAIL ? (
              <p className="mt-2 text-sm text-zinc-700">
                Email:{" "}
                <a href={`mailto:${FOOTER_CONTACT_EMAIL}`} className="font-medium text-[#0693e3] hover:underline">
                  {FOOTER_CONTACT_EMAIL}
                </a>
              </p>
            ) : null}
            {FOOTER_CONTACT_PHONE ? (
              <p className="mt-1 text-sm text-zinc-700">
                Call us:{" "}
                <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="font-medium text-[#0693e3] hover:underline">
                  {FOOTER_CONTACT_PHONE}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </section>
      </>
      )}

      <footer className="border-t border-zinc-800 text-zinc-300" style={{ backgroundColor: DB.navyMid }} aria-label="Site footer">
        <div className={`${LANDING_GUTTER} py-10 lg:py-12`}>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            <div>
              <p className="text-sm font-bold text-white">The Steward Jamal Agency</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                Web design, development, SEO, and marketing for Ghanaian businesses that want a stronger online presence.
              </p>
              {FOOTER_SOCIAL_LINKS.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="Social profiles">
                  {FOOTER_SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-zinc-400 hover:text-white hover:underline"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Services</p>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer services">
                {serviceItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.num}
                    href={SERVICE_LINKS[item.title] ?? "/services"}
                    className="text-sm text-zinc-300 transition hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Explore</p>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer sections">
                {navItems.map((item) =>
                  renderNavLink(item, "text-sm text-zinc-300 transition hover:text-white"),
                )}
              </nav>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Email updates</p>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Get occasional updates on web design, SEO, and digital growth. No spam—unsubscribe anytime.
              </p>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) setNewsletterStatus("done");
                }}
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-10 min-w-0 flex-1 rounded-sm border border-zinc-600 bg-[#051B2E] px-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#0693e3] focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-10 shrink-0 rounded-sm px-4 text-xs font-bold uppercase tracking-wide text-[#051B2E]"
                  style={{ backgroundColor: DB.gold }}
                >
                  Subscribe
                </button>
              </form>
              {newsletterStatus === "done" ? (
                <p className="mt-2 text-xs text-[#7bdcb5]">Thanks for subscribing!</p>
              ) : null}
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-zinc-700 pt-8 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} The Steward Jamal Agency. All rights reserved.
            </p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs" aria-label="Legal">
              <Link href="/privacy" className="text-zinc-400 transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-zinc-400 transition hover:text-white">
                Terms
              </Link>
            </nav>
            <p className="text-xs text-zinc-500 lg:text-right">
              Web design · Development · SEO · Digital marketing
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
