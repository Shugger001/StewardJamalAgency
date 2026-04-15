"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClientOption = {
  id: string;
  name: string;
};

type AdminMessageFormProps = {
  clients: ClientOption[];
};

export function AdminMessageForm({ clients }: AdminMessageFormProps) {
  const [targetId, setTargetId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );

  function showToast(kind: "success" | "error", text: string) {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 1500);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!targetId || !title.trim() || !message.trim()) {
      showToast("error", "Fill recipient, title and message");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: targetId,
          title: title.trim(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Failed to send message");
      }

      setTitle("");
      setMessage("");
      setTargetId("");
      showToast("success", "Message sent");
    } catch {
      showToast("error", "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-zinc-600">Recipient</span>
          <select
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="text-xs font-medium text-zinc-600">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
            placeholder="Project kickoff update"
          />
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-xs font-medium text-zinc-600">Message</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20"
          placeholder="Your project review session is scheduled for tomorrow at 11:00 AM."
        />
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send message"}
        </Button>
        {toast && (
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-xs",
              toast.kind === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {toast.text}
          </span>
        )}
      </div>
    </form>
  );
}
