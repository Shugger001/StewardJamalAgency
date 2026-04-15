import Link from "next/link";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Set a new password</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Choose a strong password with at least 8 characters.
        </p>
        <ResetPasswordForm />
        <div className="mt-4">
          <Link href="/login" className="text-sm font-medium text-[#0A66FF] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
