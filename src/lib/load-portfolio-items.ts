import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import type { LandingPortfolioItem } from "@/components/public/agency-landing";

type DbRow = Record<string, unknown>;

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export async function loadPortfolioItems(): Promise<LandingPortfolioItem[]> {
  if (!hasSupabaseServerEnv()) return [];
  try {
    const supabase = createSupabaseServerClient();
    const [{ data: websites }, { data: clients }] = await Promise.all([
      supabase.from("websites").select("*").order("created_at", { ascending: false }).limit(24),
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
    }));

    return normalized
      .sort((a, b) => {
        if (a.status === "published" && b.status !== "published") return -1;
        if (a.status !== "published" && b.status === "published") return 1;
        return 0;
      })
      .map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        domain: item.domain,
        clientName: item.clientId ? clientMap.get(item.clientId) ?? "Client" : "Client",
      }));
  } catch {
    return [];
  }
}
