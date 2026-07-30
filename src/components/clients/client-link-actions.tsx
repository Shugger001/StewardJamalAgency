"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ClientLinkActionsProps = {
  clientId: string;
  email: string | null;
  userId: string | null;
};

export function ClientLinkActions({ clientId, email, userId }: ClientLinkActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const linked = Boolean(userId);

  async function run(body: { link?: boolean; unlink?: boolean }) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/clients/${clientId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not update client link.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update client link.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Badge variant={linked ? "success" : "neutral"}>{linked ? "Linked" : "Unlinked"}</Badge>
        {linked ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => run({ unlink: true })}
          >
            Unlink
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending || !email}
            onClick={() => run({ link: true })}
            title={!email ? "Add an email on the client first" : undefined}
          >
            Link
          </Button>
        )}
      </div>
      {error ? <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
