import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DbSetupStatus = {
  ready: boolean;
  missing: string[];
  sqlEditorUrl: string;
  /** True when public.leads exists but phone column is missing. */
  leadsPhoneReady: boolean;
};

const CORE_TABLES = [
  "profiles",
  "leads",
  "clients",
  "websites",
  "projects",
  "payments",
  "notifications",
  "bookings",
] as const;

function projectRefFromUrl(url: string) {
  try {
    return new URL(url).hostname.split(".")[0] ?? "";
  } catch {
    return "";
  }
}

export async function checkDbSetup(): Promise<DbSetupStatus> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const ref = projectRefFromUrl(supabaseUrl);
  const sqlEditorUrl = ref
    ? `https://supabase.com/dashboard/project/${ref}/sql/new`
    : "https://supabase.com/dashboard";

  const supabase = createSupabaseServerClient();
  const missing: string[] = [];

  await Promise.all(
    CORE_TABLES.map(async (table) => {
      const result = await supabase.from(table).select("id").limit(1);
      if (result.error) missing.push(table);
    }),
  );

  let leadsPhoneReady = missing.includes("leads") ? false : true;
  if (!missing.includes("leads")) {
    const phoneProbe = await supabase.from("leads").select("phone").limit(1);
    if (phoneProbe.error) {
      const msg = phoneProbe.error.message.toLowerCase();
      if (msg.includes("phone") || msg.includes("schema cache") || msg.includes("column")) {
        leadsPhoneReady = false;
      }
    }
  }

  return {
    ready: missing.length === 0,
    missing,
    sqlEditorUrl,
    leadsPhoneReady,
  };
}
