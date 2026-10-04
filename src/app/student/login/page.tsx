"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowRight, ArrowLeft, Search } from "lucide-react";
import { useAdmin } from "@/components/admin/store";
import { Avatar } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default function StudentLogin() {
  const { students, toast } = useAdmin();
  const [id, setId] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const suggestions = q.trim().length >= 2
    ? students.filter((s) => `${s.name} ${s.id}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : students.slice(0, 6);

  const signIn = (sid: string, name: string) => {
    setBusy(true);
    setTimeout(() => {
      localStorage.setItem("sv_student_id", sid);
      localStorage.setItem("sv_student_name", name);
      toast(`Welcome, ${name.split(" ")[0]}!`, "success");
      router.replace("/student");
    }, 500);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = id.trim().toLowerCase();
    const found = students.find((s) => s.id.toLowerCase() === key || s.name.toLowerCase() === key);
    if (!found) {
      toast("Student not found. Try ST-10245 or pick below.", "error");
      return;
    }
    signIn(found.id, found.name);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl md:grid-cols-[1fr_1.1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-sky-400 p-8 text-white md:flex">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
          </div>
          <div className="relative flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold">Student Portal</span>
              <span className="block text-[10.5px] font-bold tracking-[0.14em] text-white/70 uppercase">Sunshine Valley</span>
            </span>
          </div>
          <div className="relative">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight">Hi there, superstar!</h1>
            <p className="mt-2 text-[14.5px] text-white/85">Check homework, results, attendance and fees — all in one happy place.</p>
            <ul className="mt-5 space-y-2 text-[13px] font-semibold text-white/85">
              <li>✓ Report cards &amp; marks</li>
              <li>✓ Homework &amp; timetable</li>
              <li>✓ Fee receipts &amp; notices</li>
            </ul>
          </div>
          <Link href="/" className="relative inline-flex w-fit items-center gap-2 text-[13px] font-bold text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to website
          </Link>
        </div>

        <div className="p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-tight">Student Sign In</h2>
          <p className="mt-1 text-[13px] font-medium text-slate-500">Prototype — use your ID or tap a demo student.</p>

          <form onSubmit={submit} className="mt-5 flex gap-2">
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Student ID — e.g. ST-10245" aria-label="Student ID"
              className="min-w-0 flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
            <button type="submit" disabled={busy} className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-60">
              {busy ? "..." : "Go"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </button>
          </form>

          <div className="relative mt-5">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find your name..." aria-label="Find student by name"
              className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button onClick={() => signIn(s.id, s.name)}
                  className={cn("flex w-full items-center gap-2.5 rounded-xl border border-[#E2E8F0] p-2.5 text-left transition-all hover:border-sky-300 hover:bg-sky-50")}>
                  <Avatar name={s.name} size="h-9 w-9 text-xs" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold">{s.name}</span>
                    <span className="block text-[11px] font-semibold text-slate-500">{s.id} · {s.class}-{s.section}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
