import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { resolveAuthUserIdByEmail } from "@/lib/clients/link";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type Body = {
  email?: string | null;
  /** When true, clear clients.user_id. When false/omit with email, attempt link. */
  unlink?: boolean;
  link?: boolean;
};

function revalidateClientPaths() {
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/websites");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/payments");
  revalidatePath("/client-dashboard");
}

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
    return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const existing = await supabase.from("clients").select("id, email, user_id").eq("id", id).maybeSingle();
  if (existing.error || !existing.data) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.email === "string") {
    const nextEmail = body.email.trim().toLowerCase();
    updates.email = nextEmail || null;
  }

  if (body.unlink === true) {
    updates.user_id = null;
  } else if (body.link === true || body.unlink === false) {
    const emailForLink =
      typeof updates.email === "string"
        ? updates.email
        : typeof existing.data.email === "string"
          ? existing.data.email
          : "";
    if (!emailForLink) {
      return NextResponse.json(
        { error: "Add a client email before linking to an account." },
        { status: 400 },
      );
    }
    const linkedUserId = await resolveAuthUserIdByEmail(emailForLink);
    if (!linkedUserId) {
      return NextResponse.json(
        {
          error:
            "No auth user found for that email. Ask the client to sign up first, then link again.",
        },
        { status: 404 },
      );
    }
    updates.user_id = linkedUserId;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const update = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select("id, business_name, email, user_id")
    .single();

  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 400 });
  }

  revalidateClientPaths();
  return NextResponse.json({ ok: true, client: update.data });
}
