import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

type AppRole = "admin" | "staff" | "client";

function normalizeRole(value: string | null | undefined): AppRole | null {
  if (!value) return null;
  const lowered = value.toLowerCase();
  if (lowered === "admin" || lowered === "staff" || lowered === "client") return lowered;
  return null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const json = atob(payload);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isExpired(payload: Record<string, unknown> | null): boolean {
  const exp = payload?.exp;
  if (typeof exp !== "number") return false;
  return exp <= Math.floor(Date.now() / 1000);
}

function extractTokenFromRequest(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  const customToken = request.cookies.get("steward_access_token")?.value;
  if (customToken) return customToken;

  const supabaseCookie = request.cookies
    .getAll()
    .find((cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token"));
  if (!supabaseCookie?.value) return null;

  if (supabaseCookie.value.split(".").length >= 3) return supabaseCookie.value;

  try {
    const parsed = JSON.parse(supabaseCookie.value) as { access_token?: string } | [string, string];
    if (Array.isArray(parsed)) return parsed[0] ?? null;
    return parsed.access_token ?? null;
  } catch {
    return null;
  }
}

async function resolveRole(request: NextRequest): Promise<AppRole | null> {
  const cookieRole = normalizeRole(
    request.cookies.get("steward_role")?.value ?? request.cookies.get("role")?.value,
  );
  const token = extractTokenFromRequest(request);
  if (!token) {
    return cookieRole;
  }
  const payload = decodeJwtPayload(token);
  if (isExpired(payload)) {
    return null;
  }
  const tokenRole = normalizeRole(
    String(
      (payload?.app_metadata as { role?: unknown } | undefined)?.role ??
        (payload?.user_metadata as { role?: unknown } | undefined)?.role ??
        payload?.role ??
        "",
    ),
  );
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) {
    return tokenRole ?? cookieRole;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) return null;

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const profile = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (profile.error || !profile.data) return tokenRole ?? cookieRole;

  const role = profile.data.role;
  return (role === "admin" || role === "staff" || role === "client" ? role : null) ?? tokenRole ?? cookieRole;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect dashboard areas.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/client-dashboard")) {
    const role = await resolveRole(request);
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if ((role === "admin" || role === "staff") && pathname.startsWith("/client-dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (role === "client" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/client-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/client-dashboard/:path*"],
};
