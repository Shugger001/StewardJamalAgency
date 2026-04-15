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
  const clientsQuery = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (clientsQuery.error) {
    throw new Error(`Failed to load clients: ${clientsQuery.error.message}`);
  }

  const clients = ((clientsQuery.data ?? []) as DbRow[]).map((client) => ({
    id: String(client.id ?? ""),
    name: String(client.business_name ?? "Unnamed client"),
  }));

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
    </div>
  );
}
