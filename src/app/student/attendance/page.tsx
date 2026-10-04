"use client";

import { useMemo } from "react";
import { PageHeader, Progress, Empty } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { pastStatus } from "@/data/sms";
import { cn } from "@/lib/utils";

export default function StudentAttendance() {
  const { me, admin } = useMe();
  const days = useMemo(() => {
    if (!me) return [];
    const hset = new Set(admin.holidays.map((h) => h.date));
    const out: Array<{ d: string; st: string }> = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const st: string = admin.attendance[`${iso}|${me.class}|${me.section}`]?.[me.id] ?? pastStatus(iso, me.id, hset, admin.settings.weeklyHoliday);
      out.push({ d: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), st });
    }
    return out;
  }, [me, admin]);

  if (!me) return <Empty title="Loading attendance..." />;
  const valid = days.filter((d) => d.st !== "H");
  const present = valid.filter((d) => d.st === "P").length;
  const pct = valid.length ? Math.round((present / valid.length) * 100) : 100;

  return (
    <div className="space-y-4">
      <PageHeader title="My Attendance" sub={`Last 30 days · ${pct}% present`} />
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between text-sm font-extrabold">
          <span>{present}/{valid.length} days present</span>
          <span className="text-emerald-600">{pct}%</span>
        </div>
        <div className="mt-2"><Progress value={pct} color="bg-emerald-400" /></div>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
          {days.map((d, i) => (
            <div key={i} title={d.d} className={cn("rounded-xl px-1 py-2.5 text-center",
              d.st === "P" ? "bg-emerald-50" : d.st === "A" ? "bg-red-50" : d.st === "L" ? "bg-amber-50" : "bg-slate-50")}>
              <p className="text-[10px] font-bold text-slate-500">{d.d}</p>
              <p className={cn("text-sm font-extrabold",
                d.st === "P" ? "text-emerald-600" : d.st === "A" ? "text-red-500" : d.st === "L" ? "text-amber-600" : "text-slate-300")}>{d.st}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden /> Present</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden /> Late</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden /> Absent</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden /> Holiday</span>
        </div>
      </div>
    </div>
  );
}
