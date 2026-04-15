type AppRole = "admin" | "staff" | "client";

function normalizedAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";
  return new Set(
    raw
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function resolveBootstrapRole(email: string | null | undefined, fallback: AppRole): AppRole {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  if (!normalizedEmail) return fallback;
  return normalizedAllowlist().has(normalizedEmail) ? "admin" : fallback;
}
