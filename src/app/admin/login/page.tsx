"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ShieldCheck, Presentation, Calculator, Library, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAdmin } from "@/components/admin/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/data/sms";

const roles: Array<{ id: Role; title: string; icon: typeof ShieldCheck; color: string }> = [
  { id: "super-admin", title: "Super Admin", icon: ShieldCheck, color: "bg-[#24324A]" },
  { id: "teacher", title: "Teacher", icon: Presentation, color: "bg-emerald-500" },
  { id: "accountant", title: "Accountant", icon: Calculator, color: "bg-violet-500" },
  { id: "librarian", title: "Librarian", icon: Library, color: "bg-orange-400" },
];

const demo: Record<Role, { email: string; name: string }> = {
  "super-admin": { email: "admin@school.edu", name: "Amelia Hart" },
  admin: { email: "admin@school.edu", name: "Amelia Hart" },
  teacher: { email: "sarah@school.edu", name: "Sarah Ahmed" },
  accountant: { email: "accounts@school.edu", name: "Robert Dutta" },
  librarian: { email: "library@school.edu", name: "Kamal Uddin" },
  admission: { email: "admission@school.edu", name: "Farhana Eve" },
};

export default function AdminLogin() {
  const [role, setRole] = useState<Role>("super-admin");
  const [email, setEmail] = useState(demo["super-admin"].email);
  const [pass, setPass] = useState("sunshine123");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { toast, log } = useAdmin();

  const pick = (r: Role) => {
    setRole(r);
    setEmail(demo[r].email);
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      localStorage.setItem("sv_role", role);
      localStorage.setItem("sv_user", demo[role].name);
      log(`${demo[role].name} signed in`, "Security", demo[role].name);
      toast(`Welcome back, ${demo[role].name}!`, "success");
      router.replace("/admin");
    }, 700);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl md:grid-cols-[1fr_1.1fr]">
        {/* left */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#24324A] p-8 text-white md:flex">
          <Image
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
            alt="Students learning in a bright classroom"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="relative flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold">Sunshine Valley</span>
              <span className="block text-[10.5px] font-bold tracking-[0.14em] text-white/60 uppercase">Management Portal</span>
            </span>
          </div>
          <div className="relative">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight">Welcome Back!</h1>
            <p className="mt-2 text-[14.5px] text-white/70">Manage your school, empower your students.</p>
            <ul className="mt-5 space-y-2 text-[13px] font-semibold text-white/75">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />1,248 students · 86 teachers · one panel</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />Role-based access for every staff member</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />Live attendance, fees &amp; results</li>
            </ul>
          </div>
          <Link href="/" className="relative inline-flex w-fit items-center gap-2 text-[13px] font-bold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to website
          </Link>
        </div>

        {/* right */}
        <form onSubmit={login} className="p-7 sm:p-9" aria-label="Admin login">
          <h2 className="text-2xl font-extrabold tracking-tight">Sign In</h2>
          <p className="mt-1 text-[13px] font-medium text-slate-500">Prototype build — pick a role and continue.</p>

          <div className="mt-5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Choose role">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={role === r.id}
                onClick={() => pick(r.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border-2 p-3 text-left transition-all",
                  role === r.id ? "border-sky-400 bg-sky-50" : "border-[#E2E8F0] hover:border-slate-300"
                )}
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.color)}>
                  <r.icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-[13px] leading-tight font-bold">{r.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="login-email" className="text-[13px] font-bold">Email</label>
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
            </div>
            <div>
              <label htmlFor="login-pass" className="text-[13px] font-bold">Password</label>
              <div className="relative mt-1.5">
                <input id="login-pass" type={show ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} required autoComplete="current-password"
                  className="w-full rounded-xl border border-[#E2E8F0] px-4 py-2.5 pr-11 text-sm font-medium outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[13px] font-semibold">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-sky-500" />
              Remember me
            </label>
            <Link href="/admin/forgot-password" className="text-sky-600 hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={busy} className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-sky-500 disabled:opacity-60">
            {busy ? "Signing in..." : "Sign In"}
            {!busy && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => { setRole("super-admin"); setEmail(demo["super-admin"].email); }}
            className="mt-2.5 w-full rounded-xl border border-dashed border-[#E2E8F0] px-6 py-3 text-sm font-bold text-slate-500 hover:border-sky-300 hover:text-sky-600"
          >
            Continue as Demo Admin
          </button>
        </form>
      </div>
    </div>
  );
}
