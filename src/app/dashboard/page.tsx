import type { Metadata } from "next";
import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

export default async function DashboardPage() {
  if (!hasSupabaseServerEnv()) {
    return <DashboardHome leads={[]} leadsLoadError="Supabase is not configured." />;
  }

  const supabase = createSupabaseServerClient();
  const leadsQuery = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  const leads = (leadsQuery.data ?? []) as DbRow[];
  const normalizedLeads = leads.map((lead) => ({
    id: String(lead.id ?? ""),
    name: String(lead.name ?? "Lead"),
    email: String(lead.email ?? "—"),
    service: String(lead.service ?? "—"),
    budget: String(lead.budget ?? "Not specified"),
    timeline: String(lead.timeline ?? "Not specified"),
    status: String(lead.status ?? "new"),
    message: String(lead.message ?? ""),
  }));

  return <DashboardHome leads={normalizedLeads} leadsLoadError={leadsQuery.error?.message ?? null} />;
}
