import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { notifyUser } from "@/lib/notifications/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

type UpdateStatusBody = {
  status?: string;
};

const allowedStatus = new Set(["pending", "in_progress", "review", "completed"]);

export async function PATCH(request: Request, { params }: Params) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(role === "admin" || role === "staff")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as UpdateStatusBody | null;
  const status = body?.status?.trim();

  if (!status || !allowedStatus.has(status)) {
    return NextResponse.json({ error: "Invalid project status." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const existing = await supabase
    .from("projects")
    .select("client_id, title")
    .eq("id", id)
    .maybeSingle();

  if (existing.error || !existing.data) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const update = await supabase.from("projects").update({ status }).eq("id", id);

  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 500 });
  }

  const title = String(existing.data.title ?? "Your project");
  const clientId = String(existing.data.client_id ?? "");
  if (clientId) {
    await notifyUser({
      userId: clientId,
      title: `Project status updated`,
      message: `${title} is now ${status.replace("_", " ")}.`,
      emailSubject: "Project update",
      emailHtml: `<p>Your project <strong>${title}</strong> is now <strong>${status.replace(
        "_",
        " ",
      )}</strong>.</p>`,
    }).catch(() => {
      // Non-blocking side effect.
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
