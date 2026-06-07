import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DbSetupStatus = {
  ready: boolean;
  missing: string[];
  sqlEditorUrl: string;
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

  return {
    ready: missing.length === 0,
    missing,
    sqlEditorUrl,
  };
}
