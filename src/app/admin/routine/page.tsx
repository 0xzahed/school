"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/ui";
import { classList, sections, routineDays, routineSlots, routineFor, teacherForSubject } from "@/data/sms";
import { cn } from "@/lib/utils";

const pill: Record<string, string> = {
  Bangla: "bg-sky-50 text-sky-700", English: "bg-violet-50 text-violet-700",
  Mathematics: "bg-blue-50 text-blue-700", Science: "bg-emerald-50 text-emerald-700",
  ICT: "bg-cyan-50 text-cyan-700", "Social Science": "bg-amber-50 text-amber-700",
  Religion: "bg-teal-50 text-teal-700", "Physical Education": "bg-orange-50 text-orange-700",
  Art: "bg-pink-50 text-pink-700",
};

export default function RoutinePage() {
  const [cls, setCls] = useState("Class 6");
  const [sec, setSec] = useState("A");
  const grid = routineFor(cls, sec);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Class Routine"
        sub="Weekly timetable · 6 periods a day"
        action={
          <div className="flex gap-2">
            <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Select class"
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-sky-400">
              {classList.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={sec} onChange={(e) => setSec(e.target.value)} aria-label="Select section"
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-sky-400">
              {sections.map((s) => <option key={s}>Section {s}</option>)}
            </select>
          </div>
        }
      />

      <p className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3.5 text-sm font-bold">
        {cls} · {sec.replace("Section ", "Section ")} <span className="font-medium text-slate-500">· Class teacher: {teacherForSubject("Bangla", cls)}</span>
      </p>

      {/* desktop grid */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white lg:block">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="w-28 px-4 py-3.5 text-left text-[11px] tracking-wider text-slate-500 uppercase">Day</th>
              {routineSlots.map((s) => (
                <th key={s.p} className="px-2 py-3.5 text-center text-[11px] tracking-wider text-slate-500 uppercase">{s.p}<br /><span className="font-bold normal-case">{s.time}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routineDays.map((d, di) => (
              <tr key={d} className="border-t border-slate-100">
                <th className="px-4 py-3 text-left text-[14px] font-extrabold">{d}</th>
                {grid[di].map((sub, pi) => (
                  <td key={pi} className="px-1.5 py-2">
                    <div className={cn("rounded-xl px-2 py-2.5 text-center", pill[sub])}>
                      <p className="text-[12px] leading-tight font-extrabold">{sub}</p>
                      <p className="mt-0.5 truncate text-[10px] font-semibold opacity-75">{teacherForSubject(sub, cls)}</p>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile stacked cards */}
      <div className="space-y-3 lg:hidden">
        {routineDays.map((d, di) => (
          <div key={d} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <h2 className="text-[14px] font-extrabold">{d}</h2>
            <ul className="mt-2.5 space-y-2">
              {grid[di].map((sub, pi) => (
                <li key={pi} className={cn("flex items-center gap-3 rounded-xl px-3.5 py-2.5", pill[sub])}>
                  <span className="text-[11px] font-extrabold opacity-70">{routineSlots[pi].time}</span>
                  <span className="text-[13px] font-extrabold">{sub}</span>
                  <span className="ml-auto truncate text-[11px] font-semibold opacity-75">{teacherForSubject(sub, cls)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
