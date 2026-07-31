/** Shared helpers for dashboard list URL params. */

export const DASHBOARD_PAGE_SIZE = 20;

export function parseListPage(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = Number(value ?? "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function parseListQuery(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (value ?? "").trim();
}

export function parseListStatus(raw: string | string[] | undefined, allowed: string[]) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || value === "all") return "all";
  return allowed.includes(value) ? value : "all";
}

export function escapeIlike(value: string) {
  return value.replaceAll("%", "\\%").replaceAll("_", "\\_").replaceAll(",", " ");
}
