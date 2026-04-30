"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ClientOption = {
  id: string;
  name: string;
};

type CreateWebsiteFormProps = {
  clients: ClientOption[];
};

export function CreateWebsiteForm({ clients }: CreateWebsiteFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );

  const noClients = clients.length === 0;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const name = String(form.get("name") ?? "").trim();
    const client_id = String(form.get("clientId") ?? "").trim();
    const status = String(form.get("status") ?? "").trim();

    if (!name || !client_id || !status) {
      setMessage({
        kind: "error",
        text: "Website name, client, and status are required.",
      });
      return;
    }

    setIsPending(true);
    try {
      const response = await fetch("/api/dashboard/websites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, client_id, status }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Your session expired. Sign in again.");
        }
        if (response.status === 403) {
          throw new Error("You do not have permission to create websites.");
        }
        throw new Error(data.error || `Could not create website (${response.status}).`);
      }

      formEl.reset();
      setMessage({
        kind: "success",
        text: "Website created with homepage and starter content.",
      });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to create website.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-zinc-900">Create Website</CardTitle>
        <p className="text-sm text-zinc-500">
          Assign a client, set status, and auto-generate a complete homepage scaffold.
        </p>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-600">Website Name</span>
              <input
                name="name"
                required
                placeholder="e.g. Northwind Studio"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-600">Client</span>
              <select
                name="clientId"
                required
                defaultValue=""
                disabled={noClients}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
              >
                <option value="" disabled>
                  Select client
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-600">Status</span>
              <select
                name="status"
                required
                defaultValue="draft"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isPending || noClients}>
              {isPending ? "Creating website..." : "Create website"}
            </Button>
            {noClients && (
              <Link
                href="/dashboard/clients"
                className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Add client first
              </Link>
            )}
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
