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
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
  const secretKey = process.env.PAYSTACK_SECRET_KEY ?? "";

  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
  const hasSecretKey = Boolean(process.env.PAYSTACK_SECRET_KEY);
  const paystackReady = hasPublicKey && hasSecretKey;
  const paystackMode = publicKey.startsWith("pk_test_") || secretKey.startsWith("sk_test_")
    ? "test"
    : "live";

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
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Payments</h1>
          <span
            className={
              paystackMode === "test"
                ? "inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800"
                : "inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-800"
            }
          >
            {paystackMode === "test" ? "Test mode" : "Live mode"}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          Charge clients with Paystack and track verified transactions.
        </p>
      </div>

      {!paystackReady && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Paystack is not fully configured. Add{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">
            NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
          </code>{" "}
          and{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">PAYSTACK_SECRET_KEY</code>{" "}
          to environment variables.
        </div>
      )}

      {!(process.env.MOOLRE_API_USER && process.env.MOOLRE_API_KEY && process.env.MOOLRE_ACCOUNT_NUMBER) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Moolre name validation is not fully configured. Add{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">MOOLRE_API_USER</code>,{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">MOOLRE_API_KEY</code>, and{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">MOOLRE_ACCOUNT_NUMBER</code>{" "}
          to environment variables.
        </div>
      )}
      {process.env.MOOLRE_API_USER &&
        process.env.MOOLRE_API_KEY &&
        process.env.MOOLRE_ACCOUNT_NUMBER &&
        !process.env.MOOLRE_TRANSFER_ENDPOINT && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Using default transfer endpoint{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5">
              https://api.moolre.com/open/transact/initiate
            </code>
            . If your account uses a different transfer path, set{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5">MOOLRE_TRANSFER_ENDPOINT</code>.
          </div>
        )}

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
                        {amount.toLocaleString("en-GH", {
                          style: "currency",
                          currency: "GHS",
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
