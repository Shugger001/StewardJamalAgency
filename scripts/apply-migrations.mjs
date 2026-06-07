#!/usr/bin/env node
/**
 * Applies supabase/setup_all.sql using:
 * - SUPABASE_DB_URL / DATABASE_URL (full Postgres URI), or
 * - SUPABASE_DB_PASSWORD + NEXT_PUBLIC_SUPABASE_URL (tries common pooler hosts)
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));

function projectRef(url) {
  try {
    return new URL(url).hostname.split(".")[0];
  } catch {
    return "";
  }
}

function poolerCandidates(ref) {
  const regions = [
    "aws-0-eu-west-1",
    "aws-0-eu-central-1",
    "aws-0-us-east-1",
    "aws-0-us-west-1",
    "aws-1-eu-west-1",
    "aws-1-us-east-1",
  ];
  return regions.flatMap((region) => [
    `postgresql://postgres.${ref}:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD)}@${region}.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${ref}:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD)}@${region}.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD)}@db.${ref}.supabase.co:5432/postgres`,
  ]);
}

async function runSql(dbUrl) {
  const sqlFile = resolve(__dirname, "../supabase/setup_all.sql");
  const sql = readFileSync(sqlFile, "utf8");
  const db = postgres(dbUrl, { max: 1, idle_timeout: 5, connect_timeout: 12 });
  try {
    await db.unsafe(sql);
    return true;
  } finally {
    await db.end({ timeout: 5 });
  }
}

const directUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const password = process.env.SUPABASE_DB_PASSWORD ?? "";

if (directUrl) {
  try {
    await runSql(directUrl);
    console.log("✓ Applied supabase/setup_all.sql");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (!password || !supabaseUrl) {
  console.error("Set SUPABASE_DB_URL or SUPABASE_DB_PASSWORD + NEXT_PUBLIC_SUPABASE_URL.");
  console.error("Password: Supabase → Project Settings → Database → Database password");
  process.exit(1);
}

const ref = projectRef(supabaseUrl);
if (!ref) {
  console.error("Invalid NEXT_PUBLIC_SUPABASE_URL.");
  process.exit(1);
}

for (const candidate of poolerCandidates(ref)) {
  try {
    await runSql(candidate);
    console.log("✓ Applied supabase/setup_all.sql");
    process.exit(0);
  } catch {
    // try next host
  }
}

console.error("Could not connect to Supabase Postgres. Verify SUPABASE_DB_PASSWORD or use SUPABASE_DB_URL.");
process.exit(1);
