import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type HealthPayload = {
  ok: boolean;
  checks: {
    supabaseUrl: boolean;
    anonKey: boolean;
    serviceRoleKey: boolean;
    authAdminReachable: boolean;
    profilesTableReachable: boolean;
  };
  message: string;
};

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const checks: HealthPayload["checks"] = {
    supabaseUrl: Boolean(supabaseUrl),
    anonKey: Boolean(anonKey),
    serviceRoleKey: Boolean(serviceRoleKey),
    authAdminReachable: false,
    profilesTableReachable: false,
  };

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return NextResponse.json(
      {
        ok: false,
        checks,
        message: "Auth environment variables are incomplete.",
      } satisfies HealthPayload,
      { status: 200 },
    );
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const users = await serviceClient.auth.admin.listUsers({ page: 1, perPage: 1 });
    checks.authAdminReachable = !Boolean(users.error);
  } catch {
    checks.authAdminReachable = false;
  }

  try {
    const profiles = await serviceClient.from("profiles").select("id").limit(1);
    checks.profilesTableReachable = !Boolean(profiles.error);
  } catch {
    checks.profilesTableReachable = false;
  }

  const ok = Object.values(checks).every(Boolean);
  return NextResponse.json(
    {
      ok,
      checks,
      message: ok
        ? "Auth health checks passed."
        : "Some auth health checks failed. Review Supabase auth trigger/profile setup.",
    } satisfies HealthPayload,
    { status: 200 },
  );
}
