"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Wallet, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, StatCard, Modal, Field, inputCls, Badge, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { tk, feeHeads, todayISO, type Expense } from "@/data/sms";

export default function FeesPage() {
  const { invoices, payments, expenses, recordPayment, addExpense, toast, log, students } = useAdmin();
  const [payFor, setPayFor] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [addingExp, setAddingExp] = useState(false);
  const [expForm, setExpForm] = useState({ head: "", amount: "", note: "" });

  const collected = invoices.reduce((a, v) => a + v.paid, 0);
  const due = invoices.reduce((a, v) => a + (v.amount - v.paid), 0);
  const overdue = invoices.filter((v) => v.status === "Pending").length;
  const totalExp = expenses.reduce((a, e) => a + e.amount, 0);

  const recent = useMemo(() => payments.slice(0, 6), [payments]);
  const nameOf = (id: string) => students.find((s) => s.id === id)?.name ?? id;

  const submitPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payFor) return;
    const v = invoices.find((x) => x.no === payFor);
    if (!v) return;
    const amt = Math.min(Number(amount) || 0, v.amount - v.paid);
    if (amt <= 0) {
      toast("Enter a valid amount.", "error");
      return;
    }
    recordPayment(payFor, amt, method, todayISO());
    toast(`Payment of ${tk(amt)} recorded for ${payFor}.`);
    log(`Recorded fee payment ${payFor} (${tk(amt)})`, "Finance");
    setPayFor(null);
    setAmount("");
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const ex: Expense = { id: `EXP-${Date.now().toString().slice(-4)}`, head: expForm.head.trim(), amount: Number(expForm.amount) || 0, date: todayISO(), by: "Accounts", note: expForm.note.trim() };
    addExpense(ex);
    toast("Expense recorded.");
    log(`Recorded expense: ${ex.head} (${tk(ex.amount)})`, "Finance");
    setAddingExp(false);
    setExpForm({ head: "", amount: "", note: "" });
  };

  const paying = payFor ? invoices.find((v) => v.no === payFor) : null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fees"
        sub="Collection overview · record payments and expenses"
        action={
          <>
            <button onClick={() => setAddingExp(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
              <Plus className="h-4 w-4" aria-hidden /> Add Expense
            </button>
            <Link href="/admin/invoices" className="inline-flex items-center gap-2 rounded-xl bg-[#24324A] px-4 py-2.5 text-sm font-bold text-white">
              <Plus className="h-4 w-4" aria-hidden /> Create Invoice
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Collection" value={tk(collected)} trend="+12.4%" compare="this session" bg="bg-emerald-400" />
        <StatCard icon={AlertCircle} label="Pending Fees" value={tk(due)} compare={`${overdue} unpaid invoices`} bg="bg-amber-400" />
        <StatCard icon={Clock} label="Overdue" value={String(overdue)} compare="needs follow-up" bg="bg-red-400" />
        <StatCard icon={CheckCircle2} label="This Month" value={tk(845000)} trend="+12.4%" compare="June 2026" bg="bg-sky-400" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-[15px] font-extrabold">Fee Categories</h2>
          <ul className="mt-3 space-y-2.5">
            {feeHeads.map((f) => {
              const got = invoices.filter((v) => v.head === f.head).reduce((a, v) => a + v.paid, 0);
              return (
                <li key={f.head} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="min-w-0 flex-1 text-sm font-bold">{f.head}<span className="block text-xs font-semibold text-slate-500">{tk(f.amount)} per invoice</span></span>
                  <span className="text-sm font-extrabold text-emerald-600">{tk(got)}</span>
                  <span className="text-xs font-bold text-slate-400">collected</span>
                </li>
              );
            })}
            <li className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3">
              <span className="flex-1 text-sm font-bold text-red-600">Total expenses<span className="block text-xs font-semibold text-red-400">{expenses.length} records</span></span>
              <span className="text-sm font-extrabold text-red-600">{tk(totalExp)}</span>
            </li>
          </ul>
          <Link href="/admin/expenses" className="mt-3 block text-[13px] font-bold text-sky-600 hover:underline">Manage all expenses →</Link>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold">Recent Payments</h2>
            <Link href="/admin/payments" className="text-[13px] font-bold text-sky-600 hover:underline">View all</Link>
          </div>
          <ul className="mt-3 space-y-2.5">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{nameOf(p.studentId)} <span className="font-semibold text-slate-400">· {p.invoice}</span></p>
                  <p className="text-xs font-semibold text-slate-500">{p.method} · {p.date}</p>
                </div>
                <span className="text-sm font-extrabold">{tk(p.amount)}</span>
                <Badge tone={p.status}>{p.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="text-[15px] font-extrabold">Largest Dues · Record a payment</h2>
        <ul className="mt-3 grid gap-2.5 md:grid-cols-2">
          {invoices.filter((v) => v.amount - v.paid > 0).slice(0, 6).map((v) => (
            <li key={v.no} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{nameOf(v.studentId)}</p>
                <p className="text-xs font-semibold text-slate-500">{v.no} · {v.head} · due {tk(v.amount - v.paid)}</p>
              </div>
              <button onClick={() => { setPayFor(v.no); setAmount(String(v.amount - v.paid)); }} className="shrink-0 rounded-xl bg-[#24324A] px-3.5 py-2 text-xs font-bold text-white">
                Record
              </button>
            </li>
          ))}
          {invoices.every((v) => v.amount - v.paid <= 0) && <Empty title="No dues. Everything is collected!" />}
        </ul>
      </div>

      {paying && (
        <Modal title={`Record Payment · ${paying.no}`} onClose={() => setPayFor(null)}>
          <form onSubmit={submitPay} className="space-y-4">
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              {nameOf(paying.studentId)} · Total {tk(paying.amount)} · Paid {tk(paying.paid)} · <strong className="text-[#24324A]">Due {tk(paying.amount - paying.paid)}</strong>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount (৳) *"><input required type="number" min={1} max={paying.amount - paying.paid} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} /></Field>
              <Field label="Method"><select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
                <option>Cash</option><option>Bank</option><option>Mobile Banking</option><option>Online Payment</option>
              </select></Field>
            </div>
            <button type="submit" className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600">
              Confirm Payment
            </button>
          </form>
        </Modal>
      )}

      {addingExp && (
        <Modal title="Add Expense" onClose={() => setAddingExp(false)}>
          <form onSubmit={submitExpense} className="space-y-3.5">
            <Field label="Expense head *"><input required value={expForm.head} onChange={(e) => setExpForm({ ...expForm, head: e.target.value })} placeholder="e.g. Lab equipment" className={inputCls} /></Field>
            <Field label="Amount (৳) *"><input required type="number" min={1} value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })} className={inputCls} /></Field>
            <Field label="Note"><input value={expForm.note} onChange={(e) => setExpForm({ ...expForm, note: e.target.value })} placeholder="Optional note" className={inputCls} /></Field>
            <button type="submit" className="w-full rounded-xl bg-[#24324A] px-4 py-3 text-sm font-bold text-white">Save Expense</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
