import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { resolveAuthUserIdByEmail } from "@/lib/clients/link";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Body = {
  business_name?: string;
  email?: string | null;
};

function supabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Database request failed.";
}

function isMissingClientsEmailColumn(message: string): boolean {
  const lower = message.toLowerCase();
  if (!lower.includes("email")) return false;
  const namesClients =
    lower.includes("clients") || lower.includes("relation \"clients\"") || lower.includes("public.clients");
  if (!namesClients) return false;
  return (
    lower.includes("schema cache") ||
    (lower.includes("could not find") && lower.includes("column")) ||
    (lower.includes("does not exist") && lower.includes("column"))
  );
}

function revalidateClientPaths() {
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/websites");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/settings");
  revalidatePath("/client-dashboard");
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
    return NextResponse.json(
      { error: "Supabase is not configured on the server." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  const businessName = body?.business_name?.trim() ?? "";
  const emailRaw = body?.email;
  const email =
    typeof emailRaw === "string" && emailRaw.trim() ? emailRaw.trim().toLowerCase() : null;

  if (!businessName) {
    return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServerClient();
    const linkedUserId = email ? await resolveAuthUserIdByEmail(email) : null;

    let warning: string | null = null;
    let insert = await supabase
      .from("clients")
      .insert({
        business_name: businessName,
        ...(email ? { email } : {}),
        ...(linkedUserId ? { user_id: linkedUserId } : {}),
      })
      .select("id, business_name, email, user_id")
      .single();

    if (insert.error && email) {
      const errMsg = supabaseErrorMessage(insert.error);
      if (isMissingClientsEmailColumn(errMsg)) {
        insert = await supabase
          .from("clients")
          .insert({ business_name: businessName })
          .select("id, business_name, email, user_id")
          .single();
        warning =
          "Client was saved without email: your `clients` table has no `email` column yet. Run supabase/migrations/20260730_clients_user_link.sql.";
      } else if (errMsg.toLowerCase().includes("user_id")) {
        insert = await supabase
          .from("clients")
          .insert({
            business_name: businessName,
            ...(email ? { email } : {}),
          })
          .select("id, business_name, email, user_id")
          .single();
        warning =
          "Client saved without portal link: run supabase/migrations/20260730_clients_user_link.sql then use Link on the clients list.";
      } else {
        return NextResponse.json({ error: errMsg }, { status: 400 });
      }
    } else if (insert.error) {
      return NextResponse.json({ error: supabaseErrorMessage(insert.error) }, { status: 400 });
    }

    revalidateClientPaths();

    const linked = Boolean(insert.data?.user_id);
    const successNote = linked
      ? "Client added and linked to an existing account."
      : email
        ? "Client added. No matching auth user yet — they can sign up with this email, then use Link."
        : undefined;

    return NextResponse.json(
      {
        ok: true as const,
        linked,
        ...(warning ? { warning } : {}),
        ...(successNote ? { notice: successNote } : {}),
        client: insert.data ?? null,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: supabaseErrorMessage(error) }, { status: 500 });
  }
}
