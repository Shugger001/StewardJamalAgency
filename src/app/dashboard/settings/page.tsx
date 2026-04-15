import type { Metadata } from "next";
import { AdminMessageForm } from "@/components/messages/admin-message-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Settings",
};

type DbRow = Record<string, unknown>;

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient();
  const [clientsQuery, leadsQuery] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(30),
  ]);

  if (clientsQuery.error) {
    throw new Error(`Failed to load clients: ${clientsQuery.error.message}`);
  }

  const clients = ((clientsQuery.data ?? []) as DbRow[]).map((client) => ({
    id: String(client.id ?? ""),
    name: String(client.business_name ?? "Unnamed client"),
  }));
  const leads = (leadsQuery.data ?? []) as DbRow[];
  const leadsLoadError = leadsQuery.error?.message ?? null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage communication and workspace-level controls.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">Admin message</CardTitle>
          <p className="text-sm text-zinc-500">
            Send an in-app notification and email to a selected client.
          </p>
        </CardHeader>
        <CardContent>
          <AdminMessageForm clients={clients} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">Leads inbox</CardTitle>
          <p className="text-sm text-zinc-500">
            Proposal requests submitted from the public website.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {leadsLoadError ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Leads unavailable: {leadsLoadError}
            </p>
          ) : leads.length === 0 ? (
            <p className="text-sm text-zinc-500">No leads yet.</p>
          ) : (
            leads.map((lead) => (
              <div
                key={String(lead.id)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900">{String(lead.name ?? "Lead")}</p>
                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600">
                    {String(lead.status ?? "new")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {String(lead.email ?? "—")}
                  {lead.company ? ` • ${String(lead.company)}` : ""}
                  {lead.service ? ` • ${String(lead.service)}` : ""}
                </p>
                <p className="mt-2 text-sm text-zinc-700">{String(lead.message ?? "")}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  Budget: {String(lead.budget ?? "Not specified")} • Timeline:{" "}
                  {String(lead.timeline ?? "Not specified")}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
