import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { createWebsiteWithScaffold } from "@/lib/websites/create-website-scaffold";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Body = {
  name?: string;
  client_id?: string;
  status?: string;
};

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
  const name = body?.name?.trim() ?? "";
  const clientId = body?.client_id?.trim() ?? "";
  const status = body?.status?.trim() ?? "";

  if (!name || !clientId || !status) {
    return NextResponse.json(
      { error: "Website name, client, and status are required." },
      { status: 400 },
    );
  }

  if (status !== "draft" && status !== "published") {
    return NextResponse.json({ error: "Status must be draft or published." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const result = await createWebsiteWithScaffold(supabase, {
    name,
    clientId,
    status: status as "draft" | "published",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  revalidatePath("/dashboard/websites");

  return NextResponse.json({ ok: true }, { status: 201 });
}
