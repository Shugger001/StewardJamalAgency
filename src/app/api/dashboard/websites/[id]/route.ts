import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type Body = {
  name?: string;
  client_id?: string;
  domain?: string | null;
  status?: "draft" | "published";
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
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

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) {
    updates.name = body.name.trim();
  }
  if (typeof body.client_id === "string" && body.client_id.trim()) {
    updates.client_id = body.client_id.trim();
  }
  if (body.domain !== undefined) {
    const domain =
      typeof body.domain === "string" && body.domain.trim()
        ? body.domain.trim().toLowerCase()
        : null;
    updates.domain = domain;
  }
  if (body.status === "draft" || body.status === "published") {
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const update = await supabase
    .from("websites")
    .update(updates)
    .eq("id", id)
    .select("id, name, client_id, status, domain")
    .single();

  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 400 });
  }

  revalidatePath("/dashboard/websites");
  revalidatePath(`/dashboard/websites/${id}/editor`);
  revalidatePath(`/sites/${id}`);
  if (typeof update.data?.domain === "string" && update.data.domain) {
    revalidatePath(`/sites/${update.data.domain}`);
  }
  revalidatePath("/site");

  return NextResponse.json({ ok: true, website: update.data });
}
