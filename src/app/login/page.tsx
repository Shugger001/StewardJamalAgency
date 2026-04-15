import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Login required</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Authentication must be configured to access role-based dashboards.
        </p>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
