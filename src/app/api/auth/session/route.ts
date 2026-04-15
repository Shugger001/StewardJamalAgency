import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type SessionRole = "admin" | "staff" | "client" | "viewer";

function normalizeRole(input: string | undefined): SessionRole {
  if (!input) return "viewer";
  const lowered = input.toLowerCase();
  if (lowered === "admin" || lowered === "staff" || lowered === "client") return lowered;
  return "viewer";
}

function decodeJwtExp(token: string | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const json = Buffer.from(payload, "base64").toString("utf8");
    const data = JSON.parse(json) as { exp?: number };
    return typeof data.exp === "number" ? data.exp : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("steward_access_token")?.value;
  const role = normalizeRole(cookieStore.get("steward_role")?.value);
  const userId = cookieStore.get("steward_user_id")?.value ?? null;
  const exp = decodeJwtExp(accessToken);

  const expiresInSeconds = exp ? Math.max(exp - Math.floor(Date.now() / 1000), 0) : null;
  const authenticated = Boolean(accessToken) && (expiresInSeconds == null || expiresInSeconds > 0);
  return NextResponse.json({
    authenticated,
    role,
    userId,
    expiresInSeconds,
  });
}
