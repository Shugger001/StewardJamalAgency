#!/usr/bin/env node
/**
 * Applies supabase/setup_all.sql when SUPABASE_DB_URL is set.
 * Get the URI from Supabase → Project Settings → Database → Connection string (URI).
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("Missing SUPABASE_DB_URL (or DATABASE_URL).");
  console.error("Copy the Postgres URI from Supabase → Database → Connection string.");
  process.exit(1);
}

const sqlFile = resolve(__dirname, "../supabase/setup_all.sql");
const sql = readFileSync(sqlFile, "utf8");

const db = postgres(dbUrl, { max: 1, idle_timeout: 5, connect_timeout: 15 });

try {
  await db.unsafe(sql);
  console.log("✓ Applied supabase/setup_all.sql");
} catch (error) {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await db.end({ timeout: 5 });
}
