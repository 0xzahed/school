"use client";

import { PageHeader, Avatar, Badge, Progress, Empty } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { pastStatus, marksFor } from "@/data/sms";

export default function StudentProfile() {
  const { me, admin } = useMe();
  if (!me) return <Empty title="Loading your profile..." />;

  let p = 0, n = 0;
  const hset = new Set(admin.holidays.map((h) => h.date));
  for (let i = 0; i < 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const st: string = admin.attendance[`${iso}|${me.class}|${me.section}`]?.[me.id] ?? pastStatus(iso, me.id, hset, admin.settings.weeklyHoliday);
    if (st === "H") continue;
    n++;
    if (st === "P") p++;
  }
  const attPct = n ? Math.round((p / n) * 100) : 100;
  const avg = Math.round(["Bangla", "English", "Mathematics", "Science", "ICT"].reduce((a, s) => a + marksFor(me.id, s).total, 0) / 5);
  const teacher = admin.teachers.find((t) => t.subject === "Bangla");

  return (
    <div className="space-y-4">
      <PageHeader title="My Profile" sub={`${me.id} · admitted ${me.year}`} action={<Badge tone={me.status} dot>{me.status}</Badge>} />

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center sm:flex-row sm:text-left">
        <Avatar name={me.name} size="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <h2 className="text-xl font-extrabold">{me.name}</h2>
          <p className="text-[13px] font-semibold text-slate-500">{me.class} · Section {me.section} · Roll {me.roll}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-[13px] font-bold sm:justify-start">
            <span>Attendance <span className="text-emerald-600">{attPct}%</span></span>
            <span>Average <span className="text-sky-600">{avg}%</span></span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "About Me", rows: [["Birthday", me.dob], ["Gender", me.gender], ["Blood Group", me.blood], ["Address", me.address]] },
          { t: "My Class", rows: [["Class", me.class], ["Section", me.section], ["Roll No", String(me.roll)], ["Session", me.year]] },
          { t: "My Family", rows: [["Father", me.father], ["Mother", me.mother], ["Phone", me.phone], ["Email", me.email || "—"]] },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <h3 className="text-[14px] font-extrabold">{c.t}</h3>
            <dl className="mt-3 space-y-2.5">
              {c.rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 text-[13px]">
                  <dt className="font-medium text-slate-500">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="text-[14px] font-extrabold">Class Teacher</h3>
        <div className="mt-3 flex items-center gap-3">
          <Avatar name={teacher?.name ?? "Class Teacher"} />
          <div>
            <p className="text-sm font-extrabold">{teacher?.name ?? "—"}</p>
            <p className="text-xs font-semibold text-slate-500">{teacher?.phone ?? ""}</p>
          </div>
        </div>
        <div className="mt-3"><Progress value={attPct} color="bg-emerald-400" /></div>
        <p className="mt-1.5 text-xs font-bold text-slate-500">Keep it up — every school day counts!</p>
      </div>
    </div>
  );
}
