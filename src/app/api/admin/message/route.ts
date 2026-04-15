import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { notifyUser } from "@/lib/notifications/service";

type Body = {
  user_id?: string;
  title?: string;
  message?: string;
};

export async function POST(request: Request) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(role === "admin" || role === "staff")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  const targetUserId = body?.user_id?.trim();
  const title = body?.title?.trim();
  const message = body?.message?.trim();

  if (!targetUserId || !title || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    await notifyUser({
      userId: targetUserId,
      title,
      message,
      emailSubject: title,
      emailHtml: `<p>${message}</p>`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to notify user." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
