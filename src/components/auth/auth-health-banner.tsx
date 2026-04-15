"use client";

import { useEffect, useMemo, useState } from "react";

type AuthHealth = {
  ok: boolean;
  checks: {
    supabaseUrl: boolean;
    anonKey: boolean;
    serviceRoleKey: boolean;
    authAdminReachable: boolean;
    profilesTableReachable: boolean;
  };
  message: string;
};

type AuthHealthBannerProps = {
  className?: string;
};

export function AuthHealthBanner({ className = "mt-4" }: AuthHealthBannerProps) {
  const [health, setHealth] = useState<AuthHealth | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/health", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload: AuthHealth | null) => {
        if (!active || !payload) return;
        setHealth(payload);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const tone = useMemo(() => {
    if (!health) return "border-zinc-200 bg-zinc-50 text-zinc-600";
    return health.ok
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-800";
  }, [health]);

  const checks = health?.checks;

  return (
    <div className={`${className} rounded-lg border px-3 py-2 text-xs ${tone}`}>
      <p className="font-medium">
        {health ? health.message : "Checking auth health..."}
      </p>
      {checks && (
        <div className="mt-2 grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
          <p>NEXT_PUBLIC_SUPABASE_URL: {checks.supabaseUrl ? "configured" : "missing"}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {checks.anonKey ? "configured" : "missing"}</p>
          <p>SUPABASE_SERVICE_ROLE_KEY: {checks.serviceRoleKey ? "configured" : "missing"}</p>
          <p>Auth Admin API: {checks.authAdminReachable ? "reachable" : "failed"}</p>
          <p>Profiles table: {checks.profilesTableReachable ? "reachable" : "failed"}</p>
        </div>
      )}
    </div>
  );
}
