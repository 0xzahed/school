"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, Printer, Download, FileCheck, Upload } from "lucide-react";
import { Avatar, Badge, Tabs, Progress, Empty, Modal, Field, inputCls, btnPrimary, btnGhost } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { pastStatus, marksFor, gradeFor, tk, type Student } from "@/data/sms";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Attendance", "Results", "Fees", "Homework", "Documents", "Activity"];

export default function StudentProfile() {
  const params = useParams();
  const id = String(params.id);
  const { students, attendance, holidays, settings, invoices, homework, activity, updateStudent, toast, log } = useAdmin();
  const [tab, setTab] = useState("Overview");
  const [editing, setEditing] = useState(false);
  const [docs, setDocs] = useState(["Birth Certificate", "Previous Report Card"]);
  const [form, setForm] = useState({ phone: "", address: "" });

  const s: Student | undefined = students.find((x) => x.id === id);

  const att = useMemo(() => {
    if (!s) return { pct: 100, days: [] as Array<{ d: string; st: string }> };
    const hset = new Set(holidays.map((h) => h.date));
    const days: Array<{ d: string; st: string }> = [];
    let p = 0, n = 0;
    for (let i = 0; i < 20; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const st: string = attendance[`${iso}|${s.class}|${s.section}`]?.[s.id] ?? pastStatus(iso, s.id, hset, settings.weeklyHoliday);
      days.push({ d: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), st });
      if (st === "H") continue;
      n++;
      if (st === "P") p++;
    }
    return { pct: n ? Math.round((p / n) * 100) : 100, days };
  }, [s, attendance, holidays, settings.weeklyHoliday]);

  const results = useMemo(() => {
    if (!s) return [];
    const subs = ["Bangla", "English", "Mathematics", "Science", "ICT"];
    return subs.map((sub) => ({ sub, ...marksFor(s.id, sub) }));
  }, [s]);
  const avg = results.length ? Math.round(results.reduce((a, r) => a + r.total, 0) / results.length) : 0;

  const myInvoices = useMemo(() => (s ? invoices.filter((v) => v.studentId === s.id).slice(0, 6) : []), [invoices, s]);
  const myHomework = useMemo(() => (s ? homework.filter((h) => h.class === s.class).slice(0, 5) : []), [homework, s]);
  const myActivity = useMemo(() => activity.filter((x) => x.action.includes(s?.name ?? "§none§")).slice(0, 6), [activity, s]);

  if (!s) {
    return (
      <div className="space-y-4">
        <Link href="/admin/students" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600"><ArrowLeft className="h-4 w-4" aria-hidden /> Back to Students</Link>
        <Empty title="Student not found." sub="The record may have been deleted." />
      </div>
    );
  }

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(s.id, { phone: form.phone || s.phone, address: form.address || s.address });
    toast("Student updated successfully.");
    log(`Updated student profile (${s.name})`, "Students");
    setEditing(false);
  };

  const downloadProfile = () => {
    const text = `STUDENT PROFILE\nName: ${s.name}\nID: ${s.id}\nClass: ${s.class}-${s.section}, Roll ${s.roll}\nGuardian: ${s.father} (${s.phone})\nAttendance: ${att.pct}%\nAverage: ${avg}%`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = `${s.id}-profile.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Profile downloaded.");
  };

  return (
    <div className="space-y-4">
      <Link href="/admin/students" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Students
      </Link>

      {/* header card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:flex-row sm:items-center">
        <Avatar name={s.name} size="h-20 w-20 text-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{s.name}</h1>
            <Badge tone={s.status} dot>{s.status}</Badge>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-slate-500">Student ID: {s.id} · {s.class} · Section {s.section} · Roll {s.roll}</p>
          <div className="mt-2 flex gap-4 text-[13px] font-bold">
            <span>Attendance <span className="text-emerald-600">{att.pct}%</span></span>
            <span>Average <span className="text-sky-600">{avg}%</span></span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setForm({ phone: s.phone, address: s.address }); setEditing(true); }} className={btnGhost}><Pencil className="h-4 w-4" aria-hidden /> Edit Student</button>
          <button onClick={() => window.print()} className={btnGhost}><Printer className="h-4 w-4" aria-hidden /> Print ID Card</button>
          <button onClick={downloadProfile} className={btnPrimary}><Download className="h-4 w-4" aria-hidden /> Download Profile</button>
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "Overview" && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Personal Information", rows: [["Full Name", s.name], ["Date of Birth", s.dob], ["Gender", s.gender], ["Blood Group", s.blood], ["Address", s.address]] },
            { t: "Academic Information", rows: [["Class", s.class], ["Section", s.section], ["Roll", String(s.roll)], ["Academic Year", s.year], ["Status", s.status]] },
            { t: "Guardian Information", rows: [["Father", s.father], ["Mother", s.mother], ["Guardian Phone", s.phone], ["Email", s.email || "—"]] },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <h2 className="text-[14px] font-extrabold">{c.t}</h2>
              <dl className="mt-3 space-y-2.5">
                {c.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-[13px]">
                    <dt className="font-medium text-slate-500">{k}</dt>
                    <dd className="text-right font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}

      {tab === "Attendance" && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">Last 20 school days · {att.pct}% present</h2>
            <div className="w-40"><Progress value={att.pct} color="bg-emerald-400" /></div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-10">
            {att.days.map((d, i) => (
              <div key={i} className={cn("rounded-xl px-1 py-2.5 text-center", d.st === "P" ? "bg-emerald-50" : d.st === "A" ? "bg-red-50" : d.st === "L" ? "bg-amber-50" : "bg-slate-50")}>
                <p className="text-[10.5px] font-bold text-slate-500">{d.d}</p>
                <p className={cn("text-sm font-extrabold", d.st === "P" ? "text-emerald-600" : d.st === "A" ? "text-red-500" : d.st === "L" ? "text-amber-600" : "text-slate-400")}>{d.st}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Results" && (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
              <th className="px-5 py-3.5 font-extrabold">Subject</th><th className="px-3 py-3.5 text-center font-extrabold">Written</th>
              <th className="px-3 py-3.5 text-center font-extrabold">MCQ</th><th className="px-3 py-3.5 text-center font-extrabold">Total</th>
              <th className="px-5 py-3.5 text-center font-extrabold">Grade</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.sub} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3 font-bold">{r.sub}</td>
                  <td className="px-3 py-3 text-center font-semibold">{r.written}</td>
                  <td className="px-3 py-3 text-center font-semibold">{r.mcq}</td>
                  <td className="px-3 py-3 text-center font-extrabold">{r.total}</td>
                  <td className="px-5 py-3 text-center"><Badge tone={r.total >= 70 ? "Approved" : "Pending"}>{gradeFor(r.total)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[#E2E8F0] px-5 py-3.5 text-sm font-bold">Term average: <span className="text-sky-600">{avg}%</span> · Grade {gradeFor(avg)}</p>
        </div>
      )}

      {tab === "Fees" && (
        <div className="space-y-2.5">
          {myInvoices.length === 0 && <Empty title="No invoices for this student." />}
          {myInvoices.map((v) => (
            <div key={v.no} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3.5 text-sm">
              <span className="font-extrabold">{v.no}</span>
              <span className="font-semibold text-slate-500">{v.head}</span>
              <span className="ml-auto font-extrabold">{tk(v.amount)}</span>
              <Badge tone={v.status} dot>{v.status}</Badge>
            </div>
          ))}
          <Link href="/admin/fees" className="inline-block text-[13px] font-bold text-sky-600 hover:underline">Open finance dashboard →</Link>
        </div>
      )}

      {tab === "Homework" && (
        <div className="space-y-2.5">
          {myHomework.length === 0 && <Empty title="No homework assigned to this class." />}
          {myHomework.map((h) => (
            <div key={h.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="flex-1 text-sm font-bold">{h.title}</p>
                <Badge tone={h.status}>{h.status}</Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">{h.subject} · Due {h.due}</p>
              <div className="mt-2"><Progress value={(h.done / h.total) * 100} /></div>
            </div>
          ))}
        </div>
      )}

      {tab === "Documents" && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <ul className="space-y-2.5">
            {docs.map((d) => (
              <li key={d} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold">
                <FileCheck className="h-4 w-4 text-emerald-500" aria-hidden />{d}
                <span className="ml-auto text-xs font-bold text-emerald-600">Verified</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => { setDocs((p) => [...p, `Document ${p.length + 1}`]); toast("Document uploaded.", "info"); }}
            className={cn(btnGhost, "mt-4")}>
            <Upload className="h-4 w-4" aria-hidden /> Upload Document
          </button>
        </div>
      )}

      {tab === "Activity" && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          {myActivity.length === 0 ? <Empty title="No activity yet for this student." /> : (
            <ol className="space-y-3.5">
              {myActivity.map((x) => (
                <li key={x.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" aria-hidden />
                  <div><p className="font-bold">{x.action}</p><p className="text-xs font-medium text-slate-500">{x.user} · {x.module} · {x.time}</p></div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {editing && (
        <Modal title={`Edit ${s.name}`} onClose={() => setEditing(false)}>
          <form onSubmit={submitEdit} className="space-y-4">
            <Field label="Guardian phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></Field>
            <Field label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} /></Field>
            <button type="submit" className={cn(btnPrimary, "w-full py-3")}>Save Changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
