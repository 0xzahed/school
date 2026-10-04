"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { PageHeader, Badge, Empty, Pagination } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { tk } from "@/data/sms";

const PAGE = 12;
const methods = ["All", "Cash", "Bank", "Mobile Banking", "Online Payment"];
const statuses = ["All", "Paid", "Pending", "Partial", "Refunded"];

export default function PaymentsPage() {
  const { payments, students, toast } = useAdmin();
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const nameOf = useCallback((id: string) => students.find((s) => s.id === id)?.name ?? id, [students]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return payments.filter(
      (p) =>
        (method === "All" || p.method === method) &&
        (status === "All" || p.status === status) &&
        (query === "" || `${p.id} ${p.invoice} ${nameOf(p.studentId)}`.toLowerCase().includes(query))
    );
  }, [payments, q, method, status, nameOf]);

  const slice = list.slice((page - 1) * PAGE, page * PAGE);
  const total = list.reduce((a, p) => a + p.amount, 0);

  const exportCSV = () => {
    const rows = [["ID", "Invoice", "Student", "Amount", "Method", "Date", "Status"], ...list.map((p) => [p.id, p.invoice, nameOf(p.studentId), p.amount, p.method, p.date, p.status])];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported ${list.length} payments.`);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Payments"
        sub={`${list.length} records · ${tk(total)} total`}
        action={
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
            <Download className="h-4 w-4" aria-hidden /> Export
          </button>
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search ID, invoice or student..." aria-label="Search payments"
            className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
        <div className="flex gap-2">
          <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} aria-label="Filter by method"
            className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
            {methods.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status"
            className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {slice.length === 0 ? <Empty title="No payments found." /> : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                <th className="px-5 py-3.5 font-extrabold">Payment</th><th className="px-3 py-3.5 font-extrabold">Invoice</th>
                <th className="px-3 py-3.5 font-extrabold">Student</th><th className="px-3 py-3.5 text-right font-extrabold">Amount</th>
                <th className="px-3 py-3.5 font-extrabold">Method</th><th className="px-3 py-3.5 font-extrabold">Date</th>
                <th className="px-5 py-3.5 font-extrabold">Status</th>
              </tr></thead>
              <tbody>
                {slice.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/40">
                    <td className="px-5 py-3 font-bold">{p.id}</td>
                    <td className="px-3 py-3 font-semibold text-sky-600">{p.invoice}</td>
                    <td className="px-3 py-3 font-semibold">{nameOf(p.studentId)}</td>
                    <td className="px-3 py-3 text-right font-extrabold">{tk(p.amount)}</td>
                    <td className="px-3 py-3 font-medium text-slate-600">{p.method}</td>
                    <td className="px-3 py-3 font-medium text-slate-600">{p.date}</td>
                    <td className="px-5 py-3"><Badge tone={p.status} dot>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE))} onPage={setPage} />
        </>
      )}
    </div>
  );
}
