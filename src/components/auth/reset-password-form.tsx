"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  loading: boolean;
  error: string | null;
};

function parseHashParams(): URLSearchParams {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(hash);
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ loading: false, error: null });
  const [tokenReady, setTokenReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = parseHashParams();

    const access = searchParams.get("access_token") ?? hashParams.get("access_token");
    const refresh = searchParams.get("refresh_token") ?? hashParams.get("refresh_token");
    setAccessToken(access);
    setRefreshToken(refresh);
    setTokenReady(true);
  }, []);

  const missingToken = useMemo(() => {
    if (!tokenReady) return false;
    return !accessToken || !refreshToken;
  }, [tokenReady, accessToken, refreshToken]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !refreshToken) {
      setState({ loading: false, error: "Reset link is invalid or expired." });
      return;
    }

    setState({ loading: true, error: null });
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setState({ loading: false, error: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setState({ loading: false, error: "Passwords do not match." });
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          password,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        redirectTo?: string;
      };
      if (!response.ok || !payload.redirectTo) {
        throw new Error(payload.error || "Unable to reset password.");
      }

      router.push(payload.redirectTo);
      router.refresh();
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to reset password.",
      });
    }
  }

  if (missingToken) {
    return (
      <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
        Reset link is invalid or expired. Request a new one.
      </p>
    );
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={state.loading || !tokenReady}
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Updating password..." : "Update password"}
      </button>
    </form>
  );
}
