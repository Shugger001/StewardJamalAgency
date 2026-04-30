import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          View and manage sites that exist in your database. New builds are done in Cursor, not here.
        </p>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-zinc-900">How websites are created</CardTitle>
          <p className="text-sm text-zinc-500">
            Client websites are built and deployed using{" "}
            <span className="font-medium text-zinc-700">Cursor</span> (your editor and repo
            workflow), not through a &quot;create website&quot; form in this dashboard.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>
            This screen only shows rows already stored in Supabase so you can open previews, the
            CMS editor, and client links when those records exist.
          </p>
          <p className="text-xs text-zinc-500">
            Need a row for a new project? Add it in Supabase (or your migration process)—this app
            does not scaffold new sites from the UI.
          </p>
        </CardContent>
      </Card>

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
                <TableHead className="text-right">Live site</TableHead>
                <TableHead className="text-right">Editor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeWebsites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-zinc-500">
                    No websites in the database yet. Sites are built in Cursor; add records in
                    Supabase when you want them to appear here.
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
                  const websiteDomain = firstString(website, ["domain"]);
                  const liveTarget = websiteDomain || websiteId;

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
                      {liveTarget ? (
                        <Link
                          href={`/sites/${liveTarget}`}
                          className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Open live site
                        </Link>
                      ) : (
                        <span className="text-xs text-zinc-400">Unavailable</span>
                      )}
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
