"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, Plus, Printer, Eye, Percent } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls, Empty, Pagination, Avatar } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { tk, feeHeads, todayISO, classList, type Invoice } from "@/data/sms";

const PAGE = 12;

export default function InvoicesPage() {
  const { invoices, students, toast, log } = useAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<Invoice | null>(null);
  const [discount, setDiscount] = useState("");
  const [form, setForm] = useState({ student: "", head: "Monthly Fee", amount: "1500" });

  const nameOf = useCallback((id: string) => students.find((s) => s.id === id)?.name ?? id, [students]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return invoices.filter(
      (v) => (status === "All" || v.status === status) &&
        (query === "" || `${v.no} ${nameOf(v.studentId)}`.toLowerCase().includes(query))
    );
  }, [invoices, q, status, nameOf]);

  const slice = list.slice((page - 1) * PAGE, page * PAGE);

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === form.student || s.name.toLowerCase() === form.student.toLowerCase());
    if (!st) {
      toast("Student not found. Use ID (ST-xxxxx) or exact name.", "error");
      return;
    }
    toast(`Invoice created for ${st.name}.`);
    log(`Created invoice for ${st.name} (${form.head})`, "Finance");
    setCreating(false);
  };

  const applyDiscount = () => {
    const pct = Math.min(100, Math.max(0, Number(discount) || 0));
    if (!viewing || pct <= 0) return;
    toast(`${pct}% discount noted on ${viewing.no}. Re-issue from fees desk to apply.`, "info");
    setDiscount("");
  };

  const invoiceDoc = (v: Invoice) => {
    const st = students.find((s) => s.id === v.studentId);
    return (
      <div className="rounded-2xl border-2 border-[#24324A] p-6 text-sm">
        <div className="flex items-center justify-between border-b-2 border-[#24324A] pb-4">
          <div>
            <p className="text-lg font-extrabold">Sunshine Valley School</p>
            <p className="text-xs font-semibold text-slate-500">12 Rainbow Road · (555) 123-4567</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold">INVOICE</p>
            <p className="text-xs font-bold text-slate-500">{v.no}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div><p className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Billed to</p>
            <p className="font-bold">{st?.name ?? v.studentId}</p>
            <p className="text-xs font-medium text-slate-500">{st ? `${st.class}-${st.section} · ${st.father}` : ""}</p></div>
          <div className="text-right"><p className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Date</p>
            <p className="font-bold">{v.date}</p>
            <p className="text-xs font-medium text-slate-500">{v.method}</p></div>
        </div>
        <table className="mt-4 w-full text-left">
          <thead><tr className="bg-slate-50 text-[11px] tracking-wider text-slate-500 uppercase">
            <th className="rounded-l-lg px-3 py-2 font-extrabold">Description</th>
            <th className="rounded-r-lg px-3 py-2 text-right font-extrabold">Amount</th></tr></thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="px-3 py-2.5 font-semibold">{v.head}</td><td className="px-3 py-2.5 text-right font-bold">{tk(v.amount)}</td></tr>
            <tr><td className="px-3 py-2.5 font-semibold">Paid</td><td className="px-3 py-2.5 text-right font-bold text-emerald-600">− {tk(v.paid)}</td></tr>
            <tr><td className="px-3 py-2.5 font-extrabold">Due</td><td className="px-3 py-2.5 text-right font-extrabold">{tk(v.amount - v.paid)}</td></tr>
          </tbody>
        </table>
        <div className="mt-3 flex items-center justify-between">
          <Badge tone={v.status} dot>{v.status}</Badge>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#24324A] px-4 py-2 text-xs font-bold text-white">
            <Printer className="h-3.5 w-3.5" aria-hidden /> Print / PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Invoices"
        sub={`${list.length} invoices · click the eye icon for a printable receipt`}
        action={
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#24324A] px-4 py-2.5 text-sm font-bold text-white">
            <Plus className="h-4 w-4" aria-hidden /> Create Invoice
          </button>
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search invoice no or student..." aria-label="Search invoices"
            className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status"
          className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
          {["All", "Paid", "Pending", "Partial", "Refunded"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {slice.length === 0 ? <Empty title="No invoices found." /> : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                <th className="px-5 py-3.5 font-extrabold">Invoice</th><th className="px-3 py-3.5 font-extrabold">Student</th>
                <th className="px-3 py-3.5 text-right font-extrabold">Amount</th><th className="px-3 py-3.5 text-right font-extrabold">Due</th>
                <th className="px-3 py-3.5 font-extrabold">Date</th><th className="px-3 py-3.5 font-extrabold">Status</th>
                <th className="px-5 py-3.5 text-right font-extrabold">Receipt</th>
              </tr></thead>
              <tbody>
                {slice.map((v) => (
                  <tr key={v.no} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/40">
                    <td className="px-5 py-3 font-extrabold text-sky-600">{v.no}</td>
                    <td className="px-3 py-3"><span className="flex items-center gap-2 font-semibold"><Avatar name={nameOf(v.studentId)} size="h-7 w-7 text-[10px]" />{nameOf(v.studentId)}</span></td>
                    <td className="px-3 py-3 text-right font-bold">{tk(v.amount)}</td>
                    <td className="px-3 py-3 text-right font-extrabold text-red-500">{tk(v.amount - v.paid)}</td>
                    <td className="px-3 py-3 font-medium text-slate-500">{v.date}</td>
                    <td className="px-3 py-3"><Badge tone={v.status} dot>{v.status}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => setViewing(v)} aria-label={`View receipt ${v.no}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100">
                        <Eye className="h-4 w-4" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE))} onPage={setPage} />
        </>
      )}

      {viewing && (
        <Modal title={`Receipt · ${viewing.no}`} onClose={() => { setViewing(null); setDiscount(""); }} wide>
          {invoiceDoc(viewing)}
          <div className="mt-4 flex gap-2">
            <input value={discount} onChange={(e) => setDiscount(e.target.value)} type="number" min={1} max={100} placeholder="Discount %" aria-label="Discount percent"
              className="w-32 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-400" />
            <button onClick={applyDiscount} className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
              <Percent className="h-4 w-4" aria-hidden /> Apply Discount
            </button>
          </div>
        </Modal>
      )}

      {creating && (
        <Modal title="Create Invoice" onClose={() => setCreating(false)}>
          <form onSubmit={submitCreate} className="space-y-3.5">
            <Field label="Student ID or exact name *">
              <input required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} placeholder="e.g. ST-10245" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fee head"><select value={form.head} onChange={(e) => {
                const h = feeHeads.find((x) => x.head === e.target.value);
                setForm({ ...form, head: e.target.value, amount: String(h?.amount ?? 500) });
              }} className={inputCls}>{feeHeads.map((f) => <option key={f.head}>{f.head}</option>)}</select></Field>
              <Field label="Amount (৳) *"><input required type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} /></Field>
            </div>
            <p className="text-xs font-semibold text-slate-500">Date: {todayISO()} · Classes: {classList.length} configured</p>
            <button type="submit" className="w-full rounded-xl bg-[#24324A] px-4 py-3 text-sm font-bold text-white">Create Invoice</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
