"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpState = {
  loading: boolean;
  error: string | null;
  message: string | null;
};

export function SignUpForm() {
  const router = useRouter();
  const [state, setState] = useState<SignUpState>({
    loading: false,
    error: null,
    message: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: null, message: null });

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setState({
        loading: false,
        error: "Password must be at least 8 characters.",
        message: null,
      });
      return;
    }
    if (password !== confirmPassword) {
      setState({ loading: false, error: "Passwords do not match.", message: null });
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        redirectTo?: string;
        requiresEmailConfirmation?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create account.");
      }

      if (payload.requiresEmailConfirmation) {
        setState({
          loading: false,
          error: null,
          message:
            payload.message ||
            "Account created. Check your email to confirm before signing in.",
        });
        return;
      }

      router.push(payload.redirectTo || "/client-dashboard");
      router.refresh();
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to create account.",
        message: null,
      });
    }
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
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
          placeholder="Re-enter your password"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </p>
      )}

      {state.message && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-right text-xs text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#0A66FF] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
