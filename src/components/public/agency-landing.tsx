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
  Menu,
  Megaphone,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { PublicLeadForm } from "@/components/leads/public-lead-form";
import { blogPosts } from "@/content/blog-posts";

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
    eyebrow: "Best Web Development Company in Ghana",
    title: "Results you can measure",
    body: "From stunning designs to powerful features, we build websites tailored to maximize your ROI and elevate your online presence.",
    image: HERO_IMAGE_SRC,
  },
  {
    eyebrow: "The Steward Jamal Agency",
    title: "Get websites that rank higher and sell more",
    body: "Our SEO-optimized websites not only look great but deliver measurable results—higher rankings, increased leads, and more revenue.",
    image: IMG.buildLaptop,
  },
  {
    eyebrow: "Top Web Design Services in Ghana",
    title: "Increase your sales with premium digital experiences",
    body: "We craft visually stunning, user-friendly websites designed to drive traffic, boost conversions, and grow your business.",
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
    body: "Advanced SEO strategies integrated into every project—from keyword research to on-page optimization and technical SEO.",
    icon: Search,
  },
  {
    num: "02",
    title: "E-Commerce Development",
    body: "Powerful online stores with intuitive product pages and seamless checkout experiences that maximize online sales.",
    icon: ShoppingCart,
  },
  {
    num: "03",
    title: "Custom Web Applications",
    body: "Scalable portals, dashboards, and SaaS-style platforms built for growth-minded teams across Ghana.",
    icon: Globe,
  },
  {
    num: "04",
    title: "Digital Marketing & PPC",
    body: "Campaigns engineered for tangible outcomes—more leads, sales, and customer engagement in Accra and beyond.",
    icon: Megaphone,
  },
  {
    num: "05",
    title: "Web Development & Design",
    body: "High-conversion platforms designed to generate leads and drive sales with brand-true visual systems.",
    icon: Sparkles,
  },
];

const whyChooseUs = [
  {
    title: "Results-Driven Web Design",
    body: "Designs optimized to attract visitors, engage them, and turn them into loyal customers.",
    icon: Zap,
  },
  {
    title: "Boosted Traffic & Visibility",
    body: "SEO-focused development so your audience finds you in Ghana and beyond.",
    icon: BarChart3,
  },
  {
    title: "High-Impact Conversions",
    body: "Clear CTAs and user-friendly layouts that increase sales, leads, and engagement.",
    icon: Star,
  },
  {
    title: "Custom Solutions for Every Industry",
    body: "Tailored web solutions for startups and established brands with long-term success in mind.",
    icon: Globe,
  },
] as const;

const faqItems = [
  {
    q: "How long does a typical website project take?",
    a: "Most business websites launch in 3–6 weeks depending on scope, content readiness, and revision rounds.",
  },
  {
    q: "Do you offer SEO with every website?",
    a: "Yes. We integrate foundational SEO—metadata, structure, performance, and analytics—into every build.",
  },
  {
    q: "Can I pay with Mobile Money or card?",
    a: "Absolutely. We support MTN MoMo, Telecel, AT, and card payments for deposits and milestone billing.",
  },
  {
    q: "Do you provide updates after launch?",
    a: "Yes. We offer post-launch support, content updates, and optimization packages for ongoing growth.",
  },
] as const;

const testimonials = [
  {
    quote:
      "The Steward Jamal Agency built us a stunning website and implemented an SEO strategy that changed everything for our bakery. Within three months, our orders increased by 300%, and we started receiving bulk orders from corporate clients across Ghana. Their team didn't just create a site; they created a platform that turned us into a household name.",
    name: "Ama Osei",
    role: "Founder",
  },
  {
    quote:
      "Partnering with The Steward Jamal Agency was a game-changer for our company. They developed a sleek, responsive website that showcased our operations across multiple countries. Their SEO expertise ensured we ranked at the top for industry-related keywords, significantly increasing our visibility to international clients.",
    name: "Dr. Kwame Mensah",
    role: "CEO",
  },
  {
    quote:
      "They helped us redefine how we engage with our customers online. They designed an interactive customer portal and implemented a digital strategy that improved user experience dramatically. Within three months, we saw a 45% increase in customer satisfaction scores and a 60% rise in self-service transactions.",
    name: "Angela Boadu",
    role: "Head of Digital Strategy",
  },
  {
    quote:
      "Our collaboration was pivotal in streamlining our online operations. They created a secure, user-friendly interface that allowed our clients to access services seamlessly. Additionally, their tailored SEO campaigns attracted thousands of new sign-ups. Their ability to merge technical expertise with business objectives was truly exceptional.",
    name: "Samuel Upton",
    role: "CTO",
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
    title: "Boost your online presence in 3 months",
    body: "We provide quick digital marketing solutions to 3X your monthly recurring revenue.",
    icon: TrendingUp,
  },
  {
    title: "Constant updates and support",
    body: "Post-launch maintenance, content updates, and optimization so your site stays fresh.",
    icon: RefreshCw,
  },
  {
    title: "Affordable + high conversions",
    body: "Outstanding web development services that give you value for your money.",
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

export function AgencyLanding({ mode, portfolioItems, previewTargets = [] }: AgencyLandingProps) {
  const isSite = mode === "site";
  const [navOpen, setNavOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "done">("idle");
  const [pricingTier, setPricingTier] = useState<"standard" | "priority">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card">("momo");
  const basePath = isSite ? "/site" : "/";
  const navItems = [
    { href: basePath, label: "Home" },
    { href: `${basePath}#about`, label: "About Us" },
    { href: "/services", label: "Service" },
    { href: `${basePath}#portfolio`, label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: `${basePath}#proposal`, label: "Contact Us" },
  ];

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
    const timer = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

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
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleInPageAnchorClick(e, item.href)}
                className="text-sm font-medium text-zinc-700 transition hover:text-[#0693e3]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href={isSite ? "/dashboard" : "/signup"}
              className="hidden h-10 items-center rounded-sm px-5 text-sm font-bold uppercase tracking-wide text-[#051B2E] shadow-sm transition hover:brightness-95 sm:inline-flex"
              style={{ backgroundColor: DB.gold }}
            >
              {isSite ? "Dashboard" : "Get Started Now"}
            </Link>
            <div className="relative md:hidden">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                aria-expanded={navOpen}
                aria-controls="landing-mobile-nav"
                aria-label={navOpen ? "Close menu" : "Open menu"}
                onClick={() => setNavOpen((o) => !o)}
              >
                {navOpen ? <X className="h-4 w-4" strokeWidth={2} /> : <Menu className="h-4 w-4" strokeWidth={2} />}
              </button>
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
                    className="fixed left-0 right-0 top-[4.5rem] z-50 border-b border-zinc-200 bg-white px-4 py-3 shadow-lg md:hidden"
                  >
                    <nav className="flex flex-col gap-0.5" aria-label="Page sections">
                      {navItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                          onClick={(e) => {
                            handleInPageAnchorClick(e, item.href);
                            setNavOpen(false);
                          }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Hero carousel — full-bleed with crossfading backgrounds */}
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
          <div className="relative max-w-3xl pb-14">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.title}
                className={`agency-hero-slide ${idx === heroIndex ? "is-active relative" : "absolute inset-0"}`}
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
                    View All Our Service
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
          <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Let us help your business grow!</p>
          {FOOTER_CONTACT_PHONE ? (
            <p className="mt-2 text-sm font-semibold text-[#051B2E]">
              Quick Call:{" "}
              <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="text-[#0693e3] hover:underline">
                {FOOTER_CONTACT_PHONE}
              </a>
            </p>
          ) : (
            <a
              href={`${basePath}#proposal`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#proposal`)}
              className="mt-2 inline-block text-sm font-semibold text-[#0693e3] hover:underline"
            >
              Request a free quote →
            </a>
          )}
        </aside>
      </section>

      {/* Quick CTA strip */}
      <section style={{ backgroundColor: DB.teal }} className="text-white">
        <div className={`${LANDING_GUTTER} flex flex-wrap items-center justify-between gap-3 py-3.5`}>
          <p className="text-sm font-semibold sm:text-base">Let us help your business grow!</p>
          {FOOTER_CONTACT_PHONE ? (
            <a href={`tel:${FOOTER_CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Quick Call: {FOOTER_CONTACT_PHONE}
            </a>
          ) : (
            <a
              href={`${basePath}#proposal`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#proposal`)}
              className="text-sm font-medium underline-offset-2 hover:underline"
            >
              Request a free quote →
            </a>
          )}
        </div>
      </section>

      {/* Intro + split feature rows */}
      <section id="about" className="scroll-mt-24 py-14 lg:py-20" style={{ backgroundColor: DB.skyLight }}>
        <div className={`${LANDING_GUTTER} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <div className="agency-reveal-up">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">The Steward Jamal Agency</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl" style={{ color: DB.navy }}>
              Top-rated web development services in Ghana for business growth
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Your website should be more than a digital presence—it should drive measurable growth. We specialize in{" "}
              <strong>custom web development in Ghana</strong>, focusing on high-performance, SEO-optimized websites that
              attract visitors, convert leads, and boost sales. Whether you&apos;re a startup in Accra or a corporate
              brand in Kumasi, we build tools to fuel your success.
            </p>
            <Link
              href={`${basePath}#proposal`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#proposal`)}
              className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: DB.orange }}
            >
              Get A Quote
            </Link>
          </div>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[4/3] w-full">
              <Image src={IMG.strategySession} alt="Strategy and discovery session" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className={`${LANDING_GUTTER} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <figure className="agency-reveal-up order-2 overflow-hidden rounded-2xl shadow-lg lg:order-1">
            <div className="relative aspect-[4/3] w-full">
              <Image src={IMG.designDesk} alt="Web design and development workspace" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
          <div className="agency-reveal-up order-1 lg:order-2">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">
              Results-driven SEO services in Accra and Ghana
            </p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              Maximum visibility for your brand
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Don&apos;t just exist online—thrive. Our SEO services are engineered to help businesses dominate search
              results and reach their target audience with organic traffic, qualified leads, and consistent growth.
            </p>
            <a
              href={`${basePath}#services`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#services`)}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0693e3] hover:underline"
            >
              Learn more about our SEO services
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20" style={{ backgroundColor: DB.sky }}>
        <div className={`${LANDING_GUTTER} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <div className="agency-reveal-up">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">
              Digital marketing services in Ghana
            </p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              Campaigns that drive real results
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Marketing isn&apos;t just about being seen—it&apos;s about delivering results. Our digital marketing
              solutions create tangible outcomes like more leads, sales, and customer engagement across Ghana.
            </p>
            <Link
              href={isSite ? "/dashboard" : "/signup"}
              className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-[#051B2E] transition hover:brightness-95"
              style={{ backgroundColor: DB.gold }}
            >
              Start Your Project
            </Link>
          </div>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[4/3] w-full">
              <Image src={IMG.buildLaptop} alt="Digital marketing and analytics dashboard" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
        </div>
      </section>

      {/* Client logos */}
      <section className="border-y border-zinc-200 bg-white py-8">
        <div className={LANDING_GUTTER}>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">Some of our clients</p>
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

      {/* Services — Doctor Barns service-page style preview */}
      <section id="services" className={`${LANDING_GUTTER} scroll-mt-20 py-14 lg:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Consultation</p>
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
                Want a website?
              </Link>
              <Link href="/services/web-development" className="inline-flex h-10 items-center justify-center rounded-sm px-4 text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: DB.navy }}>
                View full service page
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">
              Tailored services designed to boost your online visibility
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl" style={{ color: DB.navy }}>
              Best web design company in Ghana | Web development | SEO | E-Commerce
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              We craft custom websites, SEO-optimized designs, and digital marketing solutions that drive traffic,
              conversions, and sales—whether you need a responsive site, e-commerce platform, or brand refresh.
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
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-10 text-center lg:text-left">
              <p className="text-lg font-semibold" style={{ color: DB.navy }}>
                You need a website that converts?
              </p>
              <Link
                href="/services/web-development"
                className="mt-3 inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: DB.navy }}
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: DB.skyLight }}>
        <div className={LANDING_GUTTER}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0693e3]">Why partner with us?</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              We deliver results that drive growth for your business
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              In today&apos;s competitive digital landscape, your website is your most powerful tool to generate leads,
              increase traffic, and drive conversions.
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
            <a
              href={`${basePath}#about`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#about`)}
              className="inline-flex h-11 items-center rounded-sm border border-[#051B2E] px-6 text-sm font-bold uppercase tracking-wide text-[#051B2E] transition hover:bg-[#051B2E] hover:text-white"
            >
              More Why Choose Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section style={{ backgroundColor: DB.navy }} className="py-14 text-white lg:py-16">
        <div className={`${LANDING_GUTTER} grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center`}>
          <div className="text-center lg:text-left">
            <p className="text-5xl font-bold text-[#FFCC53]">10+</p>
            <p className="mt-1 text-sm uppercase tracking-wider text-zinc-300">Years experience</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">Revenue generating service</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Worked with over 120+ businesses with remarkable results</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Our goal is to make sure businesses flourish online, gaining more sales and visibility.
            </p>
            <Link
              href={isSite ? "/dashboard" : "/signup"}
              className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-[#051B2E]"
              style={{ backgroundColor: DB.gold }}
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 lg:py-16" style={{ backgroundColor: DB.sky }}>
        <div className={LANDING_GUTTER}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">
              People who are always dedicated to make your online presence explode
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Meet our team of professional developers
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
                Discovery, design, build, and launch—done with precision
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { img: IMG.strategySession, label: "Discovery", text: "Workshops that align stakeholders before design begins." },
            { img: IMG.uxWhiteboard, label: "Design & UX", text: "Flows, hierarchy, and conversion clarity." },
            { img: IMG.launchTeam, label: "Launch", text: "Go-live support, analytics, and iteration." },
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

      {/* Quick stats row */}
      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Projects delivered</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
              120+
            </p>
            <p className="mt-1 text-sm text-zinc-600">Business sites, e-commerce, and custom portals.</p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Avg launch timeline</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
              3–6 weeks
            </p>
            <p className="mt-1 text-sm text-zinc-600">Fast shipping without quality compromise.</p>
          </article>
          <article
            className="rounded-2xl border border-[#FFCC53]/50 p-5 shadow-sm"
            style={{ backgroundColor: "#FCDA8A33" }}
          >
            <p className="text-xs uppercase tracking-wide text-[#051B2E]">Current offer</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: DB.navy }}>
              Priority slots open
            </p>
            <p className="mt-1 text-sm text-zinc-700">Book now and get faster kickoff support.</p>
          </article>
        </div>
      </section>

      {/* Pricing value props — Doctor Barns style */}
      <section className="py-12" style={{ backgroundColor: DB.sky }}>
        <div className={LANDING_GUTTER}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              Affordable + high conversions and sales
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              We provide the most outstanding web development services that give you value for your money.
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
              href={`${basePath}#pricing`}
              onClick={(e) => handleInPageAnchorClick(e, `${basePath}#pricing`)}
              className="inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: DB.orange }}
            >
              See Pricing Plans
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`${LANDING_GUTTER} scroll-mt-20 pb-14`}>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0693e3]">Affordable + high conversions</p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
                Service packages that give you value for your money
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
                    ? "Includes priority slot + faster first draft turnaround."
                    : "Ideal for lean brands that need premium fundamentals.",
                featured: false,
              },
              {
                name: "Growth Package",
                price: pricingTier === "priority" ? "GH₵7,500" : "GH₵6,500",
                note:
                  pricingTier === "priority"
                    ? "Priority support, weekly review calls, and faster launch queue."
                    : "Most selected for scaling service teams.",
                featured: true,
              },
              {
                name: "Premium Build",
                price: pricingTier === "priority" ? "GH₵10,500" : "GH₵9,000",
                note:
                  pricingTier === "priority"
                    ? "White-glove delivery with top-priority production and support."
                    : "For high-ticket offers and advanced digital workflows.",
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
                What you get
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>• Conversion-focused UX and page structure</li>
                <li>• Responsive build across all devices</li>
                <li>• Basic analytics and SEO setup</li>
                <li>• Launch support and post-launch guidance</li>
              </ul>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-sm font-bold" style={{ color: DB.navy }}>
                Secure checkout preview
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

      {/* Portfolio */}
      <section id="portfolio" className="py-14 lg:py-16" style={{ backgroundColor: DB.skyLight }}>
        <div className={LANDING_GUTTER}>
          <div className="agency-reveal-up relative mb-8 overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[5/2] min-h-[180px] w-full">
              <Image src={IMG.portfolioMood} alt="Portfolio showcase" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051B2E]/90 via-[#051B2E]/40 to-transparent" />
              <div className="absolute bottom-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">Portfolio</p>
                <p className="mt-1 max-w-xl text-lg font-bold text-white sm:text-xl">
                  Every preview is built with the same production rigor we apply to client launches.
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
                    {item.status === "published" ? "Live project" : "In progress"}
                  </p>
                  <h3 className="mt-2 text-lg font-bold" style={{ color: DB.navy }}>
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{item.clientName}</p>
                  <Link
                    href={`/sites/${target}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0693e3] hover:underline"
                  >
                    View project preview <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
            {!portfolioItems.length && (
              <article className="agency-reveal-up rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-3">
                <p className="text-sm text-zinc-600">
                  Portfolio previews will appear here as soon as websites are published from the dashboard.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

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

      {/* FAQ */}
      <section id="faq" className={`${LANDING_GUTTER} scroll-mt-20 pb-14`}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Common questions about web development, pricing, timelines, and support.
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
              View All Questions
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials carousel */}
      <section className="py-14 lg:py-16" style={{ backgroundColor: DB.skyLight }}>
        <div className={LANDING_GUTTER}>
          <div className="text-center">
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">Customer testimonials</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              What our customers say?
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-600">
              <span className="flex text-[#FFCC53]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              Overall rating 4.9 / 5
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

      {/* Blog / insights */}
      <section id="blog" className={`${LANDING_GUTTER} scroll-mt-20 pb-14`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="agency-section-eyebrow text-xs font-semibold text-[#0693e3]">Read our latest news</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: DB.navy }}>
              Featured blogs and insights
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
                    Continue Reading <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Discount CTA */}
      <section style={{ backgroundColor: "#FCDA8A" }} className="py-10">
        <div className={`${LANDING_GUTTER} flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#051B2E]">We make websites that bring customers</p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: DB.navy }}>
              10% discount for new projects this month!
            </h2>
          </div>
          <Link
            href={`${basePath}#proposal`}
            onClick={(e) => handleInPageAnchorClick(e, `${basePath}#proposal`)}
            className="inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: DB.orange }}
          >
            Claim Offer
          </Link>
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ backgroundColor: DB.navy }} className="py-12 text-white">
        <div className={`${LANDING_GUTTER} flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FFCC53]">We make websites that bring customers</p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">Begin your journey with The Steward Jamal Agency</h2>
            <p className="mt-2 text-sm text-zinc-300">Get your website designed by industry experts.</p>
          </div>
          <Link
            href={isSite ? "/dashboard" : "/signup"}
            className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-[#051B2E]"
            style={{ backgroundColor: DB.gold }}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Contact / proposal */}
      <section id="proposal" className={`${LANDING_GUTTER} scroll-mt-20 py-14 lg:py-16`}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-xl font-bold" style={{ color: DB.navy }}>
              Contact with us!
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
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tell</p>
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
              What are your needs?
            </p>
            <div className="mt-4">
              <PublicLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer contact strip — Doctor Barns style */}
      <section style={{ backgroundColor: DB.sky }} className="border-y border-zinc-200 py-10">
        <div className={`${LANDING_GUTTER} grid gap-8 md:grid-cols-2`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Address of The Steward Jamal Agency</p>
            <p className="mt-2 text-sm text-zinc-700">{FOOTER_ADDRESS}</p>
            <p className="mt-1 text-sm text-zinc-600">Opening hours: 8:00am – 5:00pm</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Contact us</p>
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

      <footer className="border-t border-zinc-800 text-zinc-300" style={{ backgroundColor: DB.navyMid }} aria-label="Site footer">
        <div className={`${LANDING_GUTTER} py-10 lg:py-12`}>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            <div>
              <p className="text-sm font-bold text-white">The Steward Jamal Agency</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                Custom websites, SEO, and digital marketing solutions for Ghanaian businesses ready to grow online.
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
                  <a
                    key={item.num}
                    href={`${basePath}#services`}
                    onClick={(e) => handleInPageAnchorClick(e, `${basePath}#services`)}
                    className="text-sm text-zinc-300 transition hover:text-white"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Explore</p>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer sections">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleInPageAnchorClick(e, item.href)}
                    className="text-sm text-zinc-300 transition hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Subscribe newsletter</p>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Sign up to follow the latest news and events. We promise not to spam your inbox.
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
