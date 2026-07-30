import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Analytics",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

export default async function AnalyticsPage() {
  if (!hasSupabaseServerEnv()) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-lg font-semibold text-zinc-900">Analytics</h1>
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Supabase is not configured.
        </p>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const [leads, payments, projects] = await Promise.all([
    supabase.from("leads").select("status, service, created_at"),
    supabase.from("payments").select("amount, status, created_at"),
    supabase.from("projects").select("status"),
  ]);

  const leadRows = (leads.data ?? []) as DbRow[];
  const paymentRows = (payments.data ?? []) as DbRow[];
  const projectRows = (projects.data ?? []) as DbRow[];

  const leadsByStatus = leadRows.reduce<Record<string, number>>((acc, row) => {
    const key = String(row.status ?? "new");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const leadsByService = leadRows.reduce<Record<string, number>>((acc, row) => {
    const key = String(row.service ?? "Other");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const paidTotal = paymentRows
    .filter((row) => String(row.status) === "success")
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

  const projectsByStatus = projectRows.reduce<Record<string, number>>((acc, row) => {
    const key = String(row.status ?? "pending");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Live aggregates from leads, payments, and projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-900">{leadRows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Successful payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-900">
              {paidTotal.toLocaleString("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-900">{projectRows.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Leads by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(leadsByStatus).length === 0 ? (
              <p className="text-sm text-zinc-500">No leads yet.</p>
            ) : (
              Object.entries(leadsByStatus).map(([key, count]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-zinc-600">{key}</span>
                  <span className="font-medium text-zinc-900">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads by service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(leadsByService).length === 0 ? (
              <p className="text-sm text-zinc-500">No service breakdown yet.</p>
            ) : (
              Object.entries(leadsByService).map(([key, count]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{key}</span>
                  <span className="font-medium text-zinc-900">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(projectsByStatus).length === 0 ? (
              <p className="text-sm text-zinc-500">No projects yet.</p>
            ) : (
              Object.entries(projectsByStatus).map(([key, count]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-zinc-600">{key.replace("_", " ")}</span>
                  <span className="font-medium text-zinc-900">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
