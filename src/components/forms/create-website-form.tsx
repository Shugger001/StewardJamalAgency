"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createWebsiteAction,
  initialCreateWebsiteState,
  type CreateWebsiteActionState,
} from "@/app/dashboard/websites/actions";
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
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState<
    CreateWebsiteActionState,
    FormData
  >(createWebsiteAction, initialCreateWebsiteState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-zinc-900">Create Website</CardTitle>
        <p className="text-sm text-zinc-500">
          Assign a client, set status, and auto-generate a complete homepage scaffold.
        </p>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
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
            <Button type="submit" disabled={isPending || clients.length === 0}>
              {isPending ? "Creating website..." : "Create website"}
            </Button>
            {clients.length === 0 && (
              <p className="text-xs text-amber-700">
                Add at least one client before creating websites.
              </p>
            )}
          </div>

          {state.status !== "idle" && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                state.status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
