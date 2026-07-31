import { BrandLoader } from "@/components/ui/brand-loader";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl">
      <BrandLoader label="Loading dashboard…" />
    </div>
  );
}
