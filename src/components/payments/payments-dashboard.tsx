"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PayButton } from "@/components/payments/pay-button";

type ClientOption = {
  id: string;
  name: string;
};

type PaymentsDashboardProps = {
  clients: ClientOption[];
};

export function PaymentsDashboard({ clients }: PaymentsDashboardProps) {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [email, setEmail] = useState("");

  const numericAmount = useMemo(() => Number(amount), [amount]);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-900">New client payment</h2>
      <p className="mt-1 text-xs text-zinc-500">
        One-time payment via Paystack. Payment is verified server-side before recording.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Client</span>
          <select
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="payer@email.com"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Amount (GHS)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="50000"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
          />
        </label>

        <div className="flex items-end">
          <PayButton
            clientId={clientId}
            amount={numericAmount}
            email={email}
            onVerified={() => router.refresh()}
          />
        </div>
      </div>
    </section>
  );
}
