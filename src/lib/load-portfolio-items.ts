import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import type { LandingPortfolioItem } from "@/components/public/agency-landing";
import { PORTFOLIO_SHOWCASE } from "@/content/portfolio-showcase";

type DbRow = Record<string, unknown>;

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/**
 * Prefer published CRM websites (especially those with a live domain).
 * Fall back to labeled sample case studies when none are published yet.
 */
export async function loadPortfolioItems(): Promise<LandingPortfolioItem[]> {
  if (!hasSupabaseServerEnv()) return PORTFOLIO_SHOWCASE;
  try {
    const supabase = createSupabaseServerClient();
    const [{ data: websites }, { data: clients }] = await Promise.all([
      supabase.from("websites").select("*").order("created_at", { ascending: false }).limit(48),
      supabase.from("clients").select("*"),
    ]);

    const clientMap = new Map(
      ((clients ?? []) as DbRow[]).map((row) => [
        String(row.id ?? ""),
        firstString(row, ["business_name", "name", "client_name", "company_name"]) || "Client",
      ]),
    );

    const normalized = ((websites ?? []) as DbRow[]).map((row) => ({
      id: String(row.id ?? ""),
      name: firstString(row, ["name", "website_name", "title"]) || "Website Project",
      status: firstString(row, ["status", "state"]).toLowerCase() || "draft",
      domain: firstString(row, ["domain"]) || null,
      clientId: firstString(row, ["client_id", "clientId"]) || null,
      createdAt: firstString(row, ["created_at"]) || null,
      summary: firstString(row, ["summary", "description", "tagline"]) || undefined,
    }));

    const published = normalized.filter((item) => item.status === "published");
    const withDomain = published.filter((item) => Boolean(item.domain));
    const source = withDomain.length ? withDomain : published;

    const items = source.map((item) => {
      const clientName = item.clientId ? clientMap.get(item.clientId) ?? "Client" : "Client";
      const href = item.domain
        ? item.domain.startsWith("http")
          ? item.domain
          : `https://${item.domain}`
        : `/sites/${item.id}`;

      return {
        id: item.id,
        name: item.name,
        status: item.status,
        domain: item.domain,
        clientName,
        summary: item.summary,
        href,
      } satisfies LandingPortfolioItem;
    });

    return items.length ? items : PORTFOLIO_SHOWCASE;
  } catch {
    return PORTFOLIO_SHOWCASE;
  }
}
