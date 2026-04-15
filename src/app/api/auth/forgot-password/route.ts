import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { error: "Supabase auth is not configured in this environment." },
      { status: 500 },
    );
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const origin = new URL(request.url).origin;
  const redirectTo = `${appUrl || origin}/reset-password`;

  const { error } = await authClient.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    return NextResponse.json({ error: "Unable to send reset email right now." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
