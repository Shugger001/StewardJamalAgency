"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionPayload = {
  authenticated: boolean;
  role: "admin" | "staff" | "client" | "viewer";
  userId: string | null;
  expiresInSeconds: number | null;
};

export function AuthStatusChip() {
  const router = useRouter();
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [expiredHandled, setExpiredHandled] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload: SessionPayload | null) => {
        if (!active || !payload) return;
        setSession(payload);
        setRemainingSeconds(payload.expiresInSeconds);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (remainingSeconds == null) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev == null) return prev;
        return Math.max(prev - 1, 0);
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  useEffect(() => {
    setWarningDismissed(false);
  }, [session?.userId, session?.expiresInSeconds]);

  useEffect(() => {
    if (!session?.authenticated || remainingSeconds == null || remainingSeconds > 0 || expiredHandled) {
      return;
    }

    setExpiredHandled(true);
    void fetch("/api/auth/logout", { method: "POST" })
      .catch(() => undefined)
      .finally(() => {
        router.replace("/login?reason=expired");
        router.refresh();
      });
  }, [session?.authenticated, remainingSeconds, expiredHandled, router]);

  const label = useMemo(() => {
    if (!session?.authenticated) return "Guest";
    return session.role.toUpperCase();
  }, [session]);

  const subLabel = useMemo(() => {
    if (!session?.authenticated || remainingSeconds == null) return null;
    const mins = Math.max(Math.floor(remainingSeconds / 60), 0);
    return `${mins}m`;
  }, [session, remainingSeconds]);

  const shouldWarn =
    Boolean(session?.authenticated) &&
    remainingSeconds != null &&
    remainingSeconds > 0 &&
    remainingSeconds <= 5 * 60 &&
    !warningDismissed;
  const critical = remainingSeconds != null && remainingSeconds <= 60;

  const tone =
    session?.role === "admin"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : session?.role === "staff"
        ? "border-sky-200 bg-sky-50 text-sky-700"
        : session?.role === "client"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-600";

  return (
    <div className="hidden items-center gap-2 md:flex">
      {shouldWarn && (
        <div
          className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${
            critical
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <span>{critical ? "Session expiring now" : "Session expiring soon"}</span>
          <Link href="/login" className="underline underline-offset-2">
            Re-auth
          </Link>
          <button
            type="button"
            onClick={() => setWarningDismissed(true)}
            className="text-[11px] leading-none opacity-80 transition-opacity hover:opacity-100"
            aria-label="Dismiss session warning"
          >
            ×
          </button>
        </div>
      )}

      <div
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone}`}
        title={session?.userId ? `User: ${session.userId}` : "No active session"}
      >
        <span>{label}</span>
        {subLabel && <span className="text-[9px] font-medium normal-case opacity-70">({subLabel})</span>}
      </div>
    </div>
  );
}
