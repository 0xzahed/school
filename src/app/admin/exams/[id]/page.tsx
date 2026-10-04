"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Save, Send, Eye } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls, Empty, Tabs, btnPrimary, btnGhost } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { classList, marksFor, gradeFor, todayISO, type ExamSlot } from "@/data/sms";
import { cn } from "@/lib/utils";

const examSubs = ["Bangla", "English", "Mathematics", "Science", "ICT"];

export default function ExamDetail() {
  const params = useParams();
  const id = String(params.id);
  const { examList, examSlots, students, addExamSlot, publishedResults, publishResult, toast, log } = useAdmin();
  const [tab, setTab] = useState("Routine");
  const [cls, setCls] = useState("Class 8");
  const [adding, setAdding] = useState(false);
  const [preview, setPreview] = useState<Omit<ExamSlot, "id"> | null>(null);
  const [draft, setDraft] = useState<Record<string, { w: string; m: string }>>({});
  const [form, setForm] = useState({ class: "Class 8", subject: "Mathematics", date: todayISO(), start: "09:00", end: "12:00", room: "Room 201" });

  const exam = examList.find((e) => e.id === id);
  const slots = useMemo(() => examSlots.filter((s) => s.examId === id), [examSlots, id]);
  const roster = useMemo(() => students.filter((s) => s.class === cls).slice(0, 20), [students, cls]);
  const resultKey = `${id}|${cls}`;
  const published = publishedResults.includes(resultKey);

  if (!exam) {
    return (
      <div className="space-y-4">
        <Link href="/admin/exams" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600"><ArrowLeft className="h-4 w-4" aria-hidden /> Back to Exams</Link>
        <Empty title="Exam not found." />
      </div>
    );
  }

  const marksOf = (sid: string, sub: string) => {
    const d = draft[`${sid}|${sub}`];
    if (d) {
      const w = Math.max(0, Math.min(70, Number(d.w) || 0));
      const m = Math.max(0, Math.min(30, Number(d.m) || 0));
      return { written: w, mcq: m, total: w + m, edited: true };
    }
    const base = marksFor(sid, sub, id);
    return { ...base, edited: false };
  };

  const startPreview = (e: React.FormEvent) => {
    e.preventDefault();
    setPreview({ examId: id, ...form });
  };
  const confirmPublish = () => {
    if (!preview) return;
    addExamSlot({ ...preview, id: `ES-${Date.now()}` });
    toast("Exam paper scheduled and published.");
    log(`Scheduled ${preview.subject} for ${preview.class} (${exam.name})`, "Exams");
    setPreview(null);
    setAdding(false);
  };

  const publish = () => {
    publishResult(resultKey);
    toast(`Result published for ${cls}. Parents can now view it.`);
    log(`Published ${exam.name} result for ${cls}`, "Results");
  };

  return (
    <div className="space-y-4">
      <Link href="/admin/exams" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Exams
      </Link>
      <PageHeader
        title={exam.name}
        sub={`${exam.year} · ${exam.classes} · ${exam.start} → ${exam.end}`}
        action={<Badge tone={exam.status} dot>{exam.status}</Badge>}
      />

      <Tabs tabs={["Routine", "Marks Entry"]} active={tab} onChange={setTab} />

      {tab === "Routine" && (
        <>
          <div className="flex justify-end">
            <button onClick={() => setAdding(true)} className={btnPrimary}><Plus className="h-4 w-4" aria-hidden /> Schedule Paper</button>
          </div>
          {slots.length === 0 ? <Empty title="No papers scheduled yet." sub="Schedule the first paper above." /> : (
            <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                  <th className="px-5 py-3.5 font-extrabold">Class</th><th className="px-3 py-3.5 font-extrabold">Subject</th>
                  <th className="px-3 py-3.5 font-extrabold">Date</th><th className="px-3 py-3.5 font-extrabold">Time</th>
                  <th className="px-5 py-3.5 font-extrabold">Room</th></tr></thead>
                <tbody>
                  {slots.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-3 font-bold">{s.class}</td>
                      <td className="px-3 py-3 font-semibold">{s.subject}</td>
                      <td className="px-3 py-3 font-semibold">{s.date}</td>
                      <td className="px-3 py-3 font-semibold">{s.start} – {s.end}</td>
                      <td className="px-5 py-3 font-semibold">{s.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "Marks Entry" && (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
            <select value={cls} onChange={(e) => { setCls(e.target.value); setDraft({}); }} aria-label="Select class"
              className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
              {classList.map((c) => <option key={c}>{c}</option>)}
            </select>
            <span className="text-[13px] font-semibold text-slate-500">Written /70 + MCQ /30 · total &amp; grade auto-calculated</span>
            <div className="flex gap-2 sm:ml-auto">
              <button onClick={() => { toast("Draft saved. Nothing published yet.", "info"); }} className={btnGhost}><Save className="h-4 w-4" aria-hidden /> Save Draft</button>
              {published ? (
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-600"><Eye className="h-4 w-4" aria-hidden /> Published</span>
              ) : (
                <button onClick={publish} className={btnPrimary}><Send className="h-4 w-4" aria-hidden /> Publish Result</button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                <th className="px-5 py-3.5 font-extrabold">Student</th>
                {examSubs.map((s) => <th key={s} className="px-2 py-3.5 text-center font-extrabold" colSpan={2}>{s.slice(0, 4)}</th>)}
                <th className="px-5 py-3.5 text-center font-extrabold">Avg / Grade</th>
              </tr></thead>
              <tbody>
                {roster.map((s) => {
                  const totals = examSubs.map((sub) => marksOf(s.id, sub).total);
                  const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
                  return (
                    <tr key={s.id} className="border-b border-slate-100 align-top last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-bold whitespace-nowrap">{s.name}</p>
                        <p className="text-[11px] font-semibold text-slate-400">Roll {s.roll}</p>
                      </td>
                      {examSubs.map((sub) => {
                        const mk = marksOf(s.id, sub);
                        const k = `${s.id}|${sub}`;
                        return (
                          <td key={sub} className="px-1 py-2 text-center" colSpan={2}>
                            <div className="flex items-center justify-center gap-1">
                              <input value={draft[k]?.w ?? String(mk.written)} aria-label={`${s.name} ${sub} written marks`}
                                onChange={(e) => setDraft((p) => ({ ...p, [k]: { w: e.target.value, m: p[k]?.m ?? String(mk.mcq) } }))}
                                className={cn("w-12 rounded-lg border px-1 py-1.5 text-center text-[13px] font-bold outline-none focus:border-sky-400", mk.edited ? "border-amber-300 bg-amber-50" : "border-[#E2E8F0]")} />
                              <input value={draft[k]?.m ?? String(mk.mcq)} aria-label={`${s.name} ${sub} MCQ marks`}
                                onChange={(e) => setDraft((p) => ({ ...p, [k]: { w: p[k]?.w ?? String(mk.written), m: e.target.value } }))}
                                className={cn("w-12 rounded-lg border px-1 py-1.5 text-center text-[13px] font-bold outline-none focus:border-sky-400", mk.edited ? "border-amber-300 bg-amber-50" : "border-[#E2E8F0]")} />
                            </div>
                            <p className="mt-1 text-[11px] font-extrabold text-slate-500">= {mk.total} · {gradeFor(mk.total)}</p>
                          </td>
                        );
                      })}
                      <td className="px-5 py-3 text-center">
                        <p className="text-[15px] font-extrabold">{avg}</p>
                        <Badge tone={avg >= 70 ? "Approved" : "Pending"}>{gradeFor(avg)}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] font-semibold text-slate-500">Showing first 20 of {cls} · edited cells highlight amber · validation clamps Written ≤ 70 and MCQ ≤ 30.</p>
        </>
      )}

      {adding && !preview && (
        <Modal title="Schedule Exam Paper" onClose={() => setAdding(false)}>
          <form onSubmit={startPreview} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Class"><select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className={inputCls}>{classList.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Subject"><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls}>{examSubs.map((s) => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <Field label="Date *"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Start"><input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={inputCls} /></Field>
              <Field label="End"><input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className={inputCls} /></Field>
              <Field label="Room"><input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className={inputCls} /></Field>
            </div>
            <button type="submit" className="w-full rounded-xl bg-[#24324A] px-4 py-3 text-sm font-bold text-white">Preview Schedule</button>
          </form>
        </Modal>
      )}

      {preview && (
        <Modal title="Preview Before Publishing" onClose={() => setPreview(null)}>
          <div className="rounded-2xl bg-slate-50 p-5 text-sm">
            <p className="text-lg font-extrabold">{preview.subject} · {preview.class}</p>
            <p className="mt-1 font-semibold text-slate-500">{exam.name}</p>
            <dl className="mt-3 space-y-2">
              {[["Date", preview.date], ["Time", `${preview.start} – ${preview.end}`], ["Room", preview.room]].map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-lg bg-white px-3.5 py-2.5"><dt className="font-medium text-slate-500">{k}</dt><dd className="font-bold">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="mt-4 flex gap-2.5">
            <button onClick={() => setPreview(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm font-bold">Back to Edit</button>
            <button onClick={confirmPublish} className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600">Publish Schedule</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
