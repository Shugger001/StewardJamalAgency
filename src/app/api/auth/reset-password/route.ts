import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type AppRole = "admin" | "staff" | "client";

function normalizeRole(input: unknown): AppRole | null {
  if (typeof input !== "string") return null;
  const lowered = input.toLowerCase();
  if (lowered === "admin" || lowered === "staff" || lowered === "client") return lowered;
  return null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split(".");
  if (segments.length < 2) return null;
  try {
    const payload = segments[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segments[1].length / 4) * 4, "=");
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function roleFromAccessToken(accessToken: string): AppRole | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;

  const appMetadata =
    typeof payload.app_metadata === "object" && payload.app_metadata !== null
      ? (payload.app_metadata as Record<string, unknown>)
      : null;
  const userMetadata =
    typeof payload.user_metadata === "object" && payload.user_metadata !== null
      ? (payload.user_metadata as Record<string, unknown>)
      : null;

  return (
    normalizeRole(appMetadata?.role) ??
    normalizeRole(userMetadata?.role) ??
    normalizeRole(payload.role)
  );
}

export async function POST(request: Request) {
  const { access_token, refresh_token, password } = (await request.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    password?: string;
  };

  if (!access_token || !refresh_token || !password) {
    return NextResponse.json(
      { error: "Reset token and new password are required." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
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

  const setSessionResult = await authClient.auth.setSession({ access_token, refresh_token });
  if (setSessionResult.error || !setSessionResult.data.session) {
    return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
  }

  const updateResult = await authClient.auth.updateUser({ password });
  if (updateResult.error || !updateResult.data.user) {
    return NextResponse.json({ error: "Unable to update password." }, { status: 400 });
  }

  const session = setSessionResult.data.session;
  const user = updateResult.data.user;
  let role = roleFromAccessToken(session.access_token);

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey) {
    const serverClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const profile = await serverClient.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile.error) {
      role = normalizeRole(profile.data?.role) ?? role;
    }
  }

  const safeRole: AppRole = role ?? "client";
  const redirectTo = safeRole === "client" ? "/client-dashboard" : "/dashboard";
  const response = NextResponse.json({ ok: true, redirectTo });
  const isSecure = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: "steward_access_token",
    value: session.access_token,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(session.expires_in ?? 3600, 60),
  });
  response.cookies.set({
    name: "steward_user_id",
    value: user.id,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(session.expires_in ?? 3600, 60),
  });
  response.cookies.set({
    name: "steward_role",
    value: safeRole,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(session.expires_in ?? 3600, 60),
  });

  return response;
}
