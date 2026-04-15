import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";

export async function GET() {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Supabase server environment is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const { userId, role } = getRequestAuthContext(cookieStore, headerStore);
  if (!userId || role === "viewer") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const query = supabase
    .from("bookings")
    .select("*")
    .order("scheduled_for", { ascending: true })
    .limit(50);

  const { data, error } =
    role === "admin" || role === "staff" ? await query : await query.eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ bookings: data ?? [] });
}

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Supabase server environment is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const { userId, role } = getRequestAuthContext(cookieStore, headerStore);
  if (!userId || (role !== "client" && role !== "admin" && role !== "staff")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    service?: string;
    notes?: string;
    scheduledFor?: string;
  };

  const service = String(body.service ?? "").trim();
  const notes = String(body.notes ?? "").trim();
  const scheduledFor = String(body.scheduledFor ?? "");
  if (!service || !scheduledFor) {
    return NextResponse.json({ error: "Service and date/time are required." }, { status: 400 });
  }

  const scheduledDate = new Date(scheduledFor);
  if (Number.isNaN(scheduledDate.getTime())) {
    return NextResponse.json({ error: "Invalid date/time selected." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("bookings").insert({
    user_id: userId,
    service,
    notes: notes || null,
    scheduled_for: scheduledDate.toISOString(),
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
