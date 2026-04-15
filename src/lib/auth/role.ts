import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type AppRole = "admin" | "client" | "viewer";

function normalizeRole(input: string | null | undefined): AppRole | null {
  if (!input) return null;
  const lowered = input.toLowerCase();
  if (lowered === "admin" || lowered === "client" || lowered === "viewer") {
    return lowered;
  }
  if (lowered === "readonly" || lowered === "read_only" || lowered === "read-only") {
    return "viewer";
  }
  return null;
}

export function resolveRoleFromCookies(cookieStore: ReadonlyRequestCookies): AppRole {
  const primary = normalizeRole(cookieStore.get("steward_role")?.value);
  if (primary) return primary;

  const fallback = normalizeRole(cookieStore.get("role")?.value);
  if (fallback) return fallback;

  // Secure default for unknown sessions.
  return "viewer";
}

export function resolveRoleFromHeaders(headers: Headers): AppRole {
  const primary = normalizeRole(headers.get("x-user-role"));
  if (primary) return primary;

  // Secure default for unknown sessions.
  return "viewer";
}

type JwtPayload = {
  role?: string;
  app_metadata?: { role?: string };
  user_metadata?: { role?: string };
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const segments = token.split(".");
  if (segments.length < 2) return null;

  try {
    const payload = segments[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segments[1].length / 4) * 4, "=");
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function roleFromJwt(token: string | null | undefined): AppRole | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return (
    normalizeRole(payload.app_metadata?.role) ??
    normalizeRole(payload.user_metadata?.role) ??
    normalizeRole(payload.role)
  );
}

function extractBearerToken(headers: Headers): string | null {
  const auth = headers.get("authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function extractSupabaseTokenFromCookieValue(value: string): string | null {
  // Supabase browser cookie can be a raw JWT or serialized JSON payload containing access_token.
  if (value.split(".").length >= 3) return value;
  try {
    const parsed = JSON.parse(value) as
      | { access_token?: string }
      | [string, string]
      | null;
    if (!parsed) return null;
    if (Array.isArray(parsed)) return parsed[0] ?? null;
    return parsed.access_token ?? null;
  } catch {
    return null;
  }
}

function extractSupabaseTokenFromCookies(cookieStore: ReadonlyRequestCookies): string | null {
  const all = cookieStore.getAll();
  const candidate = all.find(
    (cookie) =>
      cookie.name.includes("sb-") &&
      cookie.name.includes("auth-token") &&
      Boolean(cookie.value),
  );
  if (!candidate) return null;
  return extractSupabaseTokenFromCookieValue(candidate.value);
}

export function resolveRoleFromRequest(
  cookieStore: ReadonlyRequestCookies,
  headerStore: Headers,
): AppRole {
  const tokenRole =
    roleFromJwt(extractBearerToken(headerStore)) ??
    roleFromJwt(extractSupabaseTokenFromCookies(cookieStore));
  if (tokenRole) return tokenRole;

  const cookieRole = resolveRoleFromCookies(cookieStore);
  if (cookieRole) return cookieRole;

  return resolveRoleFromHeaders(headerStore);
}
