"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader, Empty } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { holidayTypeStyle, weekDays, todayISO } from "@/data/sms";
import { cn } from "@/lib/utils";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function StudentHolidays() {
  const { admin } = useMe();
  const { holidays, settings } = admin;
  const [year, setYear] = useState("2026");

  const yearHolidays = useMemo(
    () => holidays.filter((h) => h.date.startsWith(year)).sort((a, b) => a.date.localeCompare(b.date)),
    [holidays, year]
  );
  const byDate = useMemo(() => {
    const m = new Map<string, typeof yearHolidays>();
    yearHolidays.forEach((h) => m.set(h.date, [...(m.get(h.date) ?? []), h]));
    return m;
  }, [yearHolidays]);

  const upcoming = useMemo(() => {
    const t = todayISO();
    return [...holidays].filter((h) => h.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [holidays]);

  const monthCells = (mi: number) => {
    const first = new Date(Number(year), mi, 1).getDay();
    const days = new Date(Number(year), mi + 1, 0).getDate();
    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < first; i++) cells.push({ day: null, iso: null });
    for (let d = 1; d <= days; d++) {
      cells.push({ day: d, iso: `${year}-${String(mi + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
    }
    return cells;
  };

  return (
    <div className="space-y-4">
      <PageHeader title="School Holidays" sub={`Full-year calendar · weekly off every ${weekDays[settings.weeklyHoliday]}`} />

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="flex items-center gap-2 text-[15px] font-extrabold"><Sparkles className="h-4 w-4 text-amber-500" aria-hidden />Coming Up Next</h2>
        {upcoming.length === 0 ? <p className="mt-2 text-sm font-semibold text-slate-500">No more holidays scheduled.</p> : (
          <ul className="mt-3 space-y-2">
            {upcoming.map((h) => (
              <li key={h.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3" title={h.description}>
                <span className="min-w-[86px] text-xs font-extrabold text-slate-500">{h.date}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-extrabold">{h.name}</span>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold", holidayTypeStyle[h.type])}>{h.type}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-[11.5px] font-bold text-slate-500">
          {(Object.keys(holidayTypeStyle) as Array<keyof typeof holidayTypeStyle>).map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", holidayTypeStyle[t].split(" ")[0])} aria-hidden />{t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5" role="tablist" aria-label="Select year">
        {["2026", "2027"].map((y) => (
          <button key={y} role="tab" aria-selected={year === y} onClick={() => setYear(y)}
            className={cn("rounded-xl px-5 py-2 text-[13px] font-bold", year === y ? "bg-[#24324A] text-white" : "bg-white text-slate-500 border border-[#E2E8F0]")}>
            {y}
          </button>
        ))}
      </div>

      {yearHolidays.length === 0 ? <Empty title={`No holidays listed for ${year} yet.`} /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {monthNames.map((mn, mi) => {
            const cells = monthCells(mi);
            if (!cells.some((c) => c.iso && byDate.has(c.iso))) return null;
            return (
              <div key={mn} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                <h3 className="text-[14px] font-extrabold">{mn}</h3>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-400">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {cells.map((c, i) => {
                    if (c.day === null) return <span key={i} />;
                    const hs = byDate.get(c.iso!) ?? [];
                    const isOff = new Date(c.iso! + "T00:00:00").getDay() === settings.weeklyHoliday;
                    const first = hs[0];
                    return (
                      <span
                        key={i}
                        title={hs.length ? hs.map((h) => `${h.name} (${h.type}) — ${h.description}`).join(" · ") : c.iso!}
                        className={cn(
                          "flex h-8 flex-col items-center justify-center rounded-lg text-[12px] font-bold",
                          hs.length ? holidayTypeStyle[first.type] : isOff ? "bg-slate-100 text-slate-400" : "text-slate-500"
                        )}
                      >
                        {c.day}
                        {hs.length > 0 && <span className="h-1 w-1 rounded-full bg-current" aria-hidden />}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-[13px] font-semibold text-slate-500">Dates marked * follow the lunar calendar and may shift by a day. Weekly holiday: {weekDays[settings.weeklyHoliday]}.</p>
    </div>
  );
}
