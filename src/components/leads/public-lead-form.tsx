"use client";

import { useState } from "react";

type FormState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

const fieldClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1860F0]/50 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20";

export function PublicLeadForm() {
  const [state, setState] = useState<FormState>({
    loading: false,
    error: null,
    success: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: null, success: null });

    const formEl = event.currentTarget;
    const form = new FormData(formEl);
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
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        warning?: string;
      };
      if (!response.ok) throw new Error(data.error || "Unable to submit your request.");

      formEl.reset();
      setState({
        loading: false,
        error: null,
        success: data.warning
          ? `${data.warning} We still received your details, no account required.`
          : "Thank you, we received your project request. No account needed. We will respond within one business day.",
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
    <form className="space-y-3" onSubmit={onSubmit} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="mb-1 block text-xs font-medium text-zinc-600">
            Full name
          </label>
          <input id="lead-name" name="name" required autoComplete="name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-1 block text-xs font-medium text-zinc-600">
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-company" className="mb-1 block text-xs font-medium text-zinc-600">
            Company <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input id="lead-company" name="company" autoComplete="organization" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="lead-service" className="mb-1 block text-xs font-medium text-zinc-600">
            Service
          </label>
          <select id="lead-service" name="service" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            <option value="Website Design">Website design</option>
            <option value="Website Development">Website development</option>
            <option value="E-commerce Build">E-commerce build</option>
            <option value="SEO & Marketing">SEO & marketing</option>
            <option value="Maintenance & Support">Maintenance & support</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-budget" className="mb-1 block text-xs font-medium text-zinc-600">
            Budget range
          </label>
          <select id="lead-budget" name="budget" className={fieldClass} defaultValue="">
            <option value="">Not specified</option>
            <option value="GH₵5k - GH₵20k">GH₵5k - GH₵20k</option>
            <option value="GH₵20k - GH₵60k">GH₵20k - GH₵60k</option>
            <option value="GH₵60k - GH₵120k">GH₵60k - GH₵120k</option>
            <option value="GH₵120k+">GH₵120k+</option>
          </select>
        </div>
        <div>
          <label htmlFor="lead-timeline" className="mb-1 block text-xs font-medium text-zinc-600">
            Timeline
          </label>
          <select id="lead-timeline" name="timeline" className={fieldClass} defaultValue="">
            <option value="">Flexible</option>
            <option value="ASAP">ASAP</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="1-2 months">1-2 months</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="lead-message" className="mb-1 block text-xs font-medium text-zinc-600">
          Project details
        </label>
        <textarea
          id="lead-message"
          name="message"
          required
          rows={4}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1860F0]/50 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
          placeholder="Goals, audience, and anything we should know."
        />
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={state.loading}
        className="inline-flex h-11 items-center rounded-lg bg-[#182635] px-5 text-sm font-semibold text-white transition hover:bg-[#09243C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
