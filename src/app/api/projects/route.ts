import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CreateProjectBody = {
  title?: string;
  description?: string;
  client_id?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateProjectBody | null;
  const title = body?.title?.trim();
  const description = body?.description?.trim();
  const clientId = body?.client_id?.trim();

  if (!title || !description || !clientId) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const insert = await supabase.from("projects").insert({
    title,
    description,
    client_id: clientId,
    status: "pending",
  });

  if (insert.error) {
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
