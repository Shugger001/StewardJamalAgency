import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Resolve an auth user id from an email via profiles first, then Auth Admin.
 */
export async function resolveAuthUserIdByEmail(emailInput: string): Promise<string | null> {
  const email = emailInput.trim().toLowerCase();
  if (!email) return null;

  const supabase = createSupabaseServerClient();
  const byProfile = await supabase.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (!byProfile.error && byProfile.data?.id) return String(byProfile.data.id);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) return null;

  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const match = listed.data?.users?.find((user) => user.email?.toLowerCase() === email);
  return match?.id ?? null;
}

/**
 * Client row ids the authenticated user is allowed to act on (portal + payments).
 */
export async function resolveLinkedClientIds(userId: string): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const ids = new Set<string>([userId]);

  const byUser = await supabase.from("clients").select("id").eq("user_id", userId);
  for (const row of byUser.data ?? []) {
    const id = typeof row.id === "string" ? row.id : "";
    if (id) ids.add(id);
  }

  const profile = await supabase.from("profiles").select("email").eq("id", userId).maybeSingle();
  const email =
    !profile.error && typeof profile.data?.email === "string"
      ? profile.data.email.trim().toLowerCase()
      : "";
  if (email) {
    const byEmail = await supabase.from("clients").select("id").ilike("email", email);
    for (const row of byEmail.data ?? []) {
      const id = typeof row.id === "string" ? row.id : "";
      if (id) ids.add(id);
    }
  }

  return [...ids];
}

/** True when a client-role user may use this clients.id (or legacy auth-id-as-client-id). */
export async function clientOwnsClientId(userId: string, clientId: string): Promise<boolean> {
  if (userId === clientId) return true;
  const linked = await resolveLinkedClientIds(userId);
  return linked.includes(clientId);
}
