import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const query = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (query.error) {
    return NextResponse.json({ error: query.error.message }, { status: 500 });
  }

  const unreadCount = (query.data ?? []).filter((item) => !item.read).length;
  return NextResponse.json(
    {
      notifications: query.data ?? [],
      unreadCount,
    },
    { status: 200 },
  );
}
