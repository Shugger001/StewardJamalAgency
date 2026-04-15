import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A66FF]">
          The Steward Jamal Agency
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Agency operations, websites, projects, and billing in one place.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
          Manage clients, launch websites, track payments, and keep teams aligned with a
          production-ready dashboard.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
