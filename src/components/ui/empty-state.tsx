import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

/** Shared empty state for dashboard tables and cards. */
export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center">
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#1860F0] px-4 text-xs font-semibold text-white transition hover:bg-[#1448C4]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
