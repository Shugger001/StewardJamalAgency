import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { normalizePortfolioUrl, parsePortfolioItemInput } from "@/lib/portfolio/schema";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function revalidatePortfolioPaths() {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/about");
  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard/settings");
}

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing portfolio item id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = parsePortfolioItemInput(body, { partial: true });
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data = parsed.data;
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.title !== undefined) patch.title = data.title;
  if (data.client_name !== undefined) patch.client_name = data.client_name;
  if (data.url !== undefined) patch.url = normalizePortfolioUrl(data.url);
  if (data.summary !== undefined) patch.summary = data.summary;
  if (data.outcome !== undefined) patch.outcome = data.outcome;
  if (data.image_url !== undefined) patch.image_url = data.image_url;
  if (data.sort_order !== undefined) patch.sort_order = data.sort_order;
  if (data.is_published !== undefined) patch.is_published = data.is_published;

  const supabase = createSupabaseServerClient();
  const update = await supabase
    .from("portfolio_items")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 400 });
  }

  revalidatePortfolioPaths();
  return NextResponse.json({ ok: true, item: update.data });
}

export async function DELETE(_request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing portfolio item id." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const result = await supabase.from("portfolio_items").delete().eq("id", id);
  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  revalidatePortfolioPaths();
  return NextResponse.json({ ok: true });
}
