"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  GraduationCap, Users, ClipboardCheck, Wallet, FileText, CalendarDays,
  UserPlus, UserRoundPlus, BellPlus, Receipt, Award, Trophy, ArrowRight,
  UserRound, CreditCard, ClipboardList,
} from "lucide-react";
import { PageHeader, StatCard, Badge, Progress } from "@/components/admin/ui";
import { GrowthLine, AttendanceArea, CollectionBar, DistributionDonut } from "@/components/admin/charts";
import { useAdmin, statusOfApp } from "@/components/admin/store";
import {
  growthSeries, attendanceSeries, collectionSeries, distribution, tk, todayISO,
  pastStatus, exams, weekDays,
} from "@/data/sms";
import { currentUser } from "@/components/admin/Shell";

const hour = new Date().getHours();
const greet = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

export default function AdminDashboard() {
  const { students, teachers, attendance, holidays, settings, invoices, applications, appStatus, activity } = useAdmin();
  const today = todayISO();
  const user = typeof window !== "undefined" ? currentUser() : "Admin";
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const holidaySet = useMemo(() => new Set(holidays.map((h) => h.date)), [holidays]);

  let p = 0, a = 0, l = 0;
  students.forEach((s) => {
    const key = `${today}|${s.class}|${s.section}`;
    const st: string = attendance[key]?.[s.id] ?? pastStatus(today, s.id, holidaySet, settings.weeklyHoliday);
    if (st === "P") p++;
    else if (st === "A") a++;
    else if (st === "L") l++;
  });
  const total = p + a + l || 1;
  const pct = ((p / total) * 100).toFixed(1);

  const collected = invoices.filter((v) => v.status === "Paid" || v.status === "Partial").reduce((x, v) => x + v.paid, 0);
  const pending = applications.filter((x) => statusOfApp(appStatus, x.id) === "Pending").length;
  const upcomingExams = exams.filter((e) => e.status !== "Completed").length;

  const quick = [
    { label: "Add Student", href: "/admin/students", icon: UserPlus, bg: "bg-sky-400" },
    { label: "Add Teacher", href: "/admin/teachers", icon: UserRoundPlus, bg: "bg-violet-400" },
    { label: "Create Notice", href: "/admin/notices", icon: BellPlus, bg: "bg-amber-400" },
    { label: "Record Payment", href: "/admin/payments", icon: Receipt, bg: "bg-emerald-400" },
    { label: "Create Exam", href: "/admin/exams", icon: Award, bg: "bg-orange-400" },
    { label: "Publish Result", href: "/admin/results", icon: Trophy, bg: "bg-pink-400" },
  ];

  const actIcon = (m: string) => {
    if (m === "Finance") return <CreditCard className="h-4 w-4 text-emerald-500" aria-hidden />;
    if (m === "Results") return <Trophy className="h-4 w-4 text-amber-500" aria-hidden />;
    if (m === "Notices") return <BellPlus className="h-4 w-4 text-sky-500" aria-hidden />;
    if (m === "Library") return <UserRound className="h-4 w-4 text-violet-500" aria-hidden />;
    return <ClipboardList className="h-4 w-4 text-slate-400" aria-hidden />;
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${greet}, ${user}!`}
        sub={`Here's what's happening at your school today · ${dateStr}`}
        action={
          <Link href="/admin/admissions" className="inline-flex items-center gap-2 rounded-xl bg-[#24324A] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a2639]">
            {pending} pending admissions <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      {/* stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard icon={GraduationCap} label="Total Students" value="1,248" trend="+8.2%" compare="vs last year" bg="bg-sky-400" />
        <StatCard icon={Users} label="Total Teachers" value={String(teachers.length)} trend="+4.5%" compare="vs last year" bg="bg-violet-400" />
        <StatCard icon={ClipboardCheck} label="Today's Attendance" value={`${pct}%`} compare={`${p.toLocaleString()} present today`} bg="bg-emerald-400" />
        <StatCard icon={Wallet} label="Monthly Collection" value={tk(845000)} trend="+12.4%" compare="June 2026" bg="bg-amber-400" />
        <StatCard icon={FileText} label="Pending Admissions" value={String(pending)} compare="awaiting review" bg="bg-orange-400" />
        <StatCard icon={CalendarDays} label="Upcoming Exams" value={String(upcomingExams).padStart(2, "0")} compare="Mid Term + Final" bg="bg-pink-400" />
      </div>

      {/* charts row 1 */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#24324A]">Student Growth</h2>
              <p className="text-xs font-medium text-slate-500">Jan – Jun 2026</p>
            </div>
            <Badge tone="Active" dot>+163 this term</Badge>
          </div>
          <div className="mt-3"><GrowthLine data={growthSeries} /></div>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#24324A]">Attendance Overview</h2>
              <p className="text-xs font-medium text-slate-500">This week · {weekDays[settings.weeklyHoliday]} is holiday</p>
            </div>
            <Link href="/admin/attendance" className="text-[13px] font-bold text-sky-600 hover:underline">View register</Link>
          </div>
          <div className="mt-3"><AttendanceArea data={attendanceSeries} /></div>
        </div>
      </div>

      {/* charts row 2 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 xl:col-span-1">
          <h2 className="text-[15px] font-extrabold text-[#24324A]">Today&apos;s Attendance</h2>
          <div className="mt-4 flex items-center gap-5">
            <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`Attendance ${pct} percent`}>
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#34D399" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(p / total) * 326.7} 326.7`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-[#24324A]">{pct}%</span>
                <span className="text-[11px] font-bold text-slate-500">present</span>
              </div>
            </div>
            <ul className="flex-1 space-y-2.5 text-[13px] font-semibold">
              <li className="flex justify-between"><span className="flex items-center gap-2 text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />Present</span><strong>{p.toLocaleString()}</strong></li>
              <li className="flex justify-between"><span className="flex items-center gap-2 text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden />Absent</span><strong>{a.toLocaleString()}</strong></li>
              <li className="flex justify-between"><span className="flex items-center gap-2 text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden />Late</span><strong>{l.toLocaleString()}</strong></li>
            </ul>
          </div>
          <Link href="/admin/attendance" className="mt-4 block rounded-xl bg-slate-50 py-2.5 text-center text-[13px] font-bold text-sky-600 hover:bg-sky-50">
            View Attendance
          </Link>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-[15px] font-extrabold text-[#24324A]">Fee Collection</h2>
          <p className="text-xs font-medium text-slate-500">Jan – Jun 2026 · {tk(collectionSeries.reduce((x, d) => x + d.amount, 0))} total</p>
          <div className="mt-3"><CollectionBar data={collectionSeries} /></div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-[15px] font-extrabold text-[#24324A]">Student Distribution</h2>
          <p className="text-xs font-medium text-slate-500">By level</p>
          <div className="mt-3"><DistributionDonut data={distribution} /></div>
        </div>
      </div>

      {/* bottom row */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-[15px] font-extrabold text-[#24324A]">Recent Activities</h2>
          <ol className="mt-4 space-y-4">
            {activity.slice(0, 5).map((x) => (
              <li key={x.id} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">{actIcon(x.module)}</span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-[#24324A]">{x.action}</p>
                  <p className="text-[11.5px] font-medium text-slate-500">{x.user} · {x.time}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/admin/activity" className="mt-4 block text-[13px] font-bold text-sky-600 hover:underline">View activity log</Link>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-[15px] font-extrabold text-[#24324A]">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-2">
            {quick.map((q) => (
              <Link key={q.label} href={q.href} className="group flex flex-col items-center gap-2 rounded-xl border border-[#E2E8F0] px-3 py-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${q.bg}`}>
                  <q.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-xs font-bold text-[#24324A]">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#24324A] p-5 text-white">
          <h2 className="text-[15px] font-extrabold">Collection Progress</h2>
          <p className="text-xs font-medium text-white/60">June target · {tk(1000000)}</p>
          <p className="mt-3 text-3xl font-extrabold">{tk(collected).replace("৳", "৳ ")}</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${Math.min(100, (845000 / 1000000) * 100)}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-white/70">84.5% of monthly target reached</p>
          <div className="mt-4 space-y-2.5">
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold"><span>Tuition</span><span>92%</span></div>
              <Progress value={92} color="bg-sky-400" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold"><span>Transport</span><span>71%</span></div>
              <Progress value={71} color="bg-amber-400" />
            </div>
          </div>
          <Link href="/admin/fees" className="mt-4 block rounded-xl bg-white/10 py-2.5 text-center text-[13px] font-bold hover:bg-white/20">
            Open finance dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
