"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["pending", "in_progress", "review", "completed"] as const;

type ProjectStatus = (typeof statuses)[number];

type ProjectStatusSelectProps = {
  projectId: string;
  initialStatus: ProjectStatus;
};

export function ProjectStatusSelect({ projectId, initialStatus }: ProjectStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ProjectStatus>(initialStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(nextStatus: ProjectStatus) {
    const previous = status;
    setStatus(nextStatus);
    setIsSaving(true);

    const response = await fetch(`/api/projects/${projectId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setStatus(previous);
    } else {
      router.refresh();
    }

    setIsSaving(false);
  }

  return (
    <select
      value={status}
      disabled={isSaving}
      onChange={(event) => updateStatus(event.target.value as ProjectStatus)}
      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 focus:border-[#0A66FF]/40 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20 disabled:opacity-60"
    >
      {statuses.map((entry) => (
        <option key={entry} value={entry}>
          {entry.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
