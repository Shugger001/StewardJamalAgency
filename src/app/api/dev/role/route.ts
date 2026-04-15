import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/auth/role";

const COOKIE_NAME = "steward_role";

function isAllowedRole(value: string): value is AppRole {
  return value === "admin" || value === "client" || value === "viewer";
}

function disabledResponse() {
  return NextResponse.json(
    { error: "Dev role switcher is only available in development." },
    { status: 403 },
  );
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return disabledResponse();
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
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
