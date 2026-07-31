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

function mapPortfolioRows(rows: DbRow[]): LandingPortfolioItem[] {
  return rows.map((row) => {
    const url = firstString(row, ["url"]);
    const href = url
      ? url.startsWith("http")
        ? url
        : `https://${url}`
      : null;

    let domain: string | null = null;
    if (href) {
      try {
        domain = new URL(href).hostname;
      } catch {
        domain = null;
      }
    }

    return {
      id: String(row.id ?? ""),
      name: firstString(row, ["title", "name"]) || "Website Project",
      status: row.is_published === false ? "draft" : "published",
      domain,
      clientName: firstString(row, ["client_name"]) || "Client",
      summary: firstString(row, ["summary"]) || undefined,
      outcome: firstString(row, ["outcome"]) || undefined,
      image: firstString(row, ["image_url"]) || null,
      href,
    } satisfies LandingPortfolioItem;
  });
}

function mapWebsiteRows(websites: DbRow[], clients: DbRow[]): LandingPortfolioItem[] {
  const clientMap = new Map(
    clients.map((row) => [
      String(row.id ?? ""),
      firstString(row, ["business_name", "name", "client_name", "company_name"]) || "Client",
    ]),
  );

  const normalized = websites.map((row) => ({
    id: String(row.id ?? ""),
    name: firstString(row, ["name", "website_name", "title"]) || "Website Project",
    status: firstString(row, ["status", "state"]).toLowerCase() || "draft",
    domain: firstString(row, ["domain"]) || null,
    clientId: firstString(row, ["client_id", "clientId"]) || null,
    summary: firstString(row, ["summary", "description", "tagline"]) || undefined,
  }));

  const published = normalized.filter((item) => item.status === "published");
  const withDomain = published.filter((item) => Boolean(item.domain));
  const source = withDomain.length ? withDomain : published;

  return source.map((item) => {
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
}

/**
 * Load public portfolio: curated portfolio_items first, then published CRM websites,
 * then labeled sample case studies.
 */
export async function loadPortfolioItems(): Promise<LandingPortfolioItem[]> {
  if (!hasSupabaseServerEnv()) return PORTFOLIO_SHOWCASE;
  try {
    const supabase = createSupabaseServerClient();

    const portfolioQuery = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(24);

    if (!portfolioQuery.error && (portfolioQuery.data?.length ?? 0) > 0) {
      return mapPortfolioRows((portfolioQuery.data ?? []) as DbRow[]);
    }

    const [{ data: websites }, { data: clients }] = await Promise.all([
      supabase.from("websites").select("*").order("created_at", { ascending: false }).limit(48),
      supabase.from("clients").select("*"),
    ]);

    const fromWebsites = mapWebsiteRows(
      (websites ?? []) as DbRow[],
      (clients ?? []) as DbRow[],
    );
    return fromWebsites.length ? fromWebsites : PORTFOLIO_SHOWCASE;
  } catch {
    return PORTFOLIO_SHOWCASE;
  }
}
