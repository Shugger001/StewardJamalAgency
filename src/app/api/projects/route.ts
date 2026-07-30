import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { resolveLinkedClientIds } from "@/lib/clients/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CreateProjectBody = {
  title?: string;
  description?: string;
  client_id?: string;
};

export async function POST(request: Request) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (role === "viewer") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as CreateProjectBody | null;
  const title = body?.title?.trim();
  const description = body?.description?.trim();
  const clientId = body?.client_id?.trim();

  if (!title || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let targetClientId = clientId;
  if (role === "client") {
    const linked = await resolveLinkedClientIds(userId);
    targetClientId = linked.find((id) => id !== userId) ?? linked[0] ?? undefined;
    if (!targetClientId) {
      return NextResponse.json(
        { error: "No linked client record. Ask an admin to link your account." },
        { status: 400 },
      );
    }
  }
  if (!targetClientId) {
    return NextResponse.json({ error: "Missing client target." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const insert = await supabase.from("projects").insert({
    title,
    description,
    client_id: targetClientId,
    status: "pending",
  });

  if (insert.error) {
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/client-dashboard");

  return NextResponse.json({ ok: true }, { status: 201 });
}
