import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import { AgencyLanding } from "@/components/public/agency-landing";

type DbRow = Record<string, unknown>;
type PortfolioItem = {
  id: string;
  name: string;
  status: string;
  domain: string | null;
  clientId: string | null;
  createdAt: string | null;
};

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

async function loadPortfolioItems(): Promise<Array<PortfolioItem & { clientName: string }>> {
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

    const normalized = ((websites ?? []) as DbRow[]).map((row): PortfolioItem => ({
      id: String(row.id ?? ""),
      name: firstString(row, ["name", "website_name", "title"]) || "Website Project",
      status: firstString(row, ["status", "state"]).toLowerCase() || "draft",
      domain: firstString(row, ["domain"]) || null,
      clientId: firstString(row, ["client_id", "clientId"]) || null,
      createdAt: firstString(row, ["created_at"]) || null,
    }));

    const preferred = normalized
      .sort((a, b) => {
        if (a.status === "published" && b.status !== "published") return -1;
        if (a.status !== "published" && b.status === "published") return 1;
        return 0;
      })
      .slice(0, 3)
      .map((item) => ({
        ...item,
        clientName: item.clientId ? clientMap.get(item.clientId) ?? "Client" : "Client",
      }));

    return preferred;
  } catch {
    return [];
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
  }
  const portfolioItems = await loadPortfolioItems();

  return <AgencyLanding mode="home" portfolioItems={portfolioItems} />;
}
