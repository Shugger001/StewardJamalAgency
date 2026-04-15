import type { Metadata } from "next";
import { PaymentsDashboard } from "@/components/payments/payments-dashboard";
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
  title: "Payments",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

function paymentVariant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status === "success") return "success";
  if (status === "pending") return "warning";
  return "neutral";
}

export default async function PaymentsPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: clients }, { data: payments, error: paymentsError }] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
  ]);

  if (paymentsError) {
    throw new Error(`Failed to load payments: ${paymentsError.message}`);
  }

  const safeClients = ((clients ?? []) as DbRow[]).map((client) => ({
    id: String(client.id ?? ""),
    name: String(client.business_name ?? "Unnamed client"),
  }));
  const clientById = new Map(safeClients.map((client) => [client.id, client.name]));
  const safePayments = (payments ?? []) as DbRow[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Payments</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Charge clients with Paystack and track verified transactions.
        </p>
      </div>

      <PaymentsDashboard clients={safeClients} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">Payment history</h2>
        <TableWrap>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safePayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    No payments yet.
                  </TableCell>
                </TableRow>
              ) : (
                safePayments.map((payment) => {
                  const amount = Number(payment.amount ?? 0);
                  const status = String(payment.status ?? "pending");
                  const createdAt =
                    typeof payment.created_at === "string" ? payment.created_at : null;

                  return (
                    <TableRow key={String(payment.id)}>
                      <TableCell>
                        {clientById.get(String(payment.client_id ?? "")) ?? "Unknown client"}
                      </TableCell>
                      <TableCell>
                        {amount.toLocaleString("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentVariant(status)}>{status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate text-zinc-600">
                        {String(payment.reference ?? "—")}
                      </TableCell>
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
