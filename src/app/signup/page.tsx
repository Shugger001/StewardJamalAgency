import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/signup-form";
import { checkAuthHealth } from "@/lib/auth/health";

export const metadata: Metadata = {
  title: "Sign Up",
};

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  await headers();
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
  }

  const authHealth = await checkAuthHealth();
  const signupAvailable = authHealth.signupAvailable;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Create your account</h1>
        {!signupAvailable ? (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
            {authHealth.message} Sign-up is unavailable until the authentication service is restored.
          </p>
        ) : !authHealth.ok ? (
          <p className="mt-4 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-800">
            {authHealth.message}
          </p>
        ) : null}
        <div className="mt-6">
          <SignUpForm authAvailable={signupAvailable} />
        </div>
        <p className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="font-medium text-zinc-600 underline-offset-2 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
