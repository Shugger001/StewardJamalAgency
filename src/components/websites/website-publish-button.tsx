"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type WebsitePublishButtonProps = {
  websiteId: string;
  status: string;
};

export function WebsitePublishButton({ websiteId, status }: WebsitePublishButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPublished = status.toLowerCase() === "published";
  const nextStatus = isPublished ? "draft" : "published";

  async function onToggle() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/websites/${websiteId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not update status.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onToggle}>
        {pending ? "Saving..." : isPublished ? "Unpublish" : "Publish"}
      </Button>
      {error ? <p className="max-w-[160px] text-right text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
