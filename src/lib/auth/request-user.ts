import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { resolveRoleFromRequest, type AppRole } from "@/lib/auth/role";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractBearerToken(headerStore: Headers): string | null {
  const auth = headerStore.get("authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function extractSupabaseTokenFromCookies(cookieStore: ReadonlyRequestCookies): string | null {
  const customToken = cookieStore.get("steward_access_token")?.value;
  if (customToken) return customToken;

  const cookie = cookieStore
    .getAll()
    .find((entry) => entry.name.includes("sb-") && entry.name.includes("auth-token"));
  if (!cookie?.value) return null;
  if (cookie.value.split(".").length >= 3) return cookie.value;
  try {
    const parsed = JSON.parse(cookie.value) as { access_token?: string } | [string, string];
    if (Array.isArray(parsed)) return parsed[0] ?? null;
    return parsed.access_token ?? null;
  } catch {
    return null;
  }
}

function extractUserId(cookieStore: ReadonlyRequestCookies, headerStore: Headers): string | null {
  const fromCookie =
    cookieStore.get("steward_user_id")?.value ?? cookieStore.get("user_id")?.value ?? null;
  if (fromCookie) return fromCookie;

  const fromHeader = headerStore.get("x-user-id");
  if (fromHeader) return fromHeader;

  const token = extractBearerToken(headerStore) ?? extractSupabaseTokenFromCookies(cookieStore);
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const subject = payload?.sub;
  return typeof subject === "string" ? subject : null;
}

export function getRequestAuthContext(
  cookieStore: ReadonlyRequestCookies,
  headerStore: Headers,
): {
  userId: string | null;
  role: AppRole;
} {
  return {
    userId: extractUserId(cookieStore, headerStore),
    role: resolveRoleFromRequest(cookieStore, headerStore),
  };
}
