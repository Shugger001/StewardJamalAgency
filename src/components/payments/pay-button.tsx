"use client";

import Script from "next/script";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: Record<string, unknown>) => {
        openIframe: () => void;
      };
    };
  }
}

type PayButtonProps = {
  clientId: string;
  amount: number;
  email: string;
  onVerified: () => void;
};

export function PayButton({ clientId, amount, email, onVerified }: PayButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(
    null,
  );

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const amountInKobo = useMemo(() => Math.round(amount * 100), [amount]);

  function pushToast(kind: "success" | "error", message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 1600);
  }

  async function verifyReference(reference: string) {
    setIsVerifying(true);
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference,
          client_id: clientId,
          amount,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Payment verification failed.");
      }

      pushToast("success", "Payment successful");
      onVerified();
    } catch {
      pushToast("error", "Payment failed");
    } finally {
      setIsVerifying(false);
    }
  }

  function startPayment() {
    if (!publicKey) {
      pushToast("error", "Missing Paystack public key");
      return;
    }
    if (!email || !clientId || !amount || amount <= 0) {
      pushToast("error", "Provide client, amount and email");
      return;
    }
    if (!window.PaystackPop) {
      pushToast("error", "Paystack SDK not loaded");
      return;
    }

    const reference = `steward_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amountInKobo,
      ref: reference,
      callback: ({ reference: paidReference }: { reference: string }) => {
        verifyReference(paidReference);
      },
      onClose: () => {
        pushToast("error", "Payment cancelled");
      },
    });

    handler.openIframe();
  }

  return (
    <div className="flex items-center gap-2">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <Button type="button" onClick={startPayment} disabled={isVerifying}>
        {isVerifying ? "Verifying..." : "Pay now"}
      </Button>
      {toast && (
        <span
          className={cn(
            "rounded-md border px-2 py-1 text-xs",
            toast.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {toast.message}
        </span>
      )}
    </div>
  );
}
