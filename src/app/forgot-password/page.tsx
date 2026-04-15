import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Reset your password</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your email and we will send you a secure password reset link.
        </p>
        <ForgotPasswordForm />
        <div className="mt-4">
          <Link href="/login" className="text-sm font-medium text-[#0A66FF] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
