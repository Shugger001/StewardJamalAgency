import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
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
          Agency operations, websites, projects, and billing in one place.
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-zinc-600 sm:text-base">
          Manage clients, launch websites, track payments, and keep teams aligned with a
          production-ready dashboard built for modern agency workflows.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Create account
          </Link>
          <Link
            href="/site"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            View public site
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Websites managed</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">60+</p>
            <p className="mt-1 text-xs text-zinc-500">From brochure sites to full CMS builds.</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Project visibility</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">100%</p>
            <p className="mt-1 text-xs text-zinc-500">Track status, updates, and next actions in one dashboard.</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Billing confidence</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Real-time</p>
            <p className="mt-1 text-xs text-zinc-500">Payments and transaction history synced instantly.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Core capabilities
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>- Client and project lifecycle management</li>
              <li>- Website provisioning with editable CMS sections</li>
              <li>- Secure payments, verification, and reporting</li>
              <li>- Role-based portals for admin and clients</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              How it works
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>1. Create clients, websites, and project scopes.</li>
              <li>2. Collaborate through booking, updates, and messaging.</li>
              <li>3. Launch public sites and monitor performance.</li>
              <li>4. Close billing with transparent payment tracking.</li>
            </ol>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Portfolio Highlights
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
                Recent delivery wins
              </h2>
            </div>
            <Link href="/site" className="text-xs font-medium text-[#0A66FF] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Real Estate Platform
              </p>
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">Harborline Realty</h3>
              <p className="mt-2 text-xs text-zinc-600">
                Redesigned listing workflow and lead capture to improve qualified inquiries by 38%.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                E-commerce Build
              </p>
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">Cedar & Co.</h3>
              <p className="mt-2 text-xs text-zinc-600">
                Launched conversion-focused storefront with checkout optimization and analytics layer.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Brand & Web Refresh
              </p>
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">Northwind Collective</h3>
              <p className="mt-2 text-xs text-zinc-600">
                Unified brand voice, website structure, and reporting cadence across all teams.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Client Testimonials
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <blockquote className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-600">
              "The portal gives us a clean view of progress, billing, and deliverables without
              chasing updates."
              <footer className="mt-3 text-xs font-medium text-zinc-800">
                — Amina Yusuf, Operations Lead
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-600">
              "Booking support sessions and tracking website updates now takes minutes instead of
              days."
              <footer className="mt-3 text-xs font-medium text-zinc-800">
                — Daniel Okafor, Founder
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-600">
              "Our team finally has one source of truth for clients, projects, and payment status."
              <footer className="mt-3 text-xs font-medium text-zinc-800">
                — Ruth Mensah, Program Manager
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-[#0A66FF]/25 bg-[#0A66FF]/8 p-5">
          <p className="text-sm font-semibold text-zinc-900">Ready to scale your agency operations?</p>
          <p className="mt-1 text-sm text-zinc-600">
            Start with a client workspace in minutes and run every delivery workflow from one platform.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white"
            >
              Start now
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Book discovery call
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 rounded-xl border border-[#0A66FF]/35 bg-white/95 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur md:bottom-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#0A66FF]">
              Free strategy session
            </p>
            <p className="truncate text-sm text-zinc-700">
              Book a discovery call and get your launch roadmap.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-9 shrink-0 items-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white"
          >
            Book now
          </Link>
        </div>
      </div>
    </main>
  );
}
