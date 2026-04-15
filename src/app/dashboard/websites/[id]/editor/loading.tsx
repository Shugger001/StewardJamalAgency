export default function WebsiteEditorLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-1 py-2">
      <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-7 w-64 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10">
        <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10">
        <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}
