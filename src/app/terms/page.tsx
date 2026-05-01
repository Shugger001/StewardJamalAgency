import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms governing use of The Steward Jamal Agency website and introductory engagements.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050b1a] px-4 py-14 text-zinc-200 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-medium text-blue-300 hover:text-blue-200 hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Terms of use
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          By accessing this website, you agree to these terms. Formal client work is governed by separate
          statements of work, contracts, or invoices—those instruments control deliverables, fees, and
          intellectual property for paid engagements.
        </p>
        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Website content
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Materials on this site are provided for general information. We may update copy, imagery, or
          structure without notice. Portfolio previews and sample metrics may be illustrative unless labeled
          otherwise.
        </p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Acceptable use
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Do not attempt to disrupt the site, probe systems without authorization, scrape data at abusive
          volume, or misuse forms and APIs. We may suspend access where abuse is detected.
        </p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Limitation of liability
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          To the fullest extent permitted by law, we are not liable for indirect or consequential damages
          arising from use of this website. Nothing here limits liability that cannot legally be limited.
        </p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Contact
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Questions about these terms can be routed through the proposal form on our homepage or your project
          contact if you are already a client.
        </p>
        <p className="mt-12 text-xs text-zinc-600">
          Last updated: April 2026. Have legal counsel review before relying on this template commercially.
        </p>
      </div>
    </main>
  );
}
