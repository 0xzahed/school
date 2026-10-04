"use client";

import { useState } from "react";
import { CalendarDays, Check } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { cn } from "@/lib/utils";

const years = [
  { year: "2026", term1: "Jan – May", term2: "Jun – Dec", status: "Current", students: 1248 },
  { year: "2025", term1: "Jan – May", term2: "Jun – Dec", status: "Archived", students: 1185 },
  { year: "2024", term1: "Jan – May", term2: "Jun – Dec", status: "Archived", students: 1120 },
];

export default function AcademicYearPage() {
  const { toast, log, settings, updateSettings } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [year, setYear] = useState("2027");

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ year });
    toast(`Academic year ${year} created and set active.`);
    log(`Created academic year ${year}`, "Academics");
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Academic Year"
        sub="Manage sessions, terms and year-end rollover"
        action={
          <button onClick={() => setAdding(true)} className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            + New Year
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {years.map((y) => (
          <article key={y.year} className={cn("rounded-2xl border bg-white p-5", y.year === settings.year ? "border-sky-300 ring-2 ring-sky-100" : "border-[#E2E8F0]")}>
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100">
                <CalendarDays className="h-5 w-5 text-sky-600" aria-hidden />
              </span>
              <Badge tone={y.status === "Current" || y.year === settings.year ? "Active" : "Inactive"} dot>
                {y.year === settings.year ? "Current" : y.status}
              </Badge>
            </div>
            <h2 className="mt-3 text-xl font-extrabold">Session {y.year}</h2>
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2"><dt className="font-medium text-slate-500">First Term</dt><dd className="font-bold">{y.term1}</dd></div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2"><dt className="font-medium text-slate-500">Second Term</dt><dd className="font-bold">{y.term2}</dd></div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2"><dt className="font-medium text-slate-500">Students</dt><dd className="font-bold">{y.students.toLocaleString()}</dd></div>
            </dl>
            {y.year !== settings.year && (
              <button onClick={() => { updateSettings({ year: y.year }); toast(`Switched to session ${y.year}.`); }}
                className="mt-4 w-full rounded-xl border border-[#E2E8F0] py-2.5 text-[13px] font-bold hover:bg-slate-50">
                Switch to this year
              </button>
            )}
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="text-[15px] font-extrabold">Grading System · 2026</h2>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-7">
          {[["A+", "80–100"], ["A", "70–79"], ["A-", "60–69"], ["B", "50–59"], ["C", "40–49"], ["D", "33–39"], ["F", "0–32"]].map(([g, r]) => (
            <div key={g} className="rounded-xl bg-slate-50 px-2 py-3 text-center">
              <p className="text-lg font-extrabold">{g}</p>
              <p className="text-[11px] font-bold text-slate-500">{r}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-slate-500">
          <Check className="h-4 w-4 text-emerald-500" aria-hidden /> Pass mark is 33. Attendance below 75% flags a warning.
        </p>
      </div>

      {adding && (
        <Modal title="Create Academic Year" onClose={() => setAdding(false)}>
          <form onSubmit={create} className="space-y-4">
            <Field label="Year *">
              <input required value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2027" className={inputCls} />
            </Field>
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700">Creating a new year copies classes, subjects and routines forward. Students are promoted automatically.</p>
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">Create Year</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
