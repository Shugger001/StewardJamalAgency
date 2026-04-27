import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import { AgencyLanding } from "@/components/public/agency-landing";

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

  const previewTargets = previewCandidates
    .map((row) => firstString(row, ["domain"]) || firstString(row, ["id"]))
    .filter(Boolean);

  return <AgencyLanding mode="site" portfolioItems={[]} previewTargets={previewTargets} />;
}
