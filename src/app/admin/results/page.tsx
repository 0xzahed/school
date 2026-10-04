"use client";

import { useMemo, useState } from "react";
import { Eye, Download, Printer, Send, Undo2 } from "lucide-react";
import { PageHeader, Badge, Tabs, Modal, Avatar, btnPrimary, btnGhost, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { classList, marksFor, gradeFor } from "@/data/sms";

export default function ResultsPage() {
  const { examList, students, publishedResults, publishResult, unpublishResult, toast, log } = useAdmin();
  const [tab, setTab] = useState("Published");
  const [cls, setCls] = useState("Class 8");
  const [reportFor, setReportFor] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      examList.map((e) => {
        const keys = classList.slice(2).map((c) => `${e.id}|${c}`);
        const pub = keys.filter((k) => publishedResults.includes(k)).length;
        const status = pub === 0 ? "Pending" : pub === keys.length ? "Published" : "Draft";
        return { exam: e, pub, total: keys.length, status };
      }),
    [examList, publishedResults]
  );

  const filtered = rows.filter((r) =>
    tab === "Published" ? r.status === "Published" || r.pub > 0 : tab === "Draft" ? r.status === "Draft" : r.status === "Pending"
  );

  const reportStudent = reportFor ? students.find((s) => s.id === reportFor) : null;
  const reportMarks = useMemo(() => {
    if (!reportStudent) return [];
    return ["Bangla", "English", "Mathematics", "Science", "ICT"].map((sub) => ({ sub, ...marksFor(reportStudent.id, sub) }));
  }, [reportStudent]);

  const togglePublish = (examId: string, c: string) => {
    const key = `${examId}|${c}`;
    if (publishedResults.includes(key)) {
      unpublishResult(key);
      toast("Result unpublished.", "info");
    } else {
      publishResult(key);
      toast(`Result published for ${c}.`);
      log(`Published result for ${c}`, "Results");
    }
  };

  const printCSV = () => {
    const list = students.filter((s) => s.class === cls).slice(0, 30);
    const rowsCsv = [["ID", "Name", "Bangla", "English", "Math", "Science", "ICT", "Avg", "Grade"],
      ...list.map((s) => {
        const ms = ["Bangla", "English", "Mathematics", "Science", "ICT"].map((sub) => marksFor(s.id, sub).total);
        const avg = Math.round(ms.reduce((a, b) => a + b, 0) / ms.length);
        return [s.id, s.name, ...ms, avg, gradeFor(avg)];
      })];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rowsCsv.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
    a.download = `results-${cls.replace(" ", "")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Result sheet downloaded as CSV.");
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Results"
        sub="Publish, preview report cards and download sheets"
        action={
          <div className="flex gap-2">
            <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Select class"
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-sky-400">
              {classList.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button onClick={printCSV} className={btnGhost}><Download className="h-4 w-4" aria-hidden /> CSV</button>
            <button onClick={() => window.print()} className={btnGhost}><Printer className="h-4 w-4" aria-hidden /> Print</button>
          </div>
        }
      />

      <Tabs tabs={["Published", "Draft", "Pending"]} active={tab} onChange={setTab} />

      {filtered.length === 0 ? <Empty title={`No ${tab.toLowerCase()} results.`} /> : (
        <div className="space-y-3">
          {filtered.map(({ exam, pub, total, status }) => (
            <article key={exam.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-extrabold">{exam.name} <span className="font-semibold text-slate-400">· {exam.year}</span></h2>
                  <p className="text-xs font-semibold text-slate-500">{pub}/{total} class reports published</p>
                </div>
                <Badge tone={status} dot>{status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {classList.slice(2, 8).map((c) => {
                  const on = publishedResults.includes(`${exam.id}|${c}`);
                  return (
                    <button key={c} onClick={() => togglePublish(exam.id, c)} title={`${on ? "Unpublish" : "Publish"} ${c}`}
                      className={`rounded-full px-3 py-1.5 text-[11.5px] font-extrabold transition-all ${on ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                      {c.replace("Class ", "C")}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                <button onClick={() => { const s = students.find((x) => x.class === cls); if (s) setReportFor(s.id); }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-[13px] font-bold hover:bg-slate-200">
                  <Eye className="h-4 w-4" aria-hidden /> Report Card Preview ({cls})
                </button>
                <button onClick={() => togglePublish(exam.id, cls)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#24324A] py-2.5 text-[13px] font-bold text-white">
                  {publishedResults.includes(`${exam.id}|${cls}`) ? <><Undo2 className="h-4 w-4" aria-hidden /> Unpublish {cls}</> : <><Send className="h-4 w-4" aria-hidden /> Publish {cls}</>}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {reportStudent && (
        <Modal title={`Report Card · ${reportStudent.name}`} onClose={() => setReportFor(null)}>
          <div className="rounded-2xl border-2 border-[#24324A] p-5">
            <div className="flex items-center gap-3 border-b-2 border-[#24324A] pb-3">
              <Avatar name={reportStudent.name} size="h-12 w-12" />
              <div>
                <p className="text-[15px] font-extrabold">Sunshine Valley School</p>
                <p className="text-xs font-semibold text-slate-500">{reportStudent.name} · {reportStudent.id} · {reportStudent.class}-{reportStudent.section} · Roll {reportStudent.roll}</p>
              </div>
              <Badge tone="Published">Final</Badge>
            </div>
            <table className="mt-3 w-full text-left text-sm">
              <thead><tr className="text-[11px] tracking-wider text-slate-500 uppercase">
                <th className="py-2 font-extrabold">Subject</th><th className="py-2 text-center font-extrabold">Written</th>
                <th className="py-2 text-center font-extrabold">MCQ</th><th className="py-2 text-center font-extrabold">Total</th>
                <th className="py-2 text-center font-extrabold">Grade</th></tr></thead>
              <tbody>
                {reportMarks.map((r) => (
                  <tr key={r.sub} className="border-t border-slate-100">
                    <td className="py-2 font-bold">{r.sub}</td>
                    <td className="py-2 text-center font-semibold">{r.written}</td>
                    <td className="py-2 text-center font-semibold">{r.mcq}</td>
                    <td className="py-2 text-center font-extrabold">{r.total}</td>
                    <td className="py-2 text-center font-extrabold">{gradeFor(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-extrabold">
              <span>Average: {Math.round(reportMarks.reduce((a, r) => a + r.total, 0) / Math.max(1, reportMarks.length))}%</span>
              <span>Grade: {gradeFor(Math.round(reportMarks.reduce((a, r) => a + r.total, 0) / Math.max(1, reportMarks.length)))}</span>
            </div>
          </div>
          <button onClick={() => { setReportFor(null); setCls(reportStudent.class); }} className={btnPrimary + " mt-4 w-full py-3"}>Done</button>
        </Modal>
      )}
    </div>
  );
}
