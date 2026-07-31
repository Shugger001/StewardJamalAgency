import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { normalizePortfolioUrl, parsePortfolioItemInput } from "@/lib/portfolio/schema";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

function revalidatePortfolioPaths() {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/about");
  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard/settings");
}

export async function POST(request: Request) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(role === "admin" || role === "staff")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = parsePortfolioItemInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = createSupabaseServerClient();
  const insert = await supabase
    .from("portfolio_items")
    .insert({
      title: data.title,
      client_name: data.client_name,
      url: normalizePortfolioUrl(data.url ?? ""),
      summary: data.summary ?? null,
      outcome: data.outcome ?? null,
      image_url: data.image_url ?? null,
      sort_order: data.sort_order ?? 0,
      is_published: data.is_published ?? true,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (insert.error) {
    const msg = insert.error.message.toLowerCase();
    if (msg.includes("portfolio_items") && (msg.includes("does not exist") || msg.includes("schema cache"))) {
      return NextResponse.json(
        {
          error:
            "Portfolio table is missing. Run supabase/migrations/20260731_portfolio_items.sql in the Supabase SQL editor.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: insert.error.message }, { status: 400 });
  }

  revalidatePortfolioPaths();
  return NextResponse.json({ ok: true, item: insert.data }, { status: 201 });
}
