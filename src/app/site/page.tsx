import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import { PublicLeadForm } from "@/components/leads/public-lead-form";

export const metadata: Metadata = {
  title: "Site",
};

type DbRow = Record<string, unknown>;

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function pickWebsiteTarget(rows: DbRow[]): string | null {
  if (!rows.length) return null;
  const published = rows.find((row) =>
    firstString(row, ["status"]).toLowerCase() === "published",
  );
  const target = published ?? rows[0];
  const domain = firstString(target, ["domain"]);
  if (domain) return domain;
  const id = firstString(target, ["id"]);
  return id || null;
}

export default async function SitePage() {
  let previewCandidates: DbRow[] = [];

  if (hasSupabaseServerEnv()) {
    try {
      const supabase = createSupabaseServerClient();
      const websites = await supabase
        .from("websites")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!websites.error) {
        previewCandidates = (websites.data ?? []) as DbRow[];
        const target = pickWebsiteTarget(previewCandidates);
        if (target) {
          redirect(`/sites/${target}`);
        }
      }
    } catch {
      // Fall through to public landing fallback.
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 p-4 py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2200&q=80')",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(7,16,33,0.72),rgba(8,11,18,0.58),rgba(8,102,255,0.25))]"
      />

      <section className="relative z-10 mx-auto w-full max-w-5xl rounded-2xl border border-white/25 bg-white/88 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A66FF]">
          The Steward Jamal Agency
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          We design and build websites that help service brands grow.
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-zinc-600 sm:text-base">
          Your public website preview is not available yet. Publish a website from dashboard, and this
          page will route directly to your live preview automatically.
        </p>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Open a client site directly with: <code className="font-mono">/sites/&lt;website-id-or-domain&gt;</code>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/dashboard/websites"
            className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white"
          >
            Open websites
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Back to dashboard
          </Link>
        </div>

        {previewCandidates.length > 0 && (
          <div className="mt-6 rounded-xl border border-zinc-200/70 bg-white/95 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Available preview links
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {previewCandidates.slice(0, 4).map((row) => {
                const id = firstString(row, ["id"]);
                const domain = firstString(row, ["domain"]);
                const target = domain || id;
                if (!target) return null;
                return (
                  <Link
                    key={target}
                    href={`/sites/${target}`}
                    className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-[#0A66FF]/35 hover:bg-[#0A66FF]/5 hover:text-[#0A66FF]"
                  >
                    /sites/{target}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Projects delivered</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">120+</p>
            <p className="mt-1 text-xs text-zinc-500">Business websites, e-commerce, and digital portals.</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Average launch time</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">3-6 weeks</p>
            <p className="mt-1 text-xs text-zinc-500">Fast timelines with quality-focused execution.</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Client satisfaction</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">95%</p>
            <p className="mt-1 text-xs text-zinc-500">Built on transparent collaboration and outcomes.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Services
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>- Website design and front-end development</li>
              <li>- Branding, content structure, and UX optimization</li>
              <li>- E-commerce and booking workflow implementation</li>
              <li>- Ongoing maintenance, updates, and support</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Our process
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>1. Discovery call to define goals, audience, and offer.</li>
              <li>2. Strategy + design direction tailored to your brand.</li>
              <li>3. Development, QA, and performance optimization.</li>
              <li>4. Launch, support, and continuous improvement.</li>
            </ol>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Service Packages
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Starter Website</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">GH₵4,500</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>- Up to 5 pages</li>
                <li>- Responsive design</li>
                <li>- Basic SEO setup</li>
                <li>- Launch support</li>
              </ul>
            </article>
            <article className="rounded-xl border border-[#0A66FF]/35 bg-[#0A66FF]/8 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-[#0A66FF]">
                Growth Package
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">GH₵6,500</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>- Custom UI/UX design system</li>
                <li>- CMS-ready architecture</li>
                <li>- Conversion and analytics setup</li>
                <li>- 30-day post-launch optimization</li>
              </ul>
            </article>
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Premium Build</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">GH₵9,000</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>- Complex integrations / workflows</li>
                <li>- Advanced performance optimization</li>
                <li>- Team training and documentation</li>
                <li>- Priority long-term support</li>
              </ul>
            </article>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">FAQ</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">How long does a typical project take?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Most websites launch in 3-6 weeks depending on scope, content readiness, and integrations.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">Do you provide content and copy support?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Yes. We help structure messaging, page hierarchy, and conversion-focused copy blocks.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">Can you redesign an existing website?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Absolutely. We audit your current site, keep what works, and modernize what limits growth.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">Do you offer maintenance after launch?</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Yes. We offer monthly support packages for updates, enhancements, and technical monitoring.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-zinc-200/70 bg-white/92 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Get Proposal
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">
            Tell us about your project
          </h3>
          <p className="mt-1 text-sm text-zinc-600">
            Share your goals, budget, and timeline. We will send a tailored proposal.
          </p>
          <div className="mt-4">
            <PublicLeadForm />
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-zinc-200/70 bg-zinc-900 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
            Let’s build
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            Ready to launch your next website?
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Share your goals and we will send a practical roadmap with timelines, scope, and budget.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-900"
            >
              Start project
            </Link>
            <Link
              href="/site"
              className="inline-flex h-10 items-center rounded-lg border border-zinc-500 px-5 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              See live previews
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 rounded-xl border border-[#0A66FF]/35 bg-white/95 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur md:bottom-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#0A66FF]">
              Launch your website
            </p>
            <p className="truncate text-sm text-zinc-700">
              Publish a site to unlock public preview automatically.
            </p>
          </div>
          <Link
            href="/dashboard/websites"
            className="inline-flex h-9 shrink-0 items-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white"
          >
            Open
          </Link>
        </div>
      </div>
    </main>
  );
}
