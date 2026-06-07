import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AgencyLanding } from "@/components/public/agency-landing";
import { loadPortfolioItems } from "@/lib/load-portfolio-items";

export default async function Home() {
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
  }
  const portfolioItems = await loadPortfolioItems();

  return <AgencyLanding mode="home" view="home" portfolioItems={portfolioItems} />;
}
