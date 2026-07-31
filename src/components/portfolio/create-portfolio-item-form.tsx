"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PortfolioFormState = {
  title: string;
  client_name: string;
  url: string;
  summary: string;
  outcome: string;
  image_url: string;
  sort_order: string;
  is_published: boolean;
};

const emptyForm: PortfolioFormState = {
  title: "",
  client_name: "",
  url: "",
  summary: "",
  outcome: "",
  image_url: "",
  sort_order: "0",
  is_published: true,
};

/** Form to add a live website to the public marketing portfolio. */
export function CreatePortfolioItemForm() {
  const router = useRouter();
  const [form, setForm] = useState<PortfolioFormState>(emptyForm);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );

  function update<K extends keyof PortfolioFormState>(key: K, value: PortfolioFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setPending(true);
    try {
      const response = await fetch("/api/dashboard/portfolio", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          client_name: form.client_name,
          url: form.url,
          summary: form.summary || null,
          outcome: form.outcome || null,
          image_url: form.image_url || null,
          sort_order: Number(form.sort_order || 0),
          is_published: form.is_published,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not add portfolio item.");
      }
      setForm(emptyForm);
      setMessage({
        kind: "success",
        text: form.is_published
          ? "Added and published to the public portfolio."
          : "Saved as draft. Publish it when ready.",
      });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Failed to add portfolio item.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Add portfolio website</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Add a live site you built or worked on. Published items appear on Home and Portfolio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Project title</span>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Accra Retail Storefront"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Client / brand</span>
          <input
            required
            value={form.client_name}
            onChange={(e) => update("client_name", e.target.value)}
            placeholder="Accra Retail Group"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-zinc-600">Live website URL</span>
          <input
            required
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://example.com or example.com"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-zinc-600">Short summary (optional)</span>
          <textarea
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            rows={3}
            placeholder="What you built and who it serves."
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Outcome (optional)</span>
          <input
            value={form.outcome}
            onChange={(e) => update("outcome", e.target.value)}
            placeholder="Faster enquiries, clearer booking path…"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Cover image URL (optional)</span>
          <input
            value={form.image_url}
            onChange={(e) => update("image_url", e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
          <span className="block text-[11px] text-zinc-500">
            Use a direct image link (.jpg/.png/.webp), or leave blank for a branded fallback. Do not paste the website homepage.
          </span>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Sort order</span>
          <input
            type="number"
            min={0}
            max={9999}
            value={form.sort_order}
            onChange={(e) => update("sort_order", e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#1860F0]/40 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          />
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => update("is_published", e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-[#1860F0] focus:ring-[#1860F0]"
          />
          Show on public portfolio
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add to portfolio"}
        </Button>
        {message ? (
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-xs",
              message.kind === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {message.text}
          </span>
        ) : null}
      </div>
    </form>
  );
}
