import { createClient } from "@supabase/supabase-js";

export type AuthHealthChecks = {
  supabaseUrl: boolean;
  anonKey: boolean;
  serviceRoleKey: boolean;
  authReachable: boolean;
  authAdminReachable: boolean;
  profilesTableReachable: boolean;
};

export type AuthHealthResult = {
  ok: boolean;
  signupAvailable: boolean;
  checks: AuthHealthChecks;
  message: string;
};

async function pingAuthEndpoint(supabaseUrl: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/health`, {
      headers: { apikey: apiKey },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function checkAuthHealth(): Promise<AuthHealthResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const checks: AuthHealthChecks = {
    supabaseUrl: Boolean(supabaseUrl),
    anonKey: Boolean(anonKey),
    serviceRoleKey: Boolean(serviceRoleKey),
    authReachable: false,
    authAdminReachable: false,
    profilesTableReachable: false,
  };

  if (!supabaseUrl || !anonKey) {
    return {
      ok: false,
      signupAvailable: false,
      checks,
      message: "Auth environment variables are incomplete.",
    };
  }

  checks.authReachable = await pingAuthEndpoint(supabaseUrl, anonKey);

  if (!checks.authReachable) {
    return {
      ok: false,
      signupAvailable: false,
      checks,
      message:
        "The Supabase authentication service could not be reached. Verify the project is active and NEXT_PUBLIC_SUPABASE_URL is correct.",
    };
  }

  if (!serviceRoleKey) {
    return {
      ok: false,
      signupAvailable: true,
      checks,
      message: "Sign-up works, but the service role key is missing for profile and admin setup.",
    };
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const users = await serviceClient.auth.admin.listUsers({ page: 1, perPage: 1 });
    checks.authAdminReachable = !users.error;
  } catch {
    checks.authAdminReachable = false;
  }

  try {
    const profiles = await serviceClient.from("profiles").select("id").limit(1);
    checks.profilesTableReachable = !profiles.error;
  } catch {
    checks.profilesTableReachable = false;
  }

  const ok = Object.values(checks).every(Boolean);
  const signupAvailable = checks.authReachable && checks.supabaseUrl && checks.anonKey;

  return {
    ok,
    signupAvailable,
    checks,
    message: ok
      ? "Auth health checks passed."
      : signupAvailable
        ? "Account sign-up is available. Some optional admin/profile checks still need setup in Supabase."
        : "Some auth health checks failed. Review Supabase auth trigger and profile setup.",
  };
}
