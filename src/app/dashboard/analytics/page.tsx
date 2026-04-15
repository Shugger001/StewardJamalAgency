import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return (
    <SectionPlaceholder
      title="Analytics"
      description="Deeper funnel and channel analytics will live here alongside your dashboard overview."
      actionLabel="Configure goals"
    />
  );
}
