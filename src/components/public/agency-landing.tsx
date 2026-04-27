import Link from "next/link";
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
  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#pricing", label: "Pricing" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#proposal", label: "Proposal" },
  ];

  return (
    <main className="bg-[#050b1a] text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050b1a]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-white">The Steward Jamal Agency</p>
          <nav className="hidden items-center gap-5 md:flex">
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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span className="inline-flex rounded-full border border-[#0A66FF]/40 bg-[#0A66FF]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
            Agency Growth Offer Live
          </span>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Launch a modern, high-converting website that grows your business.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Strategy, design, development, and launch support in one team. Fast timelines, clean
            execution, and conversion-focused results.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={isSite ? "/dashboard/websites" : "/signup"}
              className="inline-flex h-11 items-center rounded-lg bg-[#0A66FF] px-6 text-sm font-semibold text-white"
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
          <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Projects Delivered</p>
            <p className="mt-2 text-3xl font-semibold text-white">120+</p>
            <p className="mt-1 text-sm text-zinc-300">Business sites, e-commerce, and custom portals.</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Avg Launch Timeline</p>
            <p className="mt-2 text-3xl font-semibold text-white">3-6 weeks</p>
            <p className="mt-1 text-sm text-zinc-300">Fast shipping without quality compromise.</p>
          </article>
          <article className="rounded-xl border border-[#0A66FF]/35 bg-[#0A66FF]/15 p-5">
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
                <p className="rounded-md border border-white/15 bg-white/5 px-3 py-2">Mobile Money (MTN, Telecel, AT)</p>
                <p className="rounded-md border border-white/15 bg-white/5 px-3 py-2">Card Payment (Visa, Mastercard)</p>
              </div>
              <p className="mt-3 text-xs text-blue-100">Instant processing. Zero hidden transaction charges from us.</p>
            </div>
          </article>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#0A66FF]/30 bg-[#0A66FF]/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Service Packages</p>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-xs">
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-zinc-900">Standard</span>
              <span className="px-3 py-1 text-zinc-300">Priority</span>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-[#081327] p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Starter Website</p>
              <p className="mt-2 text-3xl font-semibold text-white">GH₵4,500</p>
            </article>
            <article className="rounded-xl border border-[#0A66FF]/40 bg-[#0A66FF]/20 p-5">
              <p className="text-xs uppercase tracking-wide text-blue-100">Growth Package</p>
              <p className="mt-2 text-3xl font-semibold text-white">GH₵6,500</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#081327] p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400">Premium Build</p>
              <p className="mt-2 text-3xl font-semibold text-white">GH₵9,000</p>
            </article>
          </div>
        </div>
      </section>

      <section id="portfolio" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {(portfolioItems.length ? portfolioItems : []).slice(0, 3).map((item) => {
            const target = item.domain || item.id;
            return (
              <article key={item.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
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
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-3">
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

      <section id="proposal" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Request Proposal</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Tell us about your project</h2>
          <p className="mt-2 text-sm text-zinc-300">Share your goals, budget, and timeline. We will reply with a clear plan.</p>
          <div className="mt-4">
            <PublicLeadForm />
          </div>
        </div>
      </section>

    </main>
  );
}
