"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PortfolioListItem = {
  id: string;
  title: string;
  clientName: string;
  url: string;
  summary: string | null;
  outcome: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type PortfolioItemsListProps = {
  items: PortfolioListItem[];
};

/** Manage publish state and delete for portfolio entries. */
export function PortfolioItemsList({ items }: PortfolioItemsListProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function togglePublish(item: PortfolioListItem) {
    setBusyId(item.id);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/portfolio/${item.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !item.isPublished }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Update failed.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(item: PortfolioListItem) {
    if (!window.confirm(`Remove “${item.title}” from the portfolio?`)) return;
    setBusyId(item.id);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/portfolio/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
        No portfolio websites yet. Add your first live project above.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                <Badge variant={item.isPublished ? "success" : "neutral"}>
                  {item.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{item.clientName}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block break-all text-xs font-medium text-[#1860F0] hover:underline"
              >
                {item.url}
              </a>
              {item.summary ? (
                <p className="mt-2 text-sm text-zinc-600">{item.summary}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busyId === item.id}
                onClick={() => void togglePublish(item)}
              >
                {item.isPublished ? "Unpublish" : "Publish"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busyId === item.id}
                onClick={() => void removeItem(item)}
              >
                Remove
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
