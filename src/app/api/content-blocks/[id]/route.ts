import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { resolveRoleFromRequest } from "@/lib/auth/role";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as
    | {
        value?: string;
      }
    | null;

  if (!body || typeof body.value !== "string") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const role = resolveRoleFromRequest(await cookies(), await headers());

  if (role !== "admin" && role !== "client") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_blocks")
    .update({
      value: body.value,
    })
    .eq("id", id)
    .select("id, value")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
