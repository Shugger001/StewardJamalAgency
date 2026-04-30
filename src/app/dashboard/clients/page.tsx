import type { Metadata } from "next";
import { CreateClientForm } from "@/components/clients/create-client-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrap,
} from "@/components/ui/table";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Clients",
};

type DbRow = Record<string, unknown>;

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  let clients: DbRow[] = [];
  let loadError: string | null = null;

  if (!hasSupabaseServerEnv()) {
    loadError =
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";
  } else {
    try {
      const supabase = createSupabaseServerClient();
      const clientsQuery = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientsQuery.error) {
        throw clientsQuery.error;
      }

      clients = (clientsQuery.data ?? []) as DbRow[];
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Failed to load clients.";
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Clients</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage clients from one place.</p>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

      <CreateClientForm />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">All clients</h2>
        <TableWrap>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-zinc-500">
                    No clients yet. Add your first client above.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => {
                  const id = String(client.id ?? crypto.randomUUID());
                  const businessName =
                    firstString(client, ["business_name", "name", "client_name", "company_name"]) ||
                    "Unnamed client";
                  const email = firstString(client, ["email"]) || "—";
                  const createdAt = typeof client.created_at === "string" ? client.created_at : null;

                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{businessName}</TableCell>
                      <TableCell className="text-zinc-600">{email}</TableCell>
                      <TableCell className="text-right text-zinc-500">
                        {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrap>
      </section>
    </div>
  );
}
