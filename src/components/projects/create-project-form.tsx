"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientCombobox, type ClientOption } from "@/components/clients/client-combobox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


type CreateProjectFormProps = {
  clients: ClientOption[];
};

export function CreateProjectForm({ clients }: CreateProjectFormProps) {
  const router = useRouter();
  const noClients = clients.length === 0;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(
    null,
  );
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [clientFieldHighlighted, setClientFieldHighlighted] = useState(false);

  function pushToast(kind: "success" | "error", message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), kind === "error" ? 8000 : 2500);
  }

  async function submitProject(event: React.FormEvent) {
    event.preventDefault();
    setInlineError(null);
    setClientFieldHighlighted(false);

    if (!title.trim() || !description.trim()) {
      const msg = "Enter a project title and description.";
      setInlineError(msg);
      pushToast("error", msg);
      return;
    }

    if (!clientId) {
      const msg = "Type or select a client before submitting.";
      setInlineError(msg);
      setClientFieldHighlighted(true);
      pushToast("error", msg);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          client_id: clientId,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        if (response.status === 401) {
          throw new Error("Your session expired. Sign in again from the login page.");
        }
        if (response.status === 403) {
          throw new Error(
            payload.error ??
              "You do not have permission to create projects. Sign in as admin or staff.",
          );
        }
        throw new Error(payload.error ?? `Request failed (${response.status}).`);
      }

      setTitle("");
      setDescription("");
      setClientId("");
      setInlineError(null);
      setClientFieldHighlighted(false);
      pushToast("success", "Project submitted");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project.";
      setInlineError(message);
      pushToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitProject} className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Project title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
            placeholder="Landing page redesign"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
            placeholder="Scope and outcomes..."
          />
        </label>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Client</span>
          <ClientCombobox
            clients={clients}
            value={clientId}
            allowCreate
            required
            highlighted={clientFieldHighlighted}
            onChange={(nextId) => {
              setClientId(nextId);
              setInlineError(null);
              setClientFieldHighlighted(false);
            }}
          />
        </div>
      </div>

      {inlineError && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {inlineError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit project request"}
        </Button>
        {noClients ? (
          <Link
            href="/dashboard/clients"
            className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Manage clients
          </Link>
        ) : null}
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
    </form>
  );
}
