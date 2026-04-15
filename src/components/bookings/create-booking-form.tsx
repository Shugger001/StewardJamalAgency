"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type State = {
  loading: boolean;
  error: string | null;
  message: string | null;
};

export function CreateBookingForm() {
  const router = useRouter();
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    message: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: null, message: null });

    const form = new FormData(event.currentTarget);
    const service = String(form.get("service") ?? "");
    const scheduledFor = String(form.get("scheduledFor") ?? "");
    const notes = String(form.get("notes") ?? "");

    try {
      const response = await fetch("/api/client/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, scheduledFor, notes }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to create booking.");

      (event.currentTarget as HTMLFormElement).reset();
      setState({
        loading: false,
        error: null,
        message: "Booking submitted. Our team will confirm shortly.",
      });
      router.refresh();
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to create booking.",
        message: null,
      });
    }
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="service"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
          Service
        </label>
        <select
          id="service"
          name="service"
          required
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        >
          <option value="">Select service</option>
          <option value="Website Consultation">Website Consultation</option>
          <option value="Design Review">Design Review</option>
          <option value="Project Planning">Project Planning</option>
          <option value="Support Session">Support Session</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="scheduledFor"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
          Preferred date & time
        </label>
        <input
          id="scheduledFor"
          name="scheduledFor"
          type="datetime-local"
          required
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Tell us what you want to discuss."
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
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
        {state.loading ? "Submitting..." : "Book session"}
      </button>
    </form>
  );
}
