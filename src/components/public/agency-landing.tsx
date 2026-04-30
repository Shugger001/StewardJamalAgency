"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicLeadForm } from "@/components/leads/public-lead-form";

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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-white">The Steward Jamal Agency</p>
          <nav className="items-center gap-3 md:flex md:gap-5">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-medium text-zinc-300 hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            href={isSite ? "/dashboard/websites" : "/signup"}
            className="inline-flex h-9 items-center rounded-lg bg-[#0A66FF] px-3 text-xs font-semibold text-white"
          >
            {isSite ? "Open Dashboard" : "Start Project"}
          </Link>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(10,102,255,0.35),transparent_40%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.25),transparent_30%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
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
                href={isSite ? "/dashboard/websites" : "/signup"}
                className="inline-flex h-11 items-center rounded-lg bg-[#0A66FF] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(10,102,255,0.35)]"
              >
                {isSite ? "Open websites dashboard" : "Start your project"}
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

          <div className="agency-reveal-up rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur [animation-delay:120ms]">
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
      </section>

      <section className="border-b border-white/10 bg-[#081327]">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
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

      <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
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

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
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

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
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

      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8">
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

      <section id="portfolio" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8">
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
        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
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

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
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

      <section id="proposal" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8">
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
