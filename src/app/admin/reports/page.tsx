"use client";

import { useState } from "react";
import { Download, Printer, FileText, ChevronRight } from "lucide-react";
import { PageHeader, Empty, TableSkeleton } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { tk } from "@/data/sms";

const groups = [
  {
    title: "Student Reports",
    items: [
      { name: "Student List", desc: "All enrolled students with class & guardian", run: (d: ReportData) => d.students.slice(0, 30).map((s) => [s.id, s.name, `${s.class}-${s.section}`, s.father, s.phone]) },
      { name: "Attendance Report", desc: "Today's presence summary by class", run: (d: ReportData) => d.attendance },
      { name: "Class Distribution", desc: "Strength per class and section", run: (d: ReportData) => d.distribution },
    ],
  },
  {
    title: "Academic Reports",
    items: [
      { name: "Result Report", desc: "Term averages and grades by class", run: (d: ReportData) => d.results },
      { name: "Subject Performance", desc: "Average score per subject", run: (d: ReportData) => d.subjects },
      { name: "Exam Report", desc: "All exams with status and dates", run: (d: ReportData) => d.exams },
    ],
  },
  {
    title: "Finance Reports",
    items: [
      { name: "Collection Report", desc: "Payments received this session", run: (d: ReportData) => d.collection },
      { name: "Due Report", desc: "Outstanding invoices by student", run: (d: ReportData) => d.dues },
      { name: "Payment Report", desc: "Every payment with method & date", run: (d: ReportData) => d.payments },
    ],
  },
  {
    title: "Staff Reports",
    items: [
      { name: "Teacher List", desc: "All staff with department & subject", run: (d: ReportData) => d.teachers },
      { name: "Library Report", desc: "Catalog, issued and overdue", run: (d: ReportData) => d.library },
    ],
  },
];

type Row = (string | number)[];
type ReportData = {
  students: { id: string; name: string; class: string; section: string; father: string; phone: string }[];
  attendance: Row[]; distribution: Row[]; results: Row[]; subjects: Row[];
  exams: Row[]; collection: Row[]; dues: Row[]; payments: Row[];
  teachers: { name: string; department: string; subject: string; phone: string }[]; library: Row[];
};

export default function ReportsPage() {
  const { students, teachers, invoices, payments, examList, books, loans, attendance } = useAdmin();
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [cols, setCols] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  const data: ReportData = {
    students: students.map((s) => ({ id: s.id, name: s.name, class: s.class, section: s.section, father: s.father, phone: s.phone })),
    attendance: (() => {
      const map = new Map<string, { p: number; t: number }>();
      students.forEach((s) => {
        const e = map.get(s.class) ?? { p: 0, t: 0 };
        e.t++;
        const st: string = attendance[`${new Date().toISOString().slice(0, 10)}|${s.class}|${s.section}`]?.[s.id] ?? "P";
        if (st === "P") e.p++;
        map.set(s.class, e);
      });
      return Array.from(map.entries()).map(([c, v]) => [c, v.t, v.p, `${Math.round((v.p / Math.max(1, v.t)) * 100)}%`]);
    })(),
    distribution: (() => {
      const map = new Map<string, number>();
      students.forEach((s) => map.set(`${s.class}-${s.section}`, (map.get(`${s.class}-${s.section}`) ?? 0) + 1));
      return Array.from(map.entries()).slice(0, 30).map(([k, v]) => [k, v]);
    })(),
    results: students.filter((s) => s.class === "Class 8").slice(0, 25).map((s) => [s.id, s.name, 78, "A"]),
    subjects: ["Bangla", "English", "Mathematics", "Science", "ICT"].map((s) => [s, 76]),
    exams: examList.map((e) => [e.name, e.year, e.start, e.end, e.status]),
    collection: payments.slice(0, 30).map((p) => [p.id, p.invoice, tk(p.amount), p.method, p.date]),
    dues: invoices.filter((v) => v.amount - v.paid > 0).slice(0, 30).map((v) => [v.no, v.studentId, tk(v.amount - v.paid)]),
    payments: payments.slice(0, 30).map((p) => [p.id, p.invoice, p.studentId, tk(p.amount), p.method, p.date, p.status]),
    teachers: teachers.map((t) => ({ name: t.name, department: t.department, subject: t.subject, phone: t.phone })),
    library: [[`Titles: ${books.length}`, `Issued: ${loans.filter((l) => !l.returned).length}`, `Overdue: ${loans.filter((l) => !l.returned && l.due < new Date().toISOString().slice(0, 10)).length}`]],
  };

  const headers: Record<string, string[]> = {
    "Student List": ["ID", "Name", "Class", "Guardian", "Phone"],
    "Attendance Report": ["Class", "Total", "Present", "Rate"],
    "Class Distribution": ["Class-Section", "Students"],
    "Result Report": ["ID", "Name", "Average", "Grade"],
    "Subject Performance": ["Subject", "Average %"],
    "Exam Report": ["Exam", "Year", "Start", "End", "Status"],
    "Collection Report": ["Payment", "Invoice", "Amount", "Method", "Date"],
    "Due Report": ["Invoice", "Student", "Due"],
    "Payment Report": ["Payment", "Invoice", "Student", "Amount", "Method", "Date", "Status"],
    "Teacher List": ["Name", "Department", "Subject", "Phone"],
    "Library Report": ["Titles", "Issued", "Overdue"],
  };

  const generate = (name: string, run: (d: ReportData) => Row[] | { name: string; department: string; subject: string; phone: string }[] | { id: string; name: string; class: string; section: string; father: string; phone: string }[]) => {
    setOpen(name);
    setLoading(true);
    setRows([]);
    setTitle(name);
    setCols(headers[name] ?? []);
    setTimeout(() => {
      const out = run(data) as Row[] | Record<string, string>[];
      const normalized: Row[] = (out as (Row | Record<string, string>)[]).map((r) =>
        Array.isArray(r) ? r : [r.name ?? r.id ?? "", r.department ?? r.class ?? "", r.subject ?? r.section ?? "", r.phone ?? r.father ?? ""]
      );
      setRows(normalized);
      setLoading(false);
    }, 600);
  };

  const downloadCSV = () => {
    const a = document.createElement("a");
    const csv = [title, cols.join(","), ...rows.map((r) => r.join(","))].join("\n");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Reports" sub="Generate, export and print school reports" />

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <h2 className="text-[15px] font-extrabold">{g.title}</h2>
            <ul className="mt-3 space-y-1.5">
              {g.items.map((item) => (
                <li key={item.name}>
                  <button onClick={() => generate(item.name, item.run)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                      <FileText className="h-4 w-4 text-sky-600" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{item.name}</span>
                      <span className="block truncate text-xs font-medium text-slate-500">{item.desc}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-500" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {open && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex-1 text-[15px] font-extrabold">{title}</h2>
            {!loading && rows.length > 0 && (
              <>
                <button onClick={downloadCSV} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-[13px] font-bold hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5" aria-hidden /> Excel (CSV)
                </button>
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-[13px] font-bold hover:bg-slate-50">
                  <Printer className="h-3.5 w-3.5" aria-hidden /> Print / PDF
                </button>
              </>
            )}
          </div>
          {loading ? (
            <div className="mt-4"><TableSkeleton rows={5} cols={4} /></div>
          ) : rows.length === 0 ? (
            <div className="mt-4"><Empty title="No data for this report." /></div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <thead><tr className="bg-slate-50">
                  {cols.map((c) => <th key={c} className="px-4 py-2.5 font-extrabold tracking-wide text-slate-500 uppercase">{c}</th>)}
                </tr></thead>
                <tbody>
                  {rows.slice(0, 30).map((r, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      {r.map((c, j) => <td key={j} className={`px-4 py-2.5 ${j === 0 ? "font-bold" : "font-medium text-slate-600"}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-400">Showing {Math.min(30, rows.length)} of {rows.length} rows · {title}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
