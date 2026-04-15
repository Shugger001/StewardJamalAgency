"use client";

import { useState } from "react";

type FormState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

export function PublicLeadForm() {
  const [state, setState] = useState<FormState>({
    loading: false,
    error: null,
    success: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: null, success: null });

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      service: String(form.get("service") ?? ""),
      budget: String(form.get("budget") ?? ""),
      timeline: String(form.get("timeline") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to submit your request.");

      (event.currentTarget as HTMLFormElement).reset();
      setState({
        loading: false,
        error: null,
        success: "Thanks! We received your request and will reach out shortly.",
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to submit your request.",
        success: null,
      });
    }
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Your name"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="company"
          placeholder="Company (optional)"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        />
        <select
          name="service"
          required
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        >
          <option value="">Service needed</option>
          <option value="Website Design">Website Design</option>
          <option value="Website Development">Website Development</option>
          <option value="E-commerce Build">E-commerce Build</option>
          <option value="Maintenance & Support">Maintenance & Support</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="budget"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        >
          <option value="">Budget range</option>
          <option value="GH₵5k - GH₵20k">GH₵5k - GH₵20k</option>
          <option value="GH₵20k - GH₵60k">GH₵20k - GH₵60k</option>
          <option value="GH₵60k - GH₵120k">GH₵60k - GH₵120k</option>
          <option value="GH₵120k+">GH₵120k+</option>
        </select>
        <select
          name="timeline"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
        >
          <option value="">Preferred timeline</option>
          <option value="ASAP">ASAP</option>
          <option value="2-4 weeks">2-4 weeks</option>
          <option value="1-2 months">1-2 months</option>
          <option value="Flexible">Flexible</option>
        </select>
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Tell us about your project goals."
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
      />
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

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
        className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Submitting..." : "Get proposal"}
      </button>
    </form>
  );
}
