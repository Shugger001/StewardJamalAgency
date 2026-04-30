"use client";

import { useState } from "react";

type State = {
  loading: boolean;
  error: string | null;
  message: string | null;
};

export function TestLeadAlertButton() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    message: null,
  });

  async function onSend() {
    setState({ loading: true, error: null, message: null });
    try {
      const response = await fetch("/api/admin/test-lead-alert", {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to send test email.");
      }
      setState({
        loading: false,
        error: null,
        message: "Test lead-alert email sent. Check your inbox.",
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to send test email.",
        message: null,
      });
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onSend}
        disabled={state.loading}
        className="inline-flex h-9 items-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Sending..." : "Send test lead-alert email"}
      </button>
      {state.message && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {state.message}
        </p>
      )}
      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
