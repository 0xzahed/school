"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ClipboardCheck, Trophy, Wallet, NotebookPen, ArrowRight, Bell } from "lucide-react";
import { PageHeader, StatCard, Avatar, Badge, Progress, Empty } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { pastStatus, marksFor, gradeFor, tk } from "@/data/sms";

export default function StudentDashboard() {
  const { me, admin } = useMe();
  const holidaySet = useMemo(() => new Set(admin.holidays.map((h) => h.date)), [admin.holidays]);
  if (!me) return <Empty title="Loading your portal..." />;

  const { attendance, settings, invoices, homework, noticeList } = admin;

  let p = 0, n = 0;
  for (let i = 0; i < 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const st: string = attendance[`${iso}|${me.class}|${me.section}`]?.[me.id] ?? pastStatus(iso, me.id, holidaySet, settings.weeklyHoliday);
    if (st === "H") continue;
    n++;
    if (st === "P") p++;
  }
  const attPct = n ? Math.round((p / n) * 100) : 100;

  const subs = ["Bangla", "English", "Mathematics", "Science", "ICT"];
  const totals = subs.map((s) => marksFor(me.id, s).total);
  const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);

  const myInvoices = invoices.filter((v) => v.studentId === me.id);
  const due = myInvoices.reduce((a, v) => a + (v.amount - v.paid), 0);
  const myHomework = homework.filter((h) => h.class === me.class && h.status === "Active").slice(0, 3);
  const myNotices = noticeList.filter((x) => ["Everyone", "Students"].includes(x.audience) || x.audience === me.class).slice(0, 3);

  return (
    <div className="space-y-5">
      <PageHeader title={`Welcome back, ${me.name.split(" ")[0]}!`} sub={`${me.class} · Section ${me.section} · Roll ${me.roll}`} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="My Attendance" value={`${attPct}%`} compare="last 20 days" bg="bg-emerald-400" />
        <StatCard icon={Trophy} label="Term Average" value={`${avg}%`} compare={`Grade ${gradeFor(avg)}`} bg="bg-amber-400" />
        <StatCard icon={Wallet} label="Fees Due" value={tk(due)} compare={due === 0 ? "all clear!" : "pay at office"} bg="bg-sky-400" />
        <StatCard icon={NotebookPen} label="Homework Due" value={String(myHomework.length)} compare="active assignments" bg="bg-violet-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">My Subjects</h2>
            <Link href="/student/results" className="inline-flex items-center gap-1 text-[13px] font-bold text-sky-600 hover:underline">
              Full report <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {subs.map((s, i) => (
              <li key={s}>
                <div className="mb-1 flex justify-between text-[13px] font-bold">
                  <span>{s}</span><span className="text-slate-500">{totals[i]} · {gradeFor(totals[i])}</span>
                </div>
                <Progress value={totals[i]} color={totals[i] >= 80 ? "bg-emerald-400" : totals[i] >= 60 ? "bg-sky-400" : "bg-amber-400"} />
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold">Homework To Do</h2>
              <Link href="/student/homework" className="text-[13px] font-bold text-sky-600 hover:underline">View all</Link>
            </div>
            {myHomework.length === 0 ? <p className="mt-3 text-sm font-semibold text-slate-500">Nothing due. Enjoy your evening!</p> : (
              <ul className="mt-3 space-y-2.5">
                {myHomework.map((h) => (
                  <li key={h.id} className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-sm font-bold">{h.title}</p>
                    <p className="text-xs font-semibold text-slate-500">{h.subject} · due {h.due}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-extrabold"><Bell className="h-4 w-4 text-amber-500" aria-hidden />Latest Notices</h2>
              <Link href="/student/notices" className="text-[13px] font-bold text-sky-600 hover:underline">View all</Link>
            </div>
            <ul className="mt-3 space-y-2.5">
              {myNotices.map((x) => (
                <li key={x.id} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3">
                  <Avatar name={x.title} size="h-8 w-8 text-[10px]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{x.title}</p>
                    <p className="text-xs font-semibold text-slate-500">{x.date}</p>
                  </div>
                  <span className="ml-auto shrink-0"><Badge tone={x.status}>{x.status}</Badge></span>
                </li>
              ))}
              {myNotices.length === 0 && <p className="text-sm font-semibold text-slate-500">No new notices.</p>}
            </ul>
          </div>
        </div>
      </div>

      {due > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#24324A] p-5 text-white">
          <Wallet className="h-8 w-8 text-amber-400" aria-hidden />
          <p className="flex-1 text-sm font-bold">You have {tk(due)} in pending fees. Please ask your guardian to clear it at the office.</p>
          <Link href="/student/fees" className="rounded-xl bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#24324A]">View Fees</Link>
        </div>
      )}
    </div>
  );
}
