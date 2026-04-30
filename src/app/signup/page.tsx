import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/signup-form";

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Create your account</h1>
        <div className="mt-6">
          <SignUpForm />
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
