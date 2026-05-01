import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How The Steward Jamal Agency handles information when you use our website and services.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050b1a] px-4 py-14 text-zinc-200 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-medium text-blue-300 hover:text-blue-200 hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Privacy policy
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          This page summarizes how we approach privacy for visitors and clients of The Steward Jamal Agency.
          For specific agreements tied to a signed engagement, those documents take precedence where they
          conflict with this summary.
        </p>
        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Information we collect
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          We may collect information you submit through forms (such as name, email, and project details),
          technical data commonly logged by web hosts and analytics tools (such as approximate location,
          device type, and pages viewed), and correspondence you send us by email or messaging channels.
        </p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          How we use information
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          We use this information to respond to inquiries, deliver services, improve our website, comply with
          legal obligations, and protect the security of our systems.
        </p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Retention & sharing
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          We retain information only as long as needed for these purposes or as required by law. We may share
          information with trusted subprocessors who assist our hosting, email, payments, or CRM tooling,
          subject to appropriate safeguards.
        </p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Your choices
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          You may contact us to ask questions about this policy or to request access, correction, or deletion
          of personal information where applicable law allows.
        </p>
        <p className="mt-12 text-xs text-zinc-600">
          Last updated: April 2026. Replace this page with counsel-reviewed copy before high-compliance launches.
        </p>
      </div>
    </main>
  );
}
