"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createClientAction,
  initialCreateClientState,
  type CreateClientActionState,
} from "@/app/dashboard/clients/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CreateClientForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState<CreateClientActionState, FormData>(
    createClientAction,
    initialCreateClientState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-zinc-900">Add client</CardTitle>
        <p className="text-sm text-zinc-500">
          Create a client record so it can be used in websites, projects, and billing.
        </p>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
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
