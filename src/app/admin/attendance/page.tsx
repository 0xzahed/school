"use client";

import { useMemo, useState } from "react";
import { Save, CheckCheck } from "lucide-react";
import { PageHeader, Avatar, Badge, Progress, btnPrimary } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { classList, sections, pastStatus, todayISO, weekDays, type AttStatus } from "@/data/sms";
import { cn } from "@/lib/utils";

const subjects = ["All Subjects", "Bangla", "English", "Mathematics", "Science", "ICT"];

export default function AttendancePage() {
  const { students, attendance, holidays, settings, setDayAttendance, toast, log } = useAdmin();
  const [date, setDate] = useState(todayISO());
  const [cls, setCls] = useState("Class 6");
  const [sec, setSec] = useState("A");
  const [saved, setSaved] = useState(false);
  const key = `${date}|${cls}|${sec}`;

  const roster = useMemo(() => students.filter((s) => s.class === cls && s.section === sec), [students, cls, sec]);
  const holidaySet = useMemo(() => new Set(holidays.map((h) => h.date)), [holidays]);

  const base: Record<string, AttStatus> = useMemo(() => {
    const rec: Record<string, AttStatus> = {};
    roster.forEach((s) => {
      const sv = attendance[key]?.[s.id];
      const g: string = sv ?? pastStatus(date, s.id, holidaySet, settings.weeklyHoliday);
      rec[s.id] = g === "H" ? "P" : (g as AttStatus);
    });
    return rec;
  }, [roster, attendance, key, date, holidaySet, settings.weeklyHoliday]);

  const [draft, setDraft] = useState<Record<string, AttStatus> | null>(null);
  const shown = draft ?? base;
  const dirty = draft !== null;

  const select = (c: string, s: string, d: string) => {
    setCls(c);
    setSec(s);
    setDate(d);
    setDraft(null);
    setSaved(false);
  };

  const counts = useMemo(() => {
    let p = 0, l = 0, a = 0;
    Object.values(shown).forEach((v) => (v === "P" ? p++ : v === "L" ? l++ : a++));
    return { p, l, a };
  }, [shown]);
  const totalN = roster.length || 1;

  const save = () => {
    setDayAttendance(key, shown);
    setDraft(null);
    setSaved(true);
    toast(`Attendance saved for ${cls}-${sec} (${counts.p}/${totalN} present).`);
    log(`Submitted ${cls}-${sec} attendance (${Math.round((counts.p / totalN) * 100)}%)`, "Attendance");
  };

  const markAll = () => {
    const rec: Record<string, AttStatus> = {};
    roster.forEach((s) => { rec[s.id] = "P"; });
    setDraft(rec);
    setSaved(false);
  };

  const isHoliday = new Date(date + "T00:00:00").getDay() === settings.weeklyHoliday || holidaySet.has(date);
  const offName = weekDays[settings.weeklyHoliday];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Attendance"
        sub={`Mark daily presence · ${offName}s are holidays`}
        action={
          <>
            <button onClick={markAll} className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
              <CheckCheck className="h-4 w-4" aria-hidden /> Mark All Present
            </button>
            <button onClick={save} className={cn(btnPrimary, saved && "bg-emerald-500 hover:bg-emerald-500")}>
              <Save className="h-4 w-4" aria-hidden /> {saved && !dirty ? "Saved!" : "Save Attendance"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:grid-cols-4 lg:grid-cols-5">
        <label className="text-[13px] font-bold">Date<input type="date" value={date} max={todayISO()} onChange={(e) => select(cls, sec, e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-semibold outline-none focus:border-sky-400" /></label>
        <label className="text-[13px] font-bold">Class<select value={cls} onChange={(e) => select(e.target.value, sec, date)}
          className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-semibold outline-none focus:border-sky-400">
          {classList.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-[13px] font-bold">Section<select value={sec} onChange={(e) => select(cls, e.target.value, date)}
          className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-semibold outline-none focus:border-sky-400">
          {sections.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-[13px] font-bold">Subject<select className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-semibold outline-none focus:border-sky-400">
          {subjects.map((s) => <option key={s}>{s}</option>)}</select></label>
        <div className="col-span-2 flex items-end gap-2 sm:col-span-4 lg:col-span-1">
          <Badge tone="P">{counts.p} present</Badge>
          <Badge tone="L">{counts.l} late</Badge>
          <Badge tone="A">{counts.a} absent</Badge>
        </div>
      </div>

      {isHoliday && <p className="rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold text-amber-700" role="note">{holidaySet.has(date) ? "This date is a listed holiday" : `${offName} is the weekly holiday`} — the register below is for planning only.</p>}

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
        <div className="hidden grid-cols-[1fr_90px_90px_90px] gap-2 border-b border-[#E2E8F0] bg-slate-50/60 px-5 py-3 text-[11px] tracking-wider text-slate-500 uppercase sm:grid">
          <span className="font-extrabold">Student</span>
          <span className="text-center font-extrabold">Present</span>
          <span className="text-center font-extrabold">Absent</span>
          <span className="text-center font-extrabold">Late</span>
        </div>
        <ul className="divide-y divide-slate-100">
          {roster.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:grid sm:grid-cols-[1fr_90px_90px_90px] sm:gap-2 sm:px-5">
              <span className="flex min-w-[180px] flex-1 items-center gap-3">
                <Avatar name={s.name} size="h-9 w-9 text-xs" />
                <span><span className="block text-sm font-bold">{s.name}</span><span className="block text-[11px] font-semibold text-slate-500">Roll {s.roll} · {s.id}</span></span>
              </span>
              {(["P", "A", "L"] as AttStatus[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setDraft({ ...shown, [s.id]: v }); setSaved(false); }}
                  aria-pressed={shown[s.id] === v}
                  aria-label={`Mark ${s.name} ${v === "P" ? "present" : v === "A" ? "absent" : "late"}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-[13px] font-extrabold transition-all sm:mx-auto",
                    shown[s.id] === v
                      ? v === "P" ? "border-emerald-500 bg-emerald-500 text-white" : v === "A" ? "border-red-500 bg-red-500 text-white" : "border-amber-500 bg-amber-500 text-white"
                      : "border-slate-200 text-transparent hover:border-slate-300"
                  )}
                >
                  ●
                </button>
              ))}
            </li>
          ))}
          {roster.length === 0 && <li className="px-5 py-10 text-center text-sm font-semibold text-slate-500">No students in this section.</li>}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="text-[15px] font-extrabold">Summary · {cls}-{sec}</h2>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1"><Progress value={(counts.p / totalN) * 100} color="bg-emerald-400" /></div>
          <span className="text-sm font-extrabold">{counts.p}/{totalN} present ({Math.round((counts.p / totalN) * 100)}%)</span>
        </div>
      </div>
    </div>
  );
}
