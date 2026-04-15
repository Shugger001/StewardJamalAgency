import { createClient } from "@supabase/supabase-js";

function readSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, serviceRoleKey };
}

export function hasSupabaseServerEnv() {
  const { supabaseUrl, serviceRoleKey } = readSupabaseEnv();
  return Boolean(supabaseUrl && serviceRoleKey);
}

export function createSupabaseServerClient() {
  const { supabaseUrl, serviceRoleKey } = readSupabaseEnv();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
