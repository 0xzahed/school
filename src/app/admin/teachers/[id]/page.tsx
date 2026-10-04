"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, Mail, Briefcase, Wallet, CalendarCheck, FileText } from "lucide-react";
import { PageHeader, Avatar, Badge, Progress, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { tk } from "@/data/sms";

export default function TeacherProfile() {
  const params = useParams();
  const id = String(params.id);
  const { teachers, students } = useAdmin();
  const t = teachers.find((x) => x.id === id);

  if (!t) {
    return (
      <div className="space-y-4">
        <Link href="/admin/teachers" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600"><ArrowLeft className="h-4 w-4" aria-hidden /> Back to Teachers</Link>
        <Empty title="Teacher not found." />
      </div>
    );
  }

  const assigned = students.filter((s) => s.class === t.classes).slice(0, 6);
  const presentDays = 21 + (t.id.charCodeAt(4) % 2);

  return (
    <div className="space-y-4">
      <Link href="/admin/teachers" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Teachers
      </Link>
      <PageHeader title={t.name} sub={`${t.id} · ${t.subject} · since ${t.joining}`} action={<Badge tone={t.status} dot>{t.status}</Badge>} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center">
          <Avatar name={t.name} size="mx-auto h-20 w-20 text-2xl" />
          <h2 className="mt-3 text-lg font-extrabold">{t.name}</h2>
          <p className="text-[13px] font-semibold text-slate-500">{t.department} Department</p>
          <div className="mt-4 space-y-2 text-left text-[13px]">
            <p className="flex items-center gap-2 font-semibold"><Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden />{t.phone}</p>
            <p className="flex items-center gap-2 truncate font-semibold"><Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden /><span className="truncate">{t.email}</span></p>
            <p className="flex items-center gap-2 font-semibold"><Briefcase className="h-3.5 w-3.5 text-slate-400" aria-hidden />{t.subject} · {t.classes}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="text-[14px] font-extrabold">This Month</h3>
          <div className="mt-3 space-y-3.5">
            <div>
              <div className="mb-1 flex justify-between text-[13px] font-bold"><span className="flex items-center gap-1.5"><CalendarCheck className="h-4 w-4 text-emerald-500" aria-hidden />Attendance</span><span>{presentDays}/24 days</span></div>
              <Progress value={(presentDays / 24) * 100} color="bg-emerald-400" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-[13px] font-bold"><span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-sky-500" aria-hidden />Leave taken</span><span>2 days</span></div>
              <Progress value={8} color="bg-sky-400" />
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="flex items-center gap-1.5 text-[13px] font-bold"><Wallet className="h-4 w-4 text-violet-500" aria-hidden />Monthly salary</p>
              <p className="mt-1 text-xl font-extrabold">{tk(t.salary)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="text-[14px] font-extrabold">Assigned Class Sample · {t.classes}</h3>
          <ul className="mt-3 space-y-2">
            {assigned.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/students/${s.id}`} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50">
                  <Avatar name={s.name} size="h-8 w-8 text-xs" />
                  <span className="truncate text-[13px] font-bold">{s.name}</span>
                  <span className="ml-auto text-[11px] font-bold text-slate-400">Roll {s.roll}</span>
                </Link>
              </li>
            ))}
            {assigned.length === 0 && <p className="text-[13px] font-medium text-slate-500">No students in this class yet.</p>}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="text-[14px] font-extrabold">Documents</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {["National ID", "Academic Certificates", "Appointment Letter"].map((d) => (
            <p key={d} className="rounded-xl bg-slate-50 px-4 py-3 text-[13px] font-bold">✓ {d} <span className="ml-1 text-emerald-600">· Verified</span></p>
          ))}
        </div>
      </div>
    </div>
  );
}
