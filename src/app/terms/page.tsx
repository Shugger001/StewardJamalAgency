import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms governing use of The Steward Jamal Agency website and introductory engagements.",
};

export default function TermsPage() {
  return (
    <main className="agency-landing min-h-screen bg-white px-4 py-14 text-zinc-700 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-medium text-[#0693e3] hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-[#051B2E] sm:text-3xl">Terms of use</h1>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600">
          By accessing this website, you agree to these terms. Formal client work is governed by separate
          statements of work or service agreements signed with The Steward Jamal Agency.
        </p>
        <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-[#051B2E]">Use of the site</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          You may browse this site for lawful purposes. Do not attempt to disrupt the service, scrape content
          in ways that violate our systems, or misrepresent your affiliation with our agency.
        </p>
        <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-[#051B2E]">Proposals & payments</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Pricing shown on this site is indicative unless confirmed in writing. Deposits and milestone payments
          are processed through approved payment providers. Refund terms depend on the signed engagement.
        </p>
        <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-[#051B2E]">Intellectual property</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Site content, branding, and marketing materials remain our property unless otherwise assigned in a
          client contract. Client deliverables transfer according to the signed agreement.
        </p>
        <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-[#051B2E]">Limitation of liability</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          This website is provided as-is for marketing and informational purposes. We do not guarantee
          uninterrupted availability and are not liable for indirect damages arising from use of the site.
        </p>
        <p className="mt-12 text-xs text-zinc-500">
          Last updated: June 2026. Replace this page with counsel-reviewed copy before high-compliance launches.
        </p>
      </div>
    </main>
  );
}
