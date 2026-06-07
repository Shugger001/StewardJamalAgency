"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, MapPin, Phone, Star } from "lucide-react";
import { useState } from "react";
import { SERVICE_TESTIMONIALS, type ServicePageContent } from "@/content/services/types";
import { DB, LANDING_GUTTER, SERVICE_NAV, SITE_CONTACT } from "@/lib/public-site-config";

type ServiceDetailViewProps = {
  content: ServicePageContent;
};

export function ServiceDetailView({ content }: ServiceDetailViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
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
            <span className="font-medium text-[#051B2E]">{content.title}</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold text-[#051B2E] sm:text-4xl lg:text-[2.75rem]">{content.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">{content.subtitle}</p>
        </div>
      </section>

      <div className={`${LANDING_GUTTER} py-12 lg:py-16`}>
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Talk to us</p>
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
                  const isActive = item.href === content.href;
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
                { label: "Request a quote", href: "/#proposal", style: DB.orange },
                { label: "Visit our studio", href: "/#proposal", style: DB.navy },
                { label: "Book a call", href: "/#proposal", style: DB.teal },
                { label: "See pricing", href: "/#pricing", style: DB.gold, darkText: true },
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

          <div className="min-w-0 space-y-12">
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="relative aspect-[21/9] min-h-[180px] w-full">
                <Image
                  src={content.heroImage}
                  alt={content.heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  priority
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#051B2E] sm:text-2xl">{content.introTitle}</h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">{content.introBody}</p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold text-[#051B2E] sm:text-2xl">Why clients choose us</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {content.whyChoose.map((item) => (
                  <article key={item.title} className="rounded-lg border border-zinc-200 bg-[#F1F2F2] p-5">
                    <h3 className="text-sm font-bold text-[#051B2E]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#DDEDF5] bg-[#DDEDF5]/40 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">{content.highlightEyebrow}</p>
              <h2 className="mt-2 text-xl font-bold text-[#051B2E] sm:text-2xl">{content.highlightTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">{content.highlightBody}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#051B2E]">Outcomes you can expect</h2>
              <ul className="mt-4 space-y-3">
                {content.results.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-600">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0693e3]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {content.offerings.map((offering) => (
              <section key={offering.id} id={offering.id} className="scroll-mt-24 border-t border-zinc-200 pt-10">
                <h3 className="text-lg font-bold text-[#051B2E] sm:text-xl">{offering.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">{offering.intro}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-500">What&apos;s included</p>
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

            {content.extraSection ? (
              <section
                id={content.extraSection.id}
                className="scroll-mt-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="text-lg font-bold text-[#051B2E]">{content.extraSection.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{content.extraSection.body}</p>
                {content.extraSection.linkHref ? (
                  <Link
                    href={content.extraSection.linkHref}
                    className="mt-4 inline-flex text-sm font-semibold text-[#0693e3] hover:underline"
                  >
                    {content.extraSection.linkLabel ?? "Learn more →"}
                  </Link>
                ) : null}
              </section>
            ) : null}

            <section className="rounded-lg border border-zinc-200 bg-[#F1F2F2] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0693e3]">Client feedback</p>
              <h2 className="mt-2 text-xl font-bold text-[#051B2E]">Recent project reviews</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-zinc-600">
                <span className="flex text-[#FFCC53]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                Average rating 4.9 / 5
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {SERVICE_TESTIMONIALS.map((item) => (
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

            <section>
              <h2 className="text-xl font-bold text-[#051B2E]">Questions we hear often</h2>
              <div className="mt-6 space-y-2">
                {content.faqs.map((item, idx) => {
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

            <section className="rounded-lg p-6 text-white sm:p-8" style={{ backgroundColor: DB.navy }}>
              <h2 className="text-xl font-bold">Get in touch</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFCC53]">Address</p>
                  <p className="mt-1 flex items-start gap-2 text-sm text-zinc-200">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {SITE_CONTACT.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFCC53]">Phone</p>
                  <a
                    href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`}
                    className="mt-1 block text-sm font-semibold text-white hover:text-[#FFCC53]"
                  >
                    {SITE_CONTACT.phone}
                  </a>
                  <a
                    href={`mailto:${SITE_CONTACT.email}`}
                    className="mt-1 block text-sm text-zinc-300 hover:text-white"
                  >
                    {SITE_CONTACT.email}
                  </a>
                </div>
              </div>
              <Link
                href="/#proposal"
                className="mt-6 inline-flex h-11 items-center rounded-sm px-6 text-sm font-bold uppercase tracking-wide text-[#051B2E]"
                style={{ backgroundColor: DB.gold }}
              >
                Send enquiry
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
