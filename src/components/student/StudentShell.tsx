"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, redirect } from "next/navigation";
import {
  LayoutDashboard, UserRound, ClipboardCheck, Trophy, Wallet,
  NotebookPen, CalendarDays, CalendarOff, Bell, LogOut, Menu, X, GraduationCap, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "../admin/store";
import { Avatar } from "../admin/ui";

const menu = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Profile", href: "/student/profile", icon: UserRound },
  { label: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
  { label: "Results", href: "/student/results", icon: Trophy },
  { label: "Fees", href: "/student/fees", icon: Wallet },
  { label: "Homework", href: "/student/homework", icon: NotebookPen },
  { label: "Timetable", href: "/student/timetable", icon: CalendarDays },
  { label: "Holidays", href: "/student/holidays", icon: CalendarOff },
  { label: "Notices", href: "/student/notices", icon: Bell },
];

export function currentStudentId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sv_student_id");
}

function Sidebar({ studentName, studentClass, onNav }: { studentName: string; studentClass: string; onNav?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex h-full flex-col bg-white">
      <Link href="/student" onClick={onNav} className="flex items-center gap-2.5 border-b border-[#E2E8F0] px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400">
          <GraduationCap className="h-5 w-5 text-white" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-extrabold tracking-tight text-[#24324A]">Student Portal</span>
          <span className="block text-[10.5px] font-bold tracking-[0.14em] text-[#64748B] uppercase">Sunshine Valley</span>
        </span>
      </Link>

      <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4">
        <Avatar name={studentName} />
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{studentName}</p>
          <p className="text-xs font-semibold text-slate-500">{studentClass}</p>
        </div>
      </div>

      <nav className="nice-scroll flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Student navigation">
        {menu.map((m) => {
          const active = m.href === "/student" ? pathname === "/student" : pathname === m.href || pathname.startsWith(m.href + "/");
          return (
            <Link
              key={m.href}
              href={m.href}
              onClick={onNav}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors",
                active ? "bg-sky-50 text-sky-600" : "text-[#475569] hover:bg-slate-50 hover:text-[#24324A]"
              )}
            >
              {active && <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sky-400" aria-hidden />}
              <m.icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-sky-500" : "text-slate-400")} aria-hidden />
              {m.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[#E2E8F0] p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-[#475569] hover:bg-slate-50">
          <Globe className="h-[18px] w-[18px] text-slate-400" aria-hidden /> School Website
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("sv_student_id");
            localStorage.removeItem("sv_student_name");
            router.replace("/student/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden /> Logout
        </button>
      </div>
    </div>
  );
}

export default function StudentShell({ children }: { children: ReactNode }) {
  const [sid] = useState<string | null>(() => currentStudentId());
  const [drawer, setDrawer] = useState(false);
  const { students } = useAdmin();

  if (!sid) redirect("/student/login");
  const me = students.find((s) => s.id === sid);
  const name = typeof window !== "undefined" ? localStorage.getItem("sv_student_name") || me?.name || "Student" : "Student";
  const cls = me ? `${me.class}-${me.section}` : "";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-[#E2E8F0] lg:block">
        <Sidebar studentName={name} studentClass={cls} />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-[#24324A]/50" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="absolute top-0 bottom-0 left-0 w-72 max-w-[85vw] border-r border-[#E2E8F0]">
            <button onClick={() => setDrawer(false)} aria-label="Close navigation" className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <X className="h-4 w-4" aria-hidden />
            </button>
            <Sidebar studentName={name} studentClass={cls} onNav={() => setDrawer(false)} />
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setDrawer(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <div>
              <p className="text-[12px] font-bold text-slate-500">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
              <p className="text-[16px] leading-tight font-extrabold">Hello, {name.split(" ")[0]}!</p>
            </div>
            <div className="ml-auto">
              <Avatar name={name} />
            </div>
          </div>
        </div>
        <div className="w-full px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
