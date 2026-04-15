"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginState = {
  loading: boolean;
  error: string | null;
};

export function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({ loading: false, error: null });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: null });

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.redirectTo) {
        throw new Error(payload.error || "Unable to sign in right now.");
      }

      router.push(payload.redirectTo);
      router.refresh();
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to sign in right now.",
      });
    }
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@agency.com"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
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
        disabled={state.loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Signing in..." : "Sign in"}
      </button>
      <div className="pt-1 text-right">
        <Link href="/forgot-password" className="text-xs font-medium text-[#0A66FF] hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
