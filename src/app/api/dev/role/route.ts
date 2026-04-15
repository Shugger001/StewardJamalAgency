import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/auth/role";

const COOKIE_NAME = "steward_role";

function isAllowedRole(value: string): value is AppRole {
  return value === "admin" || value === "client" || value === "viewer";
}

function disabledResponse() {
  return NextResponse.json(
    { error: "Role switcher is disabled." },
    { status: 403 },
  );
}

function roleFeatureEnabled() {
  return process.env.NODE_ENV === "development" || process.env.ALLOW_DEMO_LOGIN === "true";
}

export async function GET(request: Request) {
  if (!roleFeatureEnabled()) {
    return disabledResponse();
  }

  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const next = url.searchParams.get("next");
  if (role && isAllowedRole(role)) {
    const response = NextResponse.redirect(new URL(next || (role === "client" ? "/client-dashboard" : "/dashboard"), request.url));
    response.cookies.set({
      name: COOKIE_NAME,
      value: role,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return response;
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function POST(request: Request) {
  if (!roleFeatureEnabled()) {
    return disabledResponse();
  }

  const body = (await request.json().catch(() => null)) as
    | {
        role?: string;
      }
    | null;

  if (!body || !body.role || !isAllowedRole(body.role)) {
    return NextResponse.json(
      { error: "Invalid role. Use admin, client, or viewer." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true, role: body.role }, { status: 200 });
  response.cookies.set({
    name: COOKIE_NAME,
    value: body.role,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
