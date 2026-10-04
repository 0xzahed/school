"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls, Empty, Progress } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { classList, sections, todayISO, type Homework } from "@/data/sms";

const subjects = ["Bangla", "English", "Mathematics", "Science", "ICT", "Social Science"];

export default function HomeworkPage() {
  const { homework, addHomework, removeHomework, toast, log } = useAdmin();
  const [cls, setCls] = useState("All");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ class: "Class 6", section: "A", subject: "Mathematics", title: "", due: todayISO() });

  const list = useMemo(() => homework.filter((h) => cls === "All" || h.class === cls), [homework, cls]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h: Homework = {
      id: `HW-${Date.now().toString().slice(-4)}`, class: form.class, section: form.section,
      subject: form.subject, title: form.title.trim(), due: form.due, done: 0, total: 32, status: "Active",
    };
    addHomework(h);
    toast("Homework assigned successfully.");
    log(`Assigned homework: ${h.title} (${h.class}-${h.section})`, "Homework");
    setAdding(false);
    setForm({ class: "Class 6", section: "A", subject: "Mathematics", title: "", due: todayISO() });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Homework"
        sub={`${list.length} assignments · track submissions per class`}
        action={
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> Assign Homework
          </button>
        }
      />

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
        <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Filter by class"
          className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
          <option>All</option>
          {classList.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {list.length === 0 ? <Empty title="No homework found." /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((h) => (
            <article key={h.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-extrabold tracking-wider text-sky-600 uppercase">{h.subject} · {h.class}-{h.section}</p>
                  <h2 className="mt-1 text-[15px] font-extrabold">{h.title}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={h.status}>{h.status}</Badge>
                  <button onClick={() => { removeHomework(h.id); toast("Homework removed.", "info"); }} aria-label={`Delete ${h.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">Due {h.due} · {h.done}/{h.total} submitted</p>
              <div className="mt-2.5"><Progress value={(h.done / h.total) * 100} color={h.done / h.total > 0.8 ? "bg-emerald-400" : "bg-sky-400"} /></div>
            </article>
          ))}
        </div>
      )}

      {adding && (
        <Modal title="Assign Homework" onClose={() => setAdding(false)}>
          <form onSubmit={submit} className="space-y-3.5">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Class"><select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className={inputCls}>{classList.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Section"><select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className={inputCls}>{sections.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Subject"><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <Field label="Title *"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Exercise 5.1 — Q1 to Q8" className={inputCls} /></Field>
            <Field label="Due date *"><input required type="date" value={form.due} min={todayISO()} onChange={(e) => setForm({ ...form, due: e.target.value })} className={inputCls} /></Field>
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">Assign Homework</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
