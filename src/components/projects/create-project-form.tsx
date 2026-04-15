"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClientOption = {
  id: string;
  name: string;
};

type CreateProjectFormProps = {
  clients: ClientOption[];
};

export function CreateProjectForm({ clients }: CreateProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(
    null,
  );

  function pushToast(kind: "success" | "error", message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 1500);
  }

  async function submitProject(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !clientId) {
      pushToast("error", "Fill title, description and client");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          client_id: clientId,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Failed to create project");
      }

      setTitle("");
      setDescription("");
      setClientId("");
      pushToast("success", "Project submitted");
      router.refresh();
    } catch {
      pushToast("error", "Failed to create project");
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
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
            placeholder="Landing page redesign"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
            placeholder="Scope and outcomes..."
          />
        </label>

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
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit project request"}
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
    </form>
  );
}
