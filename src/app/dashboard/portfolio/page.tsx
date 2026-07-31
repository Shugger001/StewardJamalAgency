import type { Metadata } from "next";
import Link from "next/link";
import { CreatePortfolioItemForm } from "@/components/portfolio/create-portfolio-item-form";
import {
  PortfolioItemsList,
  type PortfolioListItem,
} from "@/components/portfolio/portfolio-items-list";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portfolio",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

function projectRefFromUrl(url: string) {
  try {
    return new URL(url).hostname.split(".")[0] ?? "";
  } catch {
    return "";
  }
}

export default async function PortfolioDashboardPage() {
  if (!hasSupabaseServerEnv()) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Portfolio</h1>
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Supabase is not configured.
        </p>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const ref = projectRefFromUrl(supabaseUrl);
  const sqlEditorUrl = ref
    ? `https://supabase.com/dashboard/project/${ref}/sql/new`
    : "https://supabase.com/dashboard";

  const query = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const missingTable =
    Boolean(query.error) &&
    (() => {
      const msg = (query.error?.message ?? "").toLowerCase();
      return msg.includes("portfolio_items") && (msg.includes("does not exist") || msg.includes("schema cache"));
    })();

  const items: PortfolioListItem[] = missingTable
    ? []
    : ((query.data ?? []) as DbRow[]).map((row) => ({
        id: String(row.id ?? ""),
        title: String(row.title ?? "Untitled"),
        clientName: String(row.client_name ?? "Client"),
        url: String(row.url ?? ""),
        summary: typeof row.summary === "string" ? row.summary : null,
        outcome: typeof row.outcome === "string" ? row.outcome : null,
        imageUrl: typeof row.image_url === "string" ? row.image_url : null,
        sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
        isPublished: Boolean(row.is_published),
      }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Portfolio</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Showcase websites you have built or worked on. Published items replace sample case studies on the
            public site.
          </p>
        </div>
        <Link
          href="/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#1860F0] hover:underline"
        >
          View public portfolio →
        </Link>
      </div>

      {missingTable ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Create the portfolio table once</p>
          <p className="mt-1 text-amber-800">
            Run this migration in the Supabase SQL editor for your active project:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-amber-100/80 px-3 py-2 text-xs text-amber-950">
            {`supabase/migrations/20260731_portfolio_items.sql`}
          </pre>
          <Link
            href={sqlEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-[#1860F0] hover:underline"
          >
            Open Supabase SQL editor →
          </Link>
        </div>
      ) : null}

      {!missingTable && query.error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Could not load portfolio: {query.error.message}
        </p>
      ) : null}

      {!missingTable ? <CreatePortfolioItemForm /> : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">Your portfolio websites</h2>
        {!missingTable ? <PortfolioItemsList items={items} /> : null}
      </section>
    </div>
  );
}
