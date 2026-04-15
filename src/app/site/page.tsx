import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

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
  if (hasSupabaseServerEnv()) {
    try {
      const supabase = createSupabaseServerClient();
      const websites = await supabase
        .from("websites")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!websites.error) {
        const target = pickWebsiteTarget((websites.data ?? []) as DbRow[]);
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
