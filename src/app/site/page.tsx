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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8">
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
