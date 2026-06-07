"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, MapPin, Phone, Star } from "lucide-react";
import { useState } from "react";
import {
  webDevelopmentFaqs,
  webDevelopmentOfferings,
  webDevelopmentResults,
  webDevelopmentWhyChoose,
} from "@/content/web-development-service";
import {
  DB,
  LANDING_GUTTER,
  SERVICE_NAV,
  SITE_CONTACT,
} from "@/lib/public-site-config";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80";

const testimonials = [
  {
    quote:
      "They built us a stunning website and implemented an SEO strategy that changed everything. Within three months our orders increased dramatically and we started receiving bulk orders from corporate clients across Ghana.",
    name: "Ama Osei",
    role: "Founder",
  },
  {
    quote:
      "They developed a sleek, responsive website and ensured we ranked for industry keywords. Their professionalism and attention to detail were unparalleled.",
    name: "Dr. Kwame Mensah",
    role: "CEO",
  },
] as const;

export function WebDevelopmentServiceView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Page hero + breadcrumb */}
      <section style={{ backgroundColor: DB.sky }} className="border-b border-zinc-200">
        <div className={`${LANDING_GUTTER} py-10 lg:py-12`}>
          <nav className="flex flex-wrap items-center gap-2 text-xs text-zinc-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0693e3]">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services/web-development" className="hover:text-[#0693e3]">
              Service
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-[#051B2E]">Web Development And Design</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold text-[#051B2E] sm:text-4xl lg:text-[2.75rem]">
            Web Development And Design
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
            Web design services in Ghana — custom solutions for growth, sales, and conversions.
          </p>
        </div>
      </section>

      {/* Sidebar + main */}
      <div className={`${LANDING_GUTTER} py-12 lg:py-16`}>
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Consultation</p>
              <a
                href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`}
                className="mt-2 flex items-center gap-2 text-lg font-bold text-[#051B2E] hover:text-[#0693e3]"
              >
                <Phone className="h-5 w-5 shrink-0 text-[#0693e3]" />
                {SITE_CONTACT.phone}
              </a>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#051B2E]">Services</p>
              <nav className="mt-3 flex flex-col gap-1" aria-label="Service categories">
                {SERVICE_NAV.map((item) => {
                  const isActive = item.href === "/services/web-development";
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded px-2 py-2 text-sm transition ${
                        isActive
                          ? "bg-[#DDEDF5] font-semibold text-[#051B2E]"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-[#0693e3]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Want a website?", href: "/#proposal", style: DB.orange },
                { label: "Our office location", href: "/#proposal", style: DB.navy },
                { label: "Book consultation", href: "/#proposal", style: DB.teal },
                { label: "Price estimates", href: "/#pricing", style: DB.gold, darkText: true },
              ].map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className={`inline-flex h-11 items-center justify-center rounded-sm px-4 text-xs font-bold uppercase tracking-wide transition hover:brightness-95 ${
                    btn.darkText ? "text-[#051B2E]" : "text-white"
                  }`}
                  style={{ backgroundColor: btn.style }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 space-y-12">
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="relative aspect-[21/9] min-h-[180px] w-full">
                <Image src={HERO_IMAGE} alt="Web development workspace" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 70vw" priority />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#051B2E] sm:text-2xl">
                  Grow your business and get visibility in just 1 month
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                  At The Steward Jamal Agency, we&apos;re more than web developers—we&apos;re your growth partners.
                  Recognized among the best web development companies in Ghana, we design websites that don&apos;t
                  just look great but deliver measurable results. Whether you want to boost traffic, increase leads,
                  skyrocket conversions, or drive sales, our web design services are crafted for businesses of all
                  sizes.
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold text-[#051B2E] sm:text-2xl">Why choose us?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {webDevelopmentWhyChoose.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-lg border border-zinc-200 bg-[#F1F2F2] p-5"
                  >
                    <h3 className="text-sm font-bold text-[#051B2E]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#DDEDF5] bg-[#DDEDF5]/40 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">
                Custom web development in Accra for unmatched business growth
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#051B2E] sm:text-2xl">
                Web development services in Ghana — drive traffic, conversions, and growth
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                Your website is more than a digital presence—it&apos;s a powerful tool for driving traffic,
                conversions, and sales. We specialize in creating custom websites that are visually stunning and
                optimized for performance and search engines. Whether you&apos;re a startup, SME, or enterprise in
                Accra or beyond, our services are tailored to deliver measurable results.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#051B2E]">The results we deliver</h2>
              <ul className="mt-4 space-y-3">
                {webDevelopmentResults.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-600">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0693e3]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {webDevelopmentOfferings.map((offering) => (
              <section key={offering.id} id={offering.id} className="scroll-mt-24 border-t border-zinc-200 pt-10">
                <h3 className="text-lg font-bold text-[#051B2E] sm:text-xl">{offering.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">{offering.intro}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Key features</p>
                <ul className="mt-3 space-y-2">
                  {offering.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-zinc-600">
                      <span className="text-[#0693e3]">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section id="seo" className="scroll-mt-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-[#051B2E]">Search engine optimization (SEO)</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Every website we build includes foundational SEO—metadata, structured headings, performance
                optimization, and local search signals for Ghana. We combine technical SEO with content strategy so
                your site ranks for the keywords that matter to your business.
              </p>
              <Link href="/#services" className="mt-4 inline-flex text-sm font-semibold text-[#0693e3] hover:underline">
                Explore all services →
              </Link>
            </section>

            {/* Testimonials */}
            <section className="rounded-lg border border-zinc-200 bg-[#F1F2F2] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Customer testimonials</p>
              <h2 className="mt-2 text-xl font-bold text-[#051B2E]">What our customers say?</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-zinc-600">
                <span className="flex text-[#FFCC53]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                Overall rating 4.9 / 5
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {testimonials.map((item) => (
                  <blockquote key={item.name} className="rounded-lg border border-zinc-200 bg-white p-5">
                    <p className="text-sm leading-relaxed text-zinc-600">&ldquo;{item.quote}&rdquo;</p>
                    <footer className="mt-4 border-t border-zinc-100 pt-3">
                      <p className="text-sm font-bold text-[#051B2E]">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.role}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold text-[#051B2E]">Frequently asked questions</h2>
              <div className="mt-6 space-y-2">
                {webDevelopmentFaqs.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <article key={item.q} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                      >
                        <span className="text-sm font-semibold text-[#051B2E]">{item.q}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
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
            </section>

            {/* Contact CTA */}
            <section className="rounded-lg p-6 text-white sm:p-8" style={{ backgroundColor: DB.navy }}>
              <h2 className="text-xl font-bold">Contact with us!</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFCC53]">Address</p>
                  <p className="mt-1 flex items-start gap-2 text-sm text-zinc-200">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {SITE_CONTACT.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFCC53]">Tell</p>
                  <a href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm font-semibold text-white hover:text-[#FFCC53]">
                    {SITE_CONTACT.phone}
                  </a>
                  <a href={`mailto:${SITE_CONTACT.email}`} className="mt-1 block text-sm text-zinc-300 hover:text-white">
                    {SITE_CONTACT.email}
                  </a>
                </div>
              </div>
              <Link
                href="/#proposal"
                className="mt-6 inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-[#051B2E]"
                style={{ backgroundColor: DB.gold }}
              >
                Submit request
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
