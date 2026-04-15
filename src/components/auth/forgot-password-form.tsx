"use client";

import { useState } from "react";

type FormState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

export function ForgotPasswordForm() {
  const [state, setState] = useState<FormState>({
    loading: false,
    error: null,
    success: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: null, success: null });

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to send reset email.");

      setState({
        loading: false,
        error: null,
        success: "If the account exists, a password reset link has been sent to your email.",
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to send reset email.",
        success: null,
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

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={state.loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
