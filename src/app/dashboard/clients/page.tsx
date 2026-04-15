import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientsPage() {
  return (
    <SectionPlaceholder
      title="Clients"
      description="When you connect your CRM or add clients manually, they will appear here with projects and billing in context."
      actionLabel="Add client"
    />
  );
}
