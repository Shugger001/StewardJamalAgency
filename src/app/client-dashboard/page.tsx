import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Client Dashboard",
};

type DbRow = Record<string, unknown>;

export default async function ClientDashboardPage() {
  const supabase = createSupabaseServerClient();

  // In production this should scope by authenticated client id.
  const [{ data: projects }, { data: payments }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const safeProjects = (projects ?? []) as DbRow[];
  const safePayments = (payments ?? []) as DbRow[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Client Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track your latest projects, status updates, and payments.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-zinc-900">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {safeProjects.length === 0 ? (
              <p className="text-sm text-zinc-500">No projects yet.</p>
            ) : (
              safeProjects.map((project) => (
                <div
                  key={String(project.id)}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2"
                >
                  <p className="text-sm font-medium text-zinc-900">
                    {String(project.title ?? "Untitled project")}
                  </p>
                  <Badge variant="default">
                    {String(project.status ?? "pending").replace("_", " ")}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-zinc-900">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {safePayments.length === 0 ? (
              <p className="text-sm text-zinc-500">No payments yet.</p>
            ) : (
              safePayments.map((payment) => (
                <div
                  key={String(payment.id)}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2"
                >
                  <p className="text-sm text-zinc-700">
                    {Number(payment.amount ?? 0).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </p>
                  <Badge variant={String(payment.status) === "success" ? "success" : "neutral"}>
                    {String(payment.status ?? "pending")}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
