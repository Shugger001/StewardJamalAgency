"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["new", "contacted", "closed"] as const;

type LeadStatusSelectProps = {
  leadId: string;
  status: string;
};

function variant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status === "closed") return "success";
  if (status === "contacted") return "default";
  return "warning";
}

export function LeadStatusSelect({ leadId, status }: LeadStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(next: string) {
    setLoading(true);
    setError(null);
    const previous = value;
    setValue(next);
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Update failed");
      }
      router.refresh();
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Badge variant={variant(value)}>{value}</Badge>
        <select
          aria-label="Update lead status"
          value={value}
          disabled={loading}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 focus:border-[#0693e3]/40 focus:outline-none focus:ring-2 focus:ring-[#0693e3]/20"
        >
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}
