import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
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
    typeof emailRaw === "string" && emailRaw.trim() ? emailRaw.trim() : null;

  if (!businessName) {
    return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServerClient();
    const insert = await supabase.from("clients").insert({
      business_name: businessName,
      email,
    });

    if (insert.error) {
      return NextResponse.json(
        { error: supabaseErrorMessage(insert.error) },
        { status: 400 },
      );
    }

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/websites");
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/settings");

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: supabaseErrorMessage(error) },
      { status: 500 },
    );
  }
}
