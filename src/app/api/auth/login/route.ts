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
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
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
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session || !data.user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const accessToken = data.session.access_token;
  const userId = data.user.id;

  let role = roleFromAccessToken(accessToken);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey) {
    const serverClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const profile = await serverClient.from("profiles").select("role").eq("id", userId).maybeSingle();
    if (!profile.error) {
      role = normalizeRole(profile.data?.role) ?? role;
    }

    const bootstrapRole: AppRole = role ?? "client";
    // Bootstrap missing profile rows so first login is never blocked by role lookup.
    await serverClient
      .from("profiles")
      .upsert({ id: userId, role: bootstrapRole }, { onConflict: "id" });
  }

  // Default least-privileged dashboard when role cannot be resolved.
  const safeRole: AppRole = role ?? "client";
  const redirectTo = safeRole === "client" ? "/client-dashboard" : "/dashboard";

  const response = NextResponse.json({ ok: true, redirectTo });
  const isSecure = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: "steward_access_token",
    value: accessToken,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(data.session.expires_in ?? 3600, 60),
  });
  response.cookies.set({
    name: "steward_user_id",
    value: userId,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(data.session.expires_in ?? 3600, 60),
  });
  response.cookies.set({
    name: "steward_role",
    value: safeRole,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(data.session.expires_in ?? 3600, 60),
  });

  return response;
}
