"use client";

import { useMemo, useState } from "react";
import { Plus, CalendarOff, Flag, School, Sparkles, Clock } from "lucide-react";
import { PageHeader, StatCard, Modal, Field, inputCls } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { currentRole } from "@/components/admin/Shell";
import { holidayTypeStyle, weekDays, todayISO, type Holiday, type HolidayType } from "@/data/sms";
import { cn } from "@/lib/utils";

const types: HolidayType[] = ["Government", "School", "Religious", "Observance"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function HolidaysPage() {
  const { holidays, addHoliday, updateHoliday, removeHoliday, settings, updateSettings, toast, log } = useAdmin();
  const [year, setYear] = useState("2026");
  const [typeFilter, setTypeFilter] = useState("All");
  const [adding, setAdding] = useState<string | null>(null); // prefilled date or ""
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [role] = useState(() => currentRole());
  const canManage = role === "super-admin" || role === "admin";

  const [form, setForm] = useState({ name: "", date: todayISO(), type: "Government" as HolidayType, description: "" });

  const yearHolidays = useMemo(
    () => holidays.filter((h) => h.date.startsWith(year)).sort((a, b) => a.date.localeCompare(b.date)),
    [holidays, year]
  );
  const byDate = useMemo(() => {
    const m = new Map<string, Holiday[]>();
    yearHolidays.forEach((h) => {
      const list = m.get(h.date) ?? [];
      list.push(h);
      m.set(h.date, list);
    });
    return m;
  }, [yearHolidays]);

  const upcoming = useMemo(() => {
    const t = todayISO();
    return [...holidays].filter((h) => h.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  }, [holidays]);

  const counts = useMemo(() => ({
    total: yearHolidays.length,
    govt: yearHolidays.filter((h) => h.type === "Government").length,
    school: yearHolidays.filter((h) => h.type === "School").length,
  }), [yearHolidays]);

  const openAdd = (date: string) => {
    if (!canManage) {
      toast("Only admins can manage holidays.", "warning");
      return;
    }
    setForm({ name: "", date: date || todayISO(), type: "Government", description: "" });
    setAdding(date || todayISO());
  };
  const openEdit = (h: Holiday) => {
    if (!canManage) {
      toast("Only admins can manage holidays.", "warning");
      return;
    }
    setForm({ name: h.name, date: h.date, type: h.type, description: h.description });
    setEditing(h);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addHoliday({ id: `H-${Date.now()}`, name: form.name.trim(), date: form.date, type: form.type, description: form.description.trim() || "School closed." });
    toast(`Holiday added: ${form.name.trim()} (${form.date}).`);
    log(`Added holiday: ${form.name.trim()}`, "Holidays");
    setAdding(null);
  };
  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateHoliday(editing.id, { name: form.name.trim(), date: form.date, type: form.type, description: form.description.trim() });
    toast("Holiday updated.");
    setEditing(null);
  };

  const monthCells = (mi: number) => {
    const first = new Date(Number(year), mi, 1).getDay();
    const days = new Date(Number(year), mi + 1, 0).getDate();
    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < first; i++) cells.push({ day: null, iso: null });
    for (let d = 1; d <= days; d++) {
      const iso = `${year}-${String(mi + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, iso });
    }
    return cells;
  };

  const formFields = (
    <>
      <Field label="Holiday name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Victory Day" className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date *"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></Field>
        <Field label="Type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as HolidayType })} className={inputCls}>{types.map((t) => <option key={t}>{t}</option>)}</select></Field>
      </div>
      <Field label="Note"><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional note" className={inputCls} /></Field>
    </>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Holidays"
        sub="Government, religious and school holidays for the full year"
        action={canManage ? (
          <button onClick={() => openAdd("")} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> Add Holiday
          </button>
        ) : undefined}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={CalendarOff} label={`Holidays · ${year}`} value={String(counts.total)} compare="days closed" bg="bg-sky-400" />
        <StatCard icon={Flag} label="Government" value={String(counts.govt)} compare="national holidays" bg="bg-red-400" />
        <StatCard icon={School} label="School" value={String(counts.school)} compare="breaks & vacations" bg="bg-violet-400" />
        <StatCard icon={Clock} label="Weekly Off" value={weekDays[settings.weeklyHoliday]} compare="every week" bg="bg-emerald-400" />
      </div>

      {/* upcoming */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="flex items-center gap-2 text-[15px] font-extrabold"><Sparkles className="h-4 w-4 text-amber-500" aria-hidden />Upcoming Holidays</h2>
        {upcoming.length === 0 ? <p className="mt-2 text-sm font-semibold text-slate-500">No more holidays scheduled.</p> : (
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {upcoming.map((h) => (
              <button key={h.id} onClick={() => openEdit(h)} className="rounded-2xl bg-slate-50 p-4 text-left transition-all hover:bg-sky-50" title={h.description}>
                <p className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">{h.date}</p>
                <p className="mt-0.5 truncate text-sm font-extrabold">{h.name}</p>
                <span className={cn("mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-extrabold", holidayTypeStyle[h.type])}>{h.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex gap-1.5" role="tablist" aria-label="Select year">
          {["2026", "2027"].map((y) => (
            <button key={y} role="tab" aria-selected={year === y} onClick={() => setYear(y)}
              className={cn("rounded-xl px-5 py-2 text-[13px] font-bold", year === y ? "bg-[#24324A] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>
              {y}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:ml-auto" role="tablist" aria-label="Filter by type">
          {["All", ...types].map((t) => (
            <button key={t} role="tab" aria-selected={typeFilter === t} onClick={() => setTypeFilter(t)}
              className={cn("rounded-full px-3.5 py-1.5 text-[12px] font-bold", typeFilter === t ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* full-year calendar */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {monthNames.map((mn, mi) => (
          <div key={mn} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <h3 className="text-[14px] font-extrabold">{mn} <span className="font-semibold text-slate-400">{year}</span></h3>
            <div className="mt-2.5 grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-400">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {monthCells(mi).map((c, i) => {
                if (c.day === null) return <span key={i} />;
                const hs = (byDate.get(c.iso!) ?? []).filter((h) => typeFilter === "All" || h.type === typeFilter);
                const isOff = new Date(c.iso! + "T00:00:00").getDay() === settings.weeklyHoliday;
                const first = hs[0];
                return (
                  <button
                    key={i}
                    onClick={() => (first ? openEdit(first) : openAdd(c.iso!))}
                    title={hs.length ? hs.map((h) => `${h.name} (${h.type})`).join(" · ") : isOff ? `Weekly off (${weekDays[settings.weeklyHoliday]})` : c.iso!}
                    aria-label={`${c.iso}${first ? `, ${first.name}` : ""}`}
                    className={cn(
                      "flex h-8 flex-col items-center justify-center rounded-lg text-[12px] font-bold transition-all",
                      hs.length
                        ? `${holidayTypeStyle[first.type]} hover:opacity-80`
                        : isOff
                          ? "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                    )}
                  >
                    {c.day}
                    {hs.length > 0 && <span className="h-1 w-1 rounded-full bg-current" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[13px] font-semibold text-slate-500">
        {canManage ? "Tip: click any date to add a holiday, or click a colored date to edit it." : "Holiday calendar is read-only for your role."} Dates marked * follow the lunar calendar and may shift by a day.
      </p>

      {/* weekly off setting */}
      {canManage && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[15px] font-extrabold">Weekly Holiday</h2>
            <p className="text-[13px] font-medium text-slate-500">Attendance registers treat this day as a holiday.</p>
          </div>
          <select
            value={settings.weeklyHoliday}
            onChange={(e) => {
              updateSettings({ weeklyHoliday: Number(e.target.value) });
              toast(`Weekly holiday set to ${weekDays[Number(e.target.value)]}.`);
              log(`Changed weekly holiday to ${weekDays[Number(e.target.value)]}`, "Holidays");
            }}
            aria-label="Weekly holiday"
            className="rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm font-bold outline-none focus:border-sky-400 sm:ml-auto"
          >
            {weekDays.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
        </div>
      )}

      {(adding !== null || editing) && (
        <Modal title={editing ? "Edit Holiday" : "Add Holiday"} onClose={() => { setAdding(null); setEditing(null); }}>
          <form onSubmit={editing ? submitEdit : submitAdd} className="space-y-3.5">
            {formFields}
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">
              {editing ? "Save Changes" : "Add Holiday"}
            </button>
            {editing && (
              <button type="button" onClick={() => setConfirmDel(editing.id)} className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-100">
                Delete This Holiday
              </button>
            )}
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete holiday?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">This date will become a regular school day.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={() => { removeHoliday(confirmDel); toast("Holiday deleted.", "info"); log("Deleted a holiday", "Holidays"); setConfirmDel(null); setEditing(null); }} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white">Delete</button>
          </div>
        </Modal>
      )}

    </div>
  );
}
