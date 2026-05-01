"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicLeadForm } from "@/components/leads/public-lead-form";

/** Hero visual — `public/hero-landing.png` */
const HERO_IMAGE_SRC = "/hero-landing.png";

/** Edge padding only — no max-width / centering so fullscreen uses full width. */
const LANDING_GUTTER = "w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20";

const IMG = {
  bannerGlass:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80",
  strategySession:
    "https://images.unsplash.com/photo-1600880292203-757bb62b3b99?auto=format&fit=crop&w=1600&q=80",
  designDesk:
    "https://images.unsplash.com/photo-1542744095-fcf48d80f0da?auto=format&fit=crop&w=1600&q=80",
  buildLaptop:
    "https://images.unsplash.com/photo-1517694712202-3dd9dd59c102?auto=format&fit=crop&w=1600&q=80",
  uxWhiteboard:
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80",
  launchTeam:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
  portfolioMood:
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2400&q=80",
} as const;

const LANDING_IMAGE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" as const;

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
  const [pricingTier, setPricingTier] = useState<"standard" | "priority">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card">("momo");
  const basePath = isSite ? "/site" : "/";
  const navItems = [
    { href: `${basePath}#services`, label: "Services" },
    { href: `${basePath}#gallery`, label: "Gallery" },
    { href: `${basePath}#pricing`, label: "Pricing" },
    { href: `${basePath}#portfolio`, label: "Portfolio" },
    { href: `${basePath}#proposal`, label: "Proposal" },
  ];

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
    <main className="relative overflow-hidden bg-[#050b1a] text-zinc-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=2200&q=80')",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom_right,rgba(2,6,23,0.9),rgba(2,6,23,0.82),rgba(10,102,255,0.32))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-20 z-0 h-80 w-80 rounded-full bg-[#0A66FF]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-64 z-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
      />
      <div className="relative z-10">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050b1a]/90 backdrop-blur">
        <div className={`${LANDING_GUTTER} flex h-14 items-center justify-between`}>
          <p className="text-sm font-semibold tracking-wide text-white">The Steward Jamal Agency</p>
          <nav className="items-center gap-3 md:flex md:gap-5">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-medium text-zinc-300 hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            href={isSite ? "/dashboard" : "/signup"}
            className="inline-flex h-9 items-center rounded-lg bg-[#0A66FF] px-3 text-xs font-semibold text-white"
          >
            {isSite ? "Open dashboard" : "Start Project"}
          </Link>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(10,102,255,0.35),transparent_40%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.25),transparent_30%)]">
        <div className={`${LANDING_GUTTER} grid gap-8 py-16 lg:grid-cols-[1fr_1.28fr] lg:gap-10 lg:py-24`}>
          <div className="agency-reveal-up">
            <span className="inline-flex rounded-full border border-[#0A66FF]/40 bg-[#0A66FF]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
              Premium Web Experience Studio
            </span>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Launch a luxury-grade website that makes your brand feel world-class.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              We craft polished digital experiences for ambitious service brands that want to look
              premium, build trust, and convert consistently.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={isSite ? "/dashboard" : "/signup"}
                className="inline-flex h-11 items-center rounded-lg bg-[#0A66FF] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(10,102,255,0.35)]"
              >
                {isSite ? "Open agency dashboard" : "Start your project"}
              </Link>
              <Link
                href={isSite ? "/dashboard" : "/site"}
                className="inline-flex h-11 items-center rounded-lg border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/15"
              >
                {isSite ? "Back to dashboard" : "View live previews"}
              </Link>
              {!isSite && (
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center rounded-lg border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Client login
                </Link>
              )}
            </div>
          </div>

          <div className="agency-reveal-up space-y-4 [animation-delay:120ms]">
            <figure className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-100 to-zinc-200/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="relative h-[min(54vh,480px)] w-full p-2 sm:h-[min(60vh,560px)] sm:p-3 lg:h-[min(80vh,860px)] lg:max-h-[min(92vh,960px)] lg:p-4">
                <Image
                  src={HERO_IMAGE_SRC}
                  alt="Need a stunning website — custom creative designs, fast responsive builds, trusted delivery"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-contain object-center"
                />
              </div>
            </figure>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Elite Delivery Snapshot</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-[#0a152d] p-4">
                  <p className="text-xs text-zinc-400">Design Quality</p>
                  <p className="mt-1 text-lg font-semibold text-white">Premium visual system</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0a152d] p-4">
                  <p className="text-xs text-zinc-400">Performance</p>
                  <p className="mt-1 text-lg font-semibold text-white">Fast, responsive, SEO-ready</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0a152d] p-4">
                  <p className="text-xs text-zinc-400">Conversion Focus</p>
                  <p className="mt-1 text-lg font-semibold text-white">Clear offer and trust-driven flow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#081327]">
        <div className={`${LANDING_GUTTER} py-5`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Trusted by growth-focused teams
          </p>
          <div className="agency-marquee-wrap mt-3 overflow-hidden">
            <div className="agency-marquee-track flex w-max gap-2 text-sm text-zinc-300">
              {[...brandLogos, ...brandLogos].map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className={`${LANDING_GUTTER} scroll-mt-20 pb-10`}>
        <div className="agency-reveal-up relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="relative aspect-[5/3] min-h-[220px] w-full sm:aspect-[21/9] sm:min-h-[260px] lg:min-h-[300px]">
            <Image
              src={IMG.bannerGlass}
              alt="Modern glass office tower at dusk representing scale and professionalism"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#050b1a] via-[#050b1a]/75 to-[#050b1a]/20"
            />
            <div className="absolute inset-0 flex max-w-xl flex-col justify-center p-6 sm:p-8 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200">
                Gallery
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2rem]">
                Spaces, systems, and craft—how premium web work actually feels.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">
                A visual snapshot of the environments and focus we bring to every engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className={`${LANDING_GUTTER} scroll-mt-20 py-10`}>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.06]">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Projects Delivered</p>
            <p className="mt-2 text-3xl font-semibold text-white">120+</p>
            <p className="mt-1 text-sm text-zinc-300">Business sites, e-commerce, and custom portals.</p>
          </article>
          <article className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.06] [animation-delay:90ms]">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Avg Launch Timeline</p>
            <p className="mt-2 text-3xl font-semibold text-white">3-6 weeks</p>
            <p className="mt-1 text-sm text-zinc-300">Fast shipping without quality compromise.</p>
          </article>
          <article className="agency-reveal-up rounded-xl border border-[#0A66FF]/35 bg-[#0A66FF]/15 p-5 shadow-[0_10px_35px_rgba(10,102,255,0.25)] [animation-delay:160ms]">
            <p className="text-xs uppercase tracking-wide text-blue-200">Current Offer</p>
            <p className="mt-2 text-3xl font-semibold text-white">Priority slots open</p>
            <p className="mt-1 text-sm text-blue-100">Book now and get faster kickoff support.</p>
          </article>
        </div>
      </section>

      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="agency-reveal-up overflow-hidden rounded-2xl border border-white/10 bg-[#0a152d] shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src={IMG.strategySession}
                alt="Team in a strategy workshop reviewing goals and timelines"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <figcaption className="border-t border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Discovery</p>
              <p className="mt-1 text-sm font-medium text-white sm:text-base">
                Workshops that align stakeholders before a single pixel ships.
              </p>
            </figcaption>
          </figure>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl border border-white/10 bg-[#0a152d] shadow-[0_16px_50px_rgba(0,0,0,0.35)] [animation-delay:90ms]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src={IMG.designDesk}
                alt="Designer workspace with layouts, notes, and creative references"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <figcaption className="border-t border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Design craft</p>
              <p className="mt-1 text-sm font-medium text-white sm:text-base">
                High-fidelity systems, motion, and brand-true UI in every deliverable.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">What you get</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-200">
              <li>- Conversion-focused UX and page structure</li>
              <li>- Responsive build across all devices</li>
              <li>- Basic analytics and SEO setup</li>
              <li>- Launch support and post-launch guidance</li>
            </ul>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Our process</h2>
            <ol className="mt-3 space-y-2 text-sm text-zinc-200">
              <li>1. Discovery and strategy</li>
              <li>2. Wireframes and high-fidelity design</li>
              <li>3. Development and quality testing</li>
              <li>4. Launch and optimization</li>
            </ol>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              Payments-ready checkout
            </h2>
            <div className="mt-3 rounded-xl border border-[#0A66FF]/30 bg-[#0A66FF]/10 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-200">Secure Payment</p>
              <p className="mt-2 text-2xl font-semibold text-white">Order Total: GH₵150.00</p>
              <div className="mt-3 space-y-2 text-xs text-zinc-200">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("momo")}
                  className={`w-full rounded-md border px-3 py-2 text-left transition ${
                    paymentMethod === "momo"
                      ? "border-[#0A66FF]/60 bg-[#0A66FF]/25 text-white"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Mobile Money (MTN, Telecel, AT)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full rounded-md border px-3 py-2 text-left transition ${
                    paymentMethod === "card"
                      ? "border-[#0A66FF]/60 bg-[#0A66FF]/25 text-white"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Card Payment (Visa, Mastercard)
                </button>
              </div>
              <p className="mt-3 text-xs text-blue-100">
                {paymentMethod === "momo"
                  ? "Mobile Money selected. Instant processing with local wallet convenience."
                  : "Card payment selected. Secure checkout with Visa and Mastercard."}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <figure className="agency-reveal-up overflow-hidden rounded-2xl border border-white/10 bg-[#0a152d] shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={IMG.buildLaptop}
                alt="Developer laptop showing application code and components"
                fill
                className="object-cover"
                sizes={LANDING_IMAGE_SIZES}
              />
            </div>
            <figcaption className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Build</p>
              <p className="mt-1 text-sm font-medium text-white">Clean engineering, performance budgets, and QA.</p>
            </figcaption>
          </figure>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl border border-white/10 bg-[#0a152d] shadow-[0_12px_40px_rgba(0,0,0,0.3)] [animation-delay:80ms]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={IMG.uxWhiteboard}
                alt="UX planning with wireframes and sticky notes on a whiteboard"
                fill
                className="object-cover"
                sizes={LANDING_IMAGE_SIZES}
              />
            </div>
            <figcaption className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">UX</p>
              <p className="mt-1 text-sm font-medium text-white">Flows, hierarchy, and conversion clarity.</p>
            </figcaption>
          </figure>
          <figure className="agency-reveal-up overflow-hidden rounded-2xl border border-white/10 bg-[#0a152d] shadow-[0_12px_40px_rgba(0,0,0,0.3)] [animation-delay:160ms]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={IMG.launchTeam}
                alt="Product team collaborating at launch readiness"
                fill
                className="object-cover"
                sizes={LANDING_IMAGE_SIZES}
              />
            </div>
            <figcaption className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Launch</p>
              <p className="mt-1 text-sm font-medium text-white">Go-live support, analytics, and iteration.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="agency-reveal-up rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Why premium brands choose us
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-[#081327] p-4">
              <h3 className="text-sm font-semibold text-white">Brand-first design</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Distinct visual identity that positions you above commodity competitors.
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#081327] p-4">
              <h3 className="text-sm font-semibold text-white">Executive clarity</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Structured communication, milestone visibility, and predictable delivery.
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#081327] p-4">
              <h3 className="text-sm font-semibold text-white">Business outcomes</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Every page and flow is designed to build trust and drive measurable actions.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="pricing" className={`${LANDING_GUTTER} scroll-mt-20 pb-10`}>
        <div className="agency-reveal-up rounded-2xl border border-[#0A66FF]/30 bg-[#0A66FF]/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Service Packages</p>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-xs">
              <button
                type="button"
                onClick={() => handleTierChange("standard")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  pricingTier === "standard"
                    ? "bg-white text-zinc-900"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => handleTierChange("priority")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  pricingTier === "priority"
                    ? "bg-white text-zinc-900"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                Priority
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-[#081327] p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Starter Website</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {pricingTier === "priority" ? "GH₵5,500" : "GH₵4,500"}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {pricingTier === "priority"
                  ? "Includes priority slot + faster first draft turnaround."
                  : "Ideal for lean brands that need premium fundamentals."}
              </p>
            </article>
            <article className="rounded-xl border border-[#0A66FF]/40 bg-[#0A66FF]/20 p-5">
              <p className="text-xs uppercase tracking-wide text-blue-100">Growth Package</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {pricingTier === "priority" ? "GH₵7,500" : "GH₵6,500"}
              </p>
              <p className="mt-2 text-xs text-blue-100">
                {pricingTier === "priority"
                  ? "Priority support, weekly review calls, and faster launch queue."
                  : "Most selected for scaling service teams."}
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#081327] p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Premium Build</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {pricingTier === "priority" ? "GH₵10,500" : "GH₵9,000"}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {pricingTier === "priority"
                  ? "White-glove delivery with top-priority production and support."
                  : "For high-ticket offers and advanced digital workflows."}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="agency-reveal-up relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
          <div className="relative aspect-[5/2] min-h-[200px] w-full sm:min-h-[240px] lg:aspect-[2.8/1] lg:min-h-[280px]">
            <Image
              src={IMG.portfolioMood}
              alt="Bright modern studio space where digital products are refined before handoff"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#050b1a]/92 via-[#050b1a]/35 to-transparent"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                Before you scroll the grid
              </p>
              <p className="mt-2 max-w-2xl text-lg font-semibold text-white sm:text-xl">
                Every preview below is built with the same production rigor we apply to client launches.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className={`${LANDING_GUTTER} scroll-mt-20 pb-10`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(portfolioItems.length ? portfolioItems : []).map((item) => {
            const target = item.domain || item.id;
            return (
              <article key={item.id} className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-wide text-zinc-400">
                  {item.status === "published" ? "Live Project" : "In Progress"}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-zinc-300">{item.clientName}</p>
                <Link href={`/sites/${target}`} className="mt-4 inline-block text-sm font-semibold text-blue-300 hover:underline">
                  View project preview
                </Link>
              </article>
            );
          })}
          {!portfolioItems.length && (
            <article className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-3">
              <p className="text-sm text-zinc-300">
                Portfolio previews will appear here as soon as websites are published from dashboard.
              </p>
            </article>
          )}
        </div>
      </section>

      {isSite && previewTargets.length > 0 && (
        <section className={`${LANDING_GUTTER} pb-10`}>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Available preview links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {previewTargets.slice(0, 6).map((target) => (
                <Link
                  key={target}
                  href={`/sites/${target}`}
                  className="inline-flex h-9 items-center rounded-md border border-white/20 bg-white/5 px-3 text-xs font-medium text-zinc-100 hover:bg-white/10"
                >
                  /sites/{target}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${LANDING_GUTTER} pb-10`}>
        <div className="grid gap-4 lg:grid-cols-3">
          <blockquote className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-zinc-200">
            "The final website positioned us like a top-tier brand from day one."
            <footer className="mt-3 text-xs font-medium text-zinc-400">— Ama Mensah, Founder</footer>
          </blockquote>
          <blockquote className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-zinc-200 [animation-delay:90ms]">
            "Clean design, sharp execution, and client communication at a very high standard."
            <footer className="mt-3 text-xs font-medium text-zinc-400">— Kojo Boateng, Director</footer>
          </blockquote>
          <blockquote className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-zinc-200 [animation-delay:160ms]">
            "They didn’t just build pages; they built a proper conversion journey."
            <footer className="mt-3 text-xs font-medium text-zinc-400">— Ruth Mensah, Program Lead</footer>
          </blockquote>
        </div>
      </section>

      <section id="proposal" className={`${LANDING_GUTTER} scroll-mt-20 pb-10`}>
        <div className="agency-reveal-up rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Request Proposal</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Tell us about your project</h2>
          <p className="mt-2 text-sm text-zinc-300">Share your goals, budget, and timeline. We will reply with a clear plan.</p>
          <div className="mt-4">
            <PublicLeadForm />
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
