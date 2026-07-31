import type { Metadata } from "next";
import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

function resolveLeadsLoadError(message: string | null) {
  if (!message) return null;
  const isMissingLeadsTable =
    message.includes("Could not find the table 'public.leads'") ||
    message.includes('relation "leads" does not exist');

  if (isMissingLeadsTable) {
    return "Leads inbox is not initialized yet. Run the leads table migration to enable dashboard storage. Lead emails can still be delivered.";
  }

  return message;
}

export default async function DashboardPage() {
  if (!hasSupabaseServerEnv()) {
    return (
      <DashboardHome
        leads={[]}
        leadsLoadError="Supabase is not configured."
        stats={{ clients: 0, websites: 0, activeProjects: 0, revenueYtd: 0, newLeads: 0 }}
        activity={[]}
      />
    );
  }

  const supabase = createSupabaseServerClient();
  const [leadsQuery, clientsQuery, websitesQuery, projectsQuery, paymentsQuery] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("websites").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id, title, status, client_id, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("payments").select("amount, status"),
  ]);

  const clientsList = await supabase.from("clients").select("id, business_name");
  const clientsById = new Map(
    ((clientsList.data ?? []) as DbRow[]).map((row) => [
      String(row.id ?? ""),
      String(row.business_name ?? "Client"),
    ]),
  );

  const leads = (leadsQuery.data ?? []) as DbRow[];
  const normalizedLeads = leads.map((lead) => ({
    id: String(lead.id ?? ""),
    name: String(lead.name ?? "Lead"),
    email: String(lead.email ?? "-"),
    service: String(lead.service ?? "-"),
    budget: String(lead.budget ?? "Not specified"),
    timeline: String(lead.timeline ?? "Not specified"),
    status: String(lead.status ?? "new"),
    message: String(lead.message ?? ""),
  }));

  const projects = (projectsQuery.data ?? []) as DbRow[];
  const activeProjects = projects.filter((p) => {
    const status = String(p.status ?? "").toLowerCase();
    return status !== "completed" && status !== "cancelled";
  }).length;

  // Recount active from full query if we only have 8 recent - use count query instead
  const activeCountQuery = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .neq("status", "completed");

  const revenueYtd = ((paymentsQuery.data ?? []) as DbRow[])
    .filter((p) => String(p.status ?? "") === "success")
    .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  const activity = projects.map((project) => ({
    client: clientsById.get(String(project.client_id ?? "")) ?? "Client",
    project: String(project.title ?? "Untitled"),
    status: String(project.status ?? "pending"),
    date: project.created_at
      ? new Date(String(project.created_at)).toLocaleDateString("en-GH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-",
  }));

  return (
    <DashboardHome
      leads={normalizedLeads}
      leadsLoadError={resolveLeadsLoadError(leadsQuery.error?.message ?? null)}
      stats={{
        clients: clientsQuery.count ?? 0,
        websites: websitesQuery.count ?? 0,
        activeProjects: activeCountQuery.count ?? activeProjects,
        revenueYtd,
        newLeads: normalizedLeads.filter((l) => l.status === "new").length,
      }}
      activity={activity}
    />
  );
}
