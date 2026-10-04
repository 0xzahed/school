"use client";

import { PageHeader, Empty } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { routineDays, routineSlots, routineFor, teacherForSubject } from "@/data/sms";
import { cn } from "@/lib/utils";

const pill: Record<string, string> = {
  Bangla: "bg-sky-50 text-sky-700", English: "bg-violet-50 text-violet-700",
  Mathematics: "bg-blue-50 text-blue-700", Science: "bg-emerald-50 text-emerald-700",
  ICT: "bg-cyan-50 text-cyan-700", "Social Science": "bg-amber-50 text-amber-700",
  Religion: "bg-teal-50 text-teal-700", "Physical Education": "bg-orange-50 text-orange-700",
  Art: "bg-pink-50 text-pink-700",
};

export default function StudentTimetable() {
  const { me } = useMe();
  if (!me) return <Empty title="Loading timetable..." />;
  const grid = routineFor(me.class, me.section);
  const today = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

  return (
    <div className="space-y-4">
      <PageHeader title="My Timetable" sub={`${me.class} · Section ${me.section}`} />
      <div className="space-y-3">
        {routineDays.map((d, di) => (
          <div key={d} className={cn("rounded-2xl border bg-white p-4", today === d ? "border-sky-400 ring-2 ring-sky-100" : "border-[#E2E8F0]")}>
            <h2 className="flex items-center gap-2 text-[14px] font-extrabold">
              {d}
              {today === d && <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10.5px] font-extrabold text-sky-700">TODAY</span>}
            </h2>
            <ul className="mt-2.5 space-y-2">
              {grid[di].map((sub, pi) => (
                <li key={pi} className={cn("flex items-center gap-3 rounded-xl px-3.5 py-2.5", pill[sub])}>
                  <span className="text-[11px] font-extrabold opacity-70">{routineSlots[pi].time}</span>
                  <span className="text-[13px] font-extrabold">{sub}</span>
                  <span className="ml-auto truncate text-[11px] font-semibold opacity-75">{teacherForSubject(sub, me.class)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
