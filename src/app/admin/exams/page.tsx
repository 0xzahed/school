"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { PageHeader, Badge, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { useState } from "react";
import { Modal, Field, inputCls } from "@/components/admin/ui";
import { todayISO } from "@/data/sms";

export default function ExamsPage() {
  const { examList, examSlots, toast, log } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", classes: "Class 6 – Class 10", start: todayISO(), end: todayISO() });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Exam created successfully.");
    log(`Created exam: ${form.name}`, "Exams");
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Exams"
        sub="Schedules, routines and marks entry"
        action={
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> Create Exam
          </button>
        }
      />

      {examList.length === 0 ? <Empty title="No exams yet." /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {examList.map((x) => {
            const slots = examSlots.filter((s) => s.examId === x.id).length;
            return (
              <article key={x.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-[16px] font-extrabold">{x.name}</h2>
                    <p className="mt-0.5 text-[13px] font-semibold text-slate-500">{x.year} · {x.classes}</p>
                  </div>
                  <Badge tone={x.status} dot>{x.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[["Starts", x.start], ["Ends", x.end], ["Papers", String(slots)]].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-slate-50 px-2 py-2.5">
                      <p className="text-[10.5px] font-extrabold tracking-wider text-slate-400 uppercase">{k}</p>
                      <p className="text-[13px] font-extrabold">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/exams/${x.id}`} className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#24324A] py-2.5 text-[13px] font-bold text-white">
                    Open &amp; Enter Marks <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                  <Link href="/admin/results" className="flex-1 rounded-xl border border-[#E2E8F0] py-2.5 text-center text-[13px] font-bold hover:bg-slate-50">
                    Results
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {adding && (
        <Modal title="Create Exam" onClose={() => setAdding(false)}>
          <form onSubmit={submit} className="space-y-3.5">
            <Field label="Exam name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mid Term Examination" className={inputCls} /></Field>
            <Field label="Classes"><input value={form.classes} onChange={(e) => setForm({ ...form, classes: e.target.value })} className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date"><input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={inputCls} /></Field>
              <Field label="End date"><input type="date" value={form.end} min={form.start} onChange={(e) => setForm({ ...form, end: e.target.value })} className={inputCls} /></Field>
            </div>
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">Create Exam</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
