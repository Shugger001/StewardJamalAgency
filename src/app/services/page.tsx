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
  title: "Our Services",
  description: "Web development, e-commerce, SEO, and digital marketing for businesses in Accra and across Ghana.",
};

export default function ServicesIndexPage() {
  return (
    <PublicChrome>
      <section style={{ backgroundColor: DB.sky }} className="border-b border-zinc-200">
        <div className={`${LANDING_GUTTER} py-10 lg:py-12`}>
          <h1 className="text-3xl font-bold text-[#051B2E] sm:text-4xl">Our services</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
            Design, build, and growth services to help your brand get found online and turn traffic into enquiries.
          </p>
        </div>
      </section>
      <div className={`${LANDING_GUTTER} py-12 lg:py-16`}>
        <div className="grid gap-5 sm:grid-cols-2">
          {allServices.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-[#0693e3]/40 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-[#051B2E] group-hover:text-[#0693e3]">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{service.subtitle}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#0693e3]">Learn more →</span>
            </Link>
          ))}
        </div>
      </div>
    </PublicChrome>
  );
}
