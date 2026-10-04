"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, MailCheck, ArrowLeft, Send } from "lucide-react";
import { useAdmin } from "@/components/admin/store";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { toast } = useAdmin();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast("Password reset link sent to your email.", "success");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
          <GraduationCap className="h-6 w-6 text-sky-600" aria-hidden />
        </span>
        {sent ? (
          <div className="mt-5 text-center" role="status">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <MailCheck className="h-8 w-8 text-emerald-500" aria-hidden />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Check your email</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              We sent a reset link to <strong className="text-[#24324A]">{email}</strong>. It expires in 30 minutes.
            </p>
            <Link href="/admin/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#24324A] px-6 py-3 text-sm font-bold text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} aria-label="Forgot password">
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Forgot your password?</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Enter your email address and we will send you a reset link.</p>
            <label htmlFor="fp-email" className="mt-5 block text-[13px] font-bold">Email address</label>
            <input
              id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white hover:bg-sky-500">
              <Send className="h-4 w-4" aria-hidden /> Send Reset Link
            </button>
            <Link href="/admin/login" className="mt-4 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#24324A]">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
