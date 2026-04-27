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
  const [receiver, setReceiver] = useState("");
  const [channel, setChannel] = useState("1");
  const [sublistId, setSublistId] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validatedName, setValidatedName] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const numericAmount = useMemo(() => Number(amount), [amount]);

  async function handleValidateName() {
    setIsValidating(true);
    setValidationError(null);
    setValidatedName(null);

    try {
      const response = await fetch("/api/moolre/validate-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver,
          channel,
          sublistid: sublistId || undefined,
          currency: "GHS",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        name?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.name) {
        throw new Error(data.error || "Unable to validate name.");
      }

      setValidatedName(data.name);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Unable to validate name.");
    } finally {
      setIsValidating(false);
    }
  }

  async function handleInitiateTransfer() {
    setIsTransferring(true);
    setTransferError(null);
    setTransferSuccess(null);

    try {
      const response = await fetch("/api/moolre/initiate-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver,
          channel,
          sublistid: sublistId || undefined,
          currency: "GHS",
          amount: numericAmount,
          reason: "Client transfer from admin dashboard",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to initiate transfer.");
      }

      setTransferSuccess(data.message || "Transfer initiated successfully.");
    } catch (error) {
      setTransferError(error instanceof Error ? error.message : "Unable to initiate transfer.");
    } finally {
      setIsTransferring(false);
    }
  }

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

      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Moolre recipient validation</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Validate Mobile Money or bank account name before transfer.
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-zinc-600">Receiver number/account</span>
            <input
              value={receiver}
              onChange={(event) => {
                setReceiver(event.target.value);
                setValidatedName(null);
                setTransferError(null);
                setTransferSuccess(null);
              }}
              placeholder="e.g. 0241234567"
              className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-zinc-600">Channel</span>
            <select
              value={channel}
              onChange={(event) => {
                setChannel(event.target.value);
                setValidatedName(null);
                setTransferError(null);
                setTransferSuccess(null);
              }}
              className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
            >
              <option value="1">MTN</option>
              <option value="6">Telecel</option>
              <option value="7">AT</option>
              <option value="2">Instant Bank Transfer</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-zinc-600">Bank ID (optional)</span>
            <input
              value={sublistId}
              onChange={(event) => {
                setSublistId(event.target.value);
                setValidatedName(null);
                setTransferError(null);
                setTransferSuccess(null);
              }}
              placeholder="required for bank transfer"
              className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleValidateName}
              disabled={isValidating || !receiver.trim()}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isValidating ? "Validating..." : "Validate Name"}
            </button>
          </div>
        </div>

        {validatedName && (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Recipient verified: <span className="font-semibold">{validatedName}</span>
          </p>
        )}
        {validationError && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {validationError}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleInitiateTransfer}
            disabled={isTransferring || !validatedName || numericAmount <= 0}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isTransferring ? "Initiating transfer..." : "Initiate Transfer"}
          </button>
          <p className="text-xs text-zinc-500">
            Transfer is enabled only after successful name validation.
          </p>
        </div>

        {transferSuccess && (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {transferSuccess}
          </p>
        )}
        {transferError && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {transferError}
          </p>
        )}
      </div>
    </section>
  );
}
