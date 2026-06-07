"use client";

import Link from "next/link";
import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DB,
  LANDING_GUTTER,
  PUBLIC_NAV,
  SITE_CONTACT,
} from "@/lib/public-site-config";

type PublicChromeProps = {
  children: React.ReactNode;
};

export function PublicChrome({ children }: PublicChromeProps) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <div className="agency-landing min-h-screen bg-white text-zinc-900">
      <div className="hidden border-b border-zinc-200 lg:block" style={{ backgroundColor: DB.skyLight }}>
        <div className={`${LANDING_GUTTER} flex h-10 items-center justify-between text-xs text-zinc-600`}>
          <div className="flex items-center gap-5">
            <span className="font-semibold uppercase tracking-wider text-[#0693e3]">Contact</span>
            <a
              href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:text-[#051B2E]"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Us: {SITE_CONTACT.phone}
            </a>
            <a
              href={`mailto:${SITE_CONTACT.email}`}
              className="inline-flex items-center gap-1.5 hover:text-[#051B2E]"
            >
              <Mail className="h-3.5 w-3.5" />
              {SITE_CONTACT.email}
            </a>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {SITE_CONTACT.address}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
        <div className={`${LANDING_GUTTER} flex h-[4.5rem] items-center gap-3`}>
          <Link href="/" className="min-w-0 shrink-0 truncate text-base font-bold tracking-tight" style={{ color: DB.navy }}>
            The Steward Jamal Agency
          </Link>
          <nav className="hidden flex-1 justify-center gap-6 xl:flex" aria-label="Main navigation">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-700 transition hover:text-[#0693e3]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/signup"
              className="hidden h-10 items-center rounded-sm px-5 text-sm font-bold uppercase tracking-wide text-[#051B2E] shadow-sm transition hover:brightness-95 sm:inline-flex"
              style={{ backgroundColor: DB.gold }}
            >
              Get Started Now
            </Link>
            <div className="relative xl:hidden">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                aria-expanded={navOpen}
                aria-label={navOpen ? "Close menu" : "Open menu"}
                onClick={() => setNavOpen((o) => !o)}
              >
                {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              {navOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40"
                    aria-label="Close menu"
                    onClick={() => setNavOpen(false)}
                  />
                  <div className="fixed left-0 right-0 top-[4.5rem] z-50 border-b border-zinc-200 bg-white px-4 py-3 shadow-lg">
                    <nav className="flex flex-col gap-0.5">
                      {PUBLIC_NAV.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                          onClick={() => setNavOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-zinc-800 text-zinc-300" style={{ backgroundColor: DB.navyMid }} aria-label="Site footer">
        <div className={`${LANDING_GUTTER} py-10 lg:py-12`}>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div>
              <p className="text-sm font-bold text-white">The Steward Jamal Agency</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                Custom websites, SEO, and digital marketing for Ghanaian businesses that want a stronger online presence.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Services</p>
              <nav className="mt-4 flex flex-col gap-2.5">
                <Link href="/services/web-development" className="text-sm text-zinc-300 hover:text-white">
                  Web Development
                </Link>
                <Link href="/services/ecommerce" className="text-sm text-zinc-300 hover:text-white">
                  e-Commerce Development
                </Link>
                <Link href="/services/seo" className="text-sm text-zinc-300 hover:text-white">
                  Search Engine Optimization
                </Link>
                <Link href="/services/digital-marketing" className="text-sm text-zinc-300 hover:text-white">
                  Digital Marketing
                </Link>
              </nav>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Contact</p>
              <p className="mt-4 text-sm text-zinc-400">{SITE_CONTACT.address}</p>
              <a href={`mailto:${SITE_CONTACT.email}`} className="mt-2 block text-sm text-zinc-300 hover:text-white">
                {SITE_CONTACT.email}
              </a>
              <a href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`} className="mt-2 block text-sm text-zinc-300 hover:text-white">
                {SITE_CONTACT.phone}
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Working time</p>
              <p className="mt-4 text-sm text-zinc-400">{SITE_CONTACT.hours}</p>
              <Link href="/#proposal" className="mt-4 inline-block text-sm font-semibold text-[#FFCC53] hover:underline">
                Request a proposal →
              </Link>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-zinc-700 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} The Steward Jamal Agency. All rights reserved.
            </p>
            <nav className="flex gap-5 text-xs">
              <Link href="/privacy" className="text-zinc-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-zinc-400 hover:text-white">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
