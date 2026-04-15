"use client";

import { useState, useTransition } from "react";
import type { AppRole } from "@/lib/auth/role";
import { cn } from "@/lib/utils";

type DevRoleSwitcherProps = {
  role: AppRole;
};

const roles: AppRole[] = ["admin", "client", "viewer"];

export function DevRoleSwitcher({ role }: DevRoleSwitcherProps) {
  const [currentRole, setCurrentRole] = useState<AppRole>(role);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function setRole(nextRole: AppRole) {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/dev/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: nextRole }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setError(payload.error ?? "Failed to switch role.");
        return;
      }

      setCurrentRole(nextRole);
      window.location.reload();
    });
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        Dev Role Switcher
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {roles.map((candidate) => (
          <button
            key={candidate}
            type="button"
            onClick={() => setRole(candidate)}
            disabled={isPending}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              currentRole === candidate
                ? "border-[#0A66FF]/40 bg-[#0A66FF]/10 text-[#0A66FF]"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100",
            )}
          >
            {candidate}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
