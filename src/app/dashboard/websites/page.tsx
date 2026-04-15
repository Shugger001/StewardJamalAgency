import type { Metadata } from "next";
import Link from "next/link";
import { CreateWebsiteForm } from "@/components/forms/create-website-form";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrap,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Websites",
};
export const dynamic = "force-dynamic";

type Client = {
  id: string;
  name: string;
};

type DbRow = Record<string, unknown>;

function statusVariant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status === "published") return "success";
  if (status === "draft") return "default";
  return "neutral";
}

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export default async function WebsitesPage() {
  let safeClients: Client[] = [];
  let safeWebsites: DbRow[] = [];
  let loadError: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const [{ data: clients, error: clientsError }, { data: websites, error: websitesError }] =
      await Promise.all([
        supabase.from("clients").select("*"),
        supabase.from("websites").select("*").order("created_at", { ascending: false }),
      ]);

    if (clientsError) {
      throw new Error(`Failed to load clients: ${clientsError.message}`);
    }

    if (websitesError) {
      throw new Error(`Failed to load websites: ${websitesError.message}`);
    }

    safeClients = ((clients ?? []) as DbRow[])
    .map((row) => {
      const id = String(row.id ?? "");
      const name = firstString(row, [
        "business_name",
        "name",
        "client_name",
        "title",
        "company_name",
      ]);
      return { id, name: name || "Unnamed client" };
    })
    .filter((client) => Boolean(client.id));

    safeWebsites = (websites ?? []) as DbRow[];
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Failed to load websites data.";
  }

  const clientsById = new Map(safeClients.map((client) => [client.id, client.name]));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Websites</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create sites, link clients, and track publishing status.
        </p>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

      <CreateWebsiteForm clients={safeClients} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">All websites</h2>
        <TableWrap>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
                <TableHead className="text-right">Editor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeWebsites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    No websites yet. Create your first website above.
                  </TableCell>
                </TableRow>
              ) : (
                safeWebsites.map((website) => {
                  const websiteId = String(website.id ?? crypto.randomUUID());
                  const websiteName =
                    firstString(website, ["name", "website_name", "title"]) ||
                    "Untitled website";
                  const websiteStatus =
                    firstString(website, ["status", "state"]).toLowerCase() || "draft";
                  const createdAtValue = website.created_at;
                  const createdAt =
                    typeof createdAtValue === "string" ? createdAtValue : null;
                  const clientId = String(website.client_id ?? website.clientId ?? "");
                  const websiteClientName = clientsById.get(clientId) ?? "Unknown client";

                  return (
                  <TableRow key={websiteId}>
                    <TableCell className="font-medium">{websiteName}</TableCell>
                    <TableCell className="text-zinc-600">
                      {websiteClientName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(websiteStatus)}>
                        {websiteStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-zinc-500">
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/websites/${websiteId}/editor`}
                        className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-[#0A66FF]/30 hover:bg-[#0A66FF]/5 hover:text-[#0A66FF]"
                      >
                        Open editor
                      </Link>
                    </TableCell>
                  </TableRow>
                )})
              )}
            </TableBody>
          </Table>
        </TableWrap>
      </section>
    </div>
  );
}
