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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
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

      <section className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/25 bg-white/88 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A66FF]">
          The Steward Jamal Agency
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Agency operations, websites, projects, and billing in one place.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
          No public website is available yet. Create or publish a website from your dashboard,
          then this route will open your live site preview automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
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
      </section>
    </main>
  );
}
