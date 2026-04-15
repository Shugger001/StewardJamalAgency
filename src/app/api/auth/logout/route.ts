import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const isSecure = process.env.NODE_ENV === "production";

  for (const name of ["steward_access_token", "steward_user_id", "steward_role"]) {
    response.cookies.set({
      name,
      value: "",
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
