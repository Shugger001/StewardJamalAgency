import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBookingForm } from "@/components/bookings/create-booking-form";

export const metadata: Metadata = {
  title: "Client Dashboard",
};
export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

function bookingVariant(status: string): "default" | "success" | "warning" | "neutral" {
  const normalized = status.toLowerCase();
  if (normalized === "confirmed") return "success";
  if (normalized === "pending") return "warning";
  if (normalized === "cancelled") return "neutral";
  return "default";
}

export default async function ClientDashboardPage() {
  if (!hasSupabaseServerEnv()) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
            Client Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your latest projects, status updates, and payments.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Supabase environment variables are not configured for this deployment.
        </div>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const cookieStore = await cookies();
  const userId = cookieStore.get("steward_user_id")?.value ?? null;

  // In production this should scope by authenticated client id.
  const [{ data: projects }, { data: payments }, bookingsResponse] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(5),
    userId
      ? supabase
          .from("bookings")
          .select("*")
          .eq("user_id", userId)
          .order("scheduled_for", { ascending: true })
          .limit(8)
      : Promise.resolve({ data: null, error: null }),
  ]);

  const safeProjects = (projects ?? []) as DbRow[];
  const safePayments = (payments ?? []) as DbRow[];
  const safeBookings = ((bookingsResponse.data ?? []) as DbRow[]).filter(Boolean);
  const bookingLoadError = bookingsResponse.error?.message ?? null;

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
            <CardTitle className="text-zinc-900">Book a Session</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateBookingForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-zinc-900">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bookingLoadError ? (
              <p className="text-sm text-amber-700">
                Booking data unavailable: {bookingLoadError}
              </p>
            ) : safeBookings.length === 0 ? (
              <p className="text-sm text-zinc-500">No bookings yet.</p>
            ) : (
              safeBookings.map((booking) => (
                <div
                  key={String(booking.id)}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {String(booking.service ?? "Session")}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {booking.scheduled_for
                        ? new Date(String(booking.scheduled_for)).toLocaleString()
                        : "Date pending"}
                    </p>
                  </div>
                  <Badge variant={bookingVariant(String(booking.status ?? "pending"))}>
                    {String(booking.status ?? "pending")}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
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
