import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <SectionPlaceholder
      title="Settings"
      description="Workspace preferences, integrations, and team access controls will be configured here."
      actionLabel="Open preferences"
    />
  );
}
