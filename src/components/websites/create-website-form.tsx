"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClientCombobox, type ClientOption } from "@/components/clients/client-combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CreateWebsiteFormProps = {
  clients: ClientOption[];
};

export function CreateWebsiteForm({ clients }: CreateWebsiteFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );
  const [warning, setWarning] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setWarning(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const domain = String(form.get("domain") ?? "").trim();

    if (!name || !clientId) {
      setMessage({ kind: "error", text: "Name and client are required." });
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/dashboard/websites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          client_id: clientId,
          domain: domain || null,
          status: "draft",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        warning?: string;
        website?: { id?: string };
      };
      if (!response.ok) {
        throw new Error(data.error || "Could not create website.");
      }

      event.currentTarget.reset();
      setClientId("");
      setMessage({
        kind: "success",
        text: "Website created as draft with hero and features sections.",
      });
      setWarning(data.warning ?? null);
      router.refresh();
      if (data.website?.id) {
        router.push(`/dashboard/websites/${data.website.id}/editor`);
      }
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to create website.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <CardTitle className="text-zinc-900">Create website</CardTitle>
        <p className="text-sm text-zinc-500">
          Scaffolds a draft site with a home page, hero, and features sections ready to edit.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1.5 md:col-span-1">
              <span className="text-xs font-medium text-zinc-600">Website name</span>
              <input
                name="name"
                required
                placeholder="e.g. Accra Retail Storefront"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </label>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-600">Client</span>
              <ClientCombobox
                clients={clients}
                value={clientId}
                allowCreate
                required
                onChange={setClientId}
              />
            </div>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-600">Domain slug (optional)</span>
              <input
                name="domain"
                placeholder="e.g. accra-retail"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </label>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create draft website"}
          </Button>
          {message ? (
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
          ) : null}
          {warning ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {warning}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
