import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

function isAuthorized(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const setupToken = process.env.ADMIN_SETUP_TOKEN?.trim();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!token) return false;
  if (setupToken && token === setupToken) return true;
  if (serviceRole && token === serviceRole) return true;
  return false;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json(
      {
        error:
          "Missing SUPABASE_DB_URL. Add the Postgres URI from Supabase → Database → Connection string, then retry.",
      },
      { status: 500 },
    );
  }

  const sqlPath = resolve(process.cwd(), "supabase/setup_all.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const db = postgres(dbUrl, { max: 1, idle_timeout: 5, connect_timeout: 20 });

  try {
    await db.unsafe(sql);
    return NextResponse.json({ ok: true, message: "Database bootstrap applied." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bootstrap failed." },
      { status: 500 },
    );
  } finally {
    await db.end({ timeout: 5 });
  }
}
