import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/signup-form";
import { AuthHealthBanner } from "@/components/auth/auth-health-banner";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage() {
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
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Create your account</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sign up to access your role-based dashboard and manage agency operations.
        </p>
        <AuthHealthBanner />
        <SignUpForm />
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
