"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export type ListFilterOption = {
  value: string;
  label: string;
};

type DashboardListToolbarProps = {
  searchPlaceholder?: string;
  statusOptions?: ListFilterOption[];
  statusParam?: string;
  searchParam?: string;
};

/**
 * URL-synced search + optional status filter for dashboard lists.
 */
export function DashboardListToolbar({
  searchPlaceholder = "Search…",
  statusOptions,
  statusParam = "status",
  searchParam = "q",
}: DashboardListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get(searchParam) ?? "");
  const debouncedQ = useDebouncedValue(q, 300);
  const status = searchParams.get(statusParam) ?? "all";

  useEffect(() => {
    const current = searchParams.get(searchParam) ?? "";
    if (debouncedQ === current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQ.trim()) params.set(searchParam, debouncedQ.trim());
    else params.delete(searchParam);
    params.delete("page");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [debouncedQ, pathname, router, searchParam, searchParams]);

  function onStatusChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next && next !== "all") params.set(statusParam, next);
    else params.delete(statusParam);
    params.delete("page");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function clearFilters() {
    setQ("");
    startTransition(() => {
      router.replace(pathname);
    });
  }

  const hasFilters = Boolean(q.trim() || (status && status !== "all"));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="dashboard-list-search">
          Search
        </label>
        <input
          id="dashboard-list-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full max-w-sm rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1860F0]/50 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
        />
        {statusOptions && statusOptions.length > 0 ? (
          <>
            <label className="sr-only" htmlFor="dashboard-list-status">
              Status
            </label>
            <select
              id="dashboard-list-status"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[#1860F0]/50 focus:outline-none focus:ring-2 focus:ring-[#1860F0]/20"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        {pending ? <span>Updating…</span> : null}
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-[#1860F0] hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

type PaginationBarProps = {
  page: number;
  pageSize: number;
  total: number;
};

/** Simple prev/next pagination driven by URL `page` param. */
export function PaginationBar({ page, pageSize, total }: PaginationBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 text-sm">
      <p className="text-zinc-500">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={hrefFor(page - 1)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-zinc-100 px-3 py-1.5 text-zinc-300">Previous</span>
        )}
        {page < totalPages ? (
          <Link
            href={hrefFor(page + 1)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-lg border border-zinc-100 px-3 py-1.5 text-zinc-300">Next</span>
        )}
      </div>
    </div>
  );
}
