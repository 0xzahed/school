"use client";

import { Printer } from "lucide-react";
import { PageHeader, Badge, Empty, Progress } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { marksFor, gradeFor } from "@/data/sms";

const subs = ["Bangla", "English", "Mathematics", "Science", "ICT"];

export default function StudentResults() {
  const { me } = useMe();
  if (!me) return <Empty title="Loading results..." />;

  const rows = subs.map((sub) => ({ sub, ...marksFor(me.id, sub) }));
  const avg = Math.round(rows.reduce((a, r) => a + r.total, 0) / rows.length);

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Results"
        sub="First Term Examination · 2026"
        action={
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
            <Printer className="h-4 w-4" aria-hidden /> Print Report
          </button>
        }
      />

      <div className="rounded-2xl border-2 border-[#24324A] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#24324A] pb-4">
          <div>
            <p className="text-lg font-extrabold">Report Card</p>
            <p className="text-[13px] font-semibold text-slate-500">{me.name} · {me.id} · {me.class}-{me.section} · Roll {me.roll}</p>
          </div>
          <Badge tone="Published">Final</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {rows.map((r) => (
            <div key={r.sub}>
              <div className="mb-1 flex justify-between text-[13px] font-bold">
                <span>{r.sub}</span>
                <span>Written {r.written} + MCQ {r.mcq} = <strong>{r.total}</strong> · {gradeFor(r.total)}</span>
              </div>
              <Progress value={r.total} color={r.total >= 80 ? "bg-emerald-400" : r.total >= 60 ? "bg-sky-400" : "bg-amber-400"} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#24324A] px-5 py-4 text-white">
          <p className="text-sm font-bold">Term Average: <span className="text-xl font-extrabold">{avg}%</span></p>
          <p className="text-sm font-bold">Grade: <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xl font-extrabold">{gradeFor(avg)}</span></p>
        </div>
        <p className="mt-3 text-center text-xs font-semibold text-slate-400">Great work! Show this to your parents and keep shining.</p>
      </div>
    </div>
  );
}
