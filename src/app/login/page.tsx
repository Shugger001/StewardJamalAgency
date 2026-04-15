import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
  }

  const demoLoginEnabled =
    process.env.NODE_ENV === "development" || process.env.ALLOW_DEMO_LOGIN === "true";
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasSupabaseServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const authReady = hasSupabaseUrl && hasSupabaseAnon && hasSupabaseServiceRole;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Login required</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Authentication must be configured to access role-based dashboards.
        </p>
        <div
          className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
            authReady
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p className="font-medium">{authReady ? "Auth configuration looks ready." : "Auth configuration is incomplete."}</p>
          <div className="mt-2 grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
            <p>NEXT_PUBLIC_SUPABASE_URL: {hasSupabaseUrl ? "configured" : "missing"}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasSupabaseAnon ? "configured" : "missing"}</p>
            <p>SUPABASE_SERVICE_ROLE_KEY: {hasSupabaseServiceRole ? "configured" : "missing"}</p>
            <p>ALLOW_DEMO_LOGIN: {demoLoginEnabled ? "enabled" : "disabled"}</p>
          </div>
        </div>
        <LoginForm />
        {demoLoginEnabled && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Quick Access
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/api/dev/role?role=admin&next=/dashboard"
                className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700"
              >
                Continue as Admin
              </Link>
              <Link
                href="/api/dev/role?role=staff&next=/dashboard"
                className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700"
              >
                Continue as Staff
              </Link>
              <Link
                href="/api/dev/role?role=client&next=/client-dashboard"
                className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700"
              >
                Continue as Client
              </Link>
            </div>
          </div>
        )}
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
