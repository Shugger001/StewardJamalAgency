"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CreateClientForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const business_name = String(form.get("businessName") ?? "").trim();
    const emailRaw = String(form.get("email") ?? "").trim();

    if (!business_name) {
      setMessage({ kind: "error", text: "Business name is required." });
      return;
    }

    setIsPending(true);
    try {
      const response = await fetch("/api/dashboard/clients", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name,
          email: emailRaw || null,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Your session expired. Sign in again.");
        }
        if (response.status === 403) {
          throw new Error("You do not have permission to add clients.");
        }
        throw new Error(data.error || `Could not add client (${response.status}).`);
      }

      formEl.reset();
      setMessage({ kind: "success", text: "Client added successfully." });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to add client.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-zinc-900">Add client</CardTitle>
        <p className="text-sm text-zinc-500">
          Create a client record so it can be used in websites, projects, and billing.
        </p>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium text-zinc-600">Business name</span>
              <input
                name="businessName"
                required
                placeholder="e.g. Acme Ventures"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-600">Email (optional)</span>
              <input
                name="email"
                type="email"
                placeholder="client@company.com"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding client..." : "Add client"}
            </Button>
          </div>

          {message && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                message.kind === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {message.text}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
