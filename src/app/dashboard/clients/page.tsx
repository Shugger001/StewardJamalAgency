import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientLinkActions } from "@/components/clients/client-link-actions";
import { CreateClientForm } from "@/components/clients/create-client-form";
import { DashboardListToolbar, PaginationBar } from "@/components/dashboard/list-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrap,
} from "@/components/ui/table";
import {
  DASHBOARD_PAGE_SIZE,
  escapeIlike,
  parseListPage,
  parseListQuery,
  parseListStatus,
} from "@/lib/dashboard/list-params";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Clients",
};

type DbRow = Record<string, unknown>;

const PORTAL_FILTERS = ["all", "linked", "unlinked"] as const;

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export const dynamic = "force-dynamic";

type ClientsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = (await searchParams) ?? {};
  const q = parseListQuery(params.q);
  const portal = parseListStatus(params.status, [...PORTAL_FILTERS]);
  const page = parseListPage(params.page);
  const from = (page - 1) * DASHBOARD_PAGE_SIZE;
  const to = from + DASHBOARD_PAGE_SIZE - 1;

  let clients: DbRow[] = [];
  let total = 0;
  let loadError: string | null = null;

  if (!hasSupabaseServerEnv()) {
    loadError =
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";
  } else {
    try {
      const supabase = createSupabaseServerClient();
      let query = supabase
        .from("clients")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (q) {
        const term = `%${escapeIlike(q)}%`;
        query = query.or(`business_name.ilike.${term},email.ilike.${term}`);
      }
      if (portal === "linked") {
        query = query.not("user_id", "is", null);
      } else if (portal === "unlinked") {
        query = query.is("user_id", null);
      }

      const clientsQuery = await query;

      if (clientsQuery.error) {
        throw clientsQuery.error;
      }

      clients = (clientsQuery.data ?? []) as DbRow[];
      total = clientsQuery.count ?? clients.length;
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Failed to load clients.";
    }
  }

  const hasFilters = Boolean(q || (portal && portal !== "all"));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Clients</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage clients and link them to portal accounts by email.
        </p>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

      <CreateClientForm />

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">All clients</h2>
          <Suspense fallback={<div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-zinc-100" />}>
            <DashboardListToolbar
              searchPlaceholder="Search business or email…"
              statusOptions={[
                { value: "all", label: "All portal states" },
                { value: "linked", label: "Portal linked" },
                { value: "unlinked", label: "Not linked" },
              ]}
            />
          </Suspense>
        </div>
        <TableWrap>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Portal</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <EmptyState
                      title={hasFilters ? "No matching clients" : "No clients yet"}
                      description={
                        hasFilters
                          ? "Try a different search or clear filters."
                          : "Add a business above, then link their portal account by email when they need access."
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => {
                  const id = String(client.id ?? crypto.randomUUID());
                  const businessName =
                    firstString(client, ["business_name", "name", "client_name", "company_name"]) ||
                    "Unnamed client";
                  const email = firstString(client, ["email"]) || null;
                  const userId =
                    typeof client.user_id === "string" && client.user_id ? client.user_id : null;
                  const createdAt = typeof client.created_at === "string" ? client.created_at : null;

                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{businessName}</TableCell>
                      <TableCell className="text-zinc-600">{email ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <ClientLinkActions clientId={id} email={email} userId={userId} />
                      </TableCell>
                      <TableCell className="text-right text-zinc-500">
                        {createdAt ? new Date(createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrap>
        <Suspense fallback={null}>
          <PaginationBar page={page} pageSize={DASHBOARD_PAGE_SIZE} total={total} />
        </Suspense>
      </section>
    </div>
  );
}
