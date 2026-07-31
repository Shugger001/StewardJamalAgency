import Link from "next/link";
import type { Metadata } from "next";
import { PublicChrome } from "@/components/public/public-chrome";
import { digitalMarketingPage } from "@/content/services/digital-marketing";
import { ecommercePage } from "@/content/services/ecommerce";
import { seoPage } from "@/content/services/seo";
import { webDevelopmentPage } from "@/content/services/web-development";
import { DB, LANDING_GUTTER } from "@/lib/public-site-config";

const allServices = [webDevelopmentPage, ecommercePage, seoPage, digitalMarketingPage];

export const metadata: Metadata = {
  title: "Services",
  description: "Website design, e-commerce, SEO, and digital marketing services for businesses in Ghana.",
};

export default function ServicesIndexPage() {
  return (
    <PublicChrome>
      <section className="relative overflow-hidden border-b border-zinc-200" style={{ backgroundColor: DB.navy }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(24,96,240,0.45), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(255,204,83,0.12), transparent 50%)",
          }}
        />
        <div className={`${LANDING_GUTTER} relative py-14 lg:py-20`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFCC53]">Services</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem]">
            Web, commerce, search, and campaigns, built for Ghanaian businesses
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Clear scope, mobile-first delivery, and a path to enquiries or sales. Pick a service to see what&apos;s
            included, or get a quote if you already know what you need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-[#182635] transition hover:brightness-95"
              style={{ backgroundColor: DB.gold }}
            >
              Get a quote
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center rounded-sm border border-white/30 px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
      <div className={`${LANDING_GUTTER} py-12 lg:py-16`}>
        <div className="grid gap-5 sm:grid-cols-2">
          {allServices.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-[#1860F0]/40 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-[#182635] group-hover:text-[#1860F0]">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{service.subtitle}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#1860F0]">View details →</span>
            </Link>
          ))}
        </div>
      </div>
    </PublicChrome>
  );
}
