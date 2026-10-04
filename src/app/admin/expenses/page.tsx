"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Wallet, TrendingDown, Scale } from "lucide-react";
import { PageHeader, StatCard, Modal, Field, inputCls, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { tk, todayISO } from "@/data/sms";

export default function ExpensesPage() {
  const { expenses, invoices, addExpense, removeExpense, toast, log } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [form, setForm] = useState({ head: "", amount: "", note: "" });

  const totalExp = expenses.reduce((a, e) => a + e.amount, 0);
  const collected = invoices.reduce((a, v) => a + v.paid, 0);
  const byHead = useMemo(() => {
    const m = new Map<string, number>();
    expenses.forEach((e) => m.set(e.head, (m.get(e.head) ?? 0) + e.amount));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({ id: `EXP-${Date.now().toString().slice(-4)}`, head: form.head.trim(), amount: Number(form.amount) || 0, date: todayISO(), by: "Accounts", note: form.note.trim() });
    toast("Expense recorded.");
    log(`Recorded expense: ${form.head.trim()}`, "Finance");
    setAdding(false);
    setForm({ head: "", amount: "", note: "" });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Expenses"
        sub="Track where the money goes"
        action={
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#24324A] px-4 py-2.5 text-sm font-bold text-white">
            <Plus className="h-4 w-4" aria-hidden /> Add Expense
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Income" value={tk(collected)} compare="fees collected" bg="bg-emerald-400" />
        <StatCard icon={TrendingDown} label="Total Expenses" value={tk(totalExp)} compare={`${expenses.length} records`} bg="bg-red-400" />
        <StatCard icon={Scale} label="Net Balance" value={tk(collected - totalExp)} compare="income minus expenses" bg="bg-sky-400" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-[15px] font-extrabold">Spending by Head</h2>
          <ul className="mt-3 space-y-2.5">
            {byHead.map(([h, v]) => (
              <li key={h} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-bold">{h}</span>
                <span className="font-extrabold">{tk(v)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <h2 className="px-1 text-[15px] font-extrabold">All Expenses</h2>
          {expenses.length === 0 ? <div className="mt-3"><Empty title="No expenses recorded." /></div> : (
            <ul className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {expenses.map((x) => (
                <li key={x.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{x.head}</p>
                    <p className="text-xs font-semibold text-slate-500">{x.date} · {x.by}{x.note ? ` · ${x.note}` : ""}</p>
                  </div>
                  <span className="text-sm font-extrabold">{tk(x.amount)}</span>
                  <button onClick={() => setConfirmDel(x.id)} aria-label={`Delete ${x.head}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-100 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {adding && (
        <Modal title="Add Expense" onClose={() => setAdding(false)}>
          <form onSubmit={submit} className="space-y-3.5">
            <Field label="Expense head *"><input required value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} placeholder="e.g. Lab equipment" className={inputCls} /></Field>
            <Field label="Amount (৳) *"><input required type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} /></Field>
            <Field label="Note"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Optional" className={inputCls} /></Field>
            <button type="submit" className="w-full rounded-xl bg-[#24324A] px-4 py-3 text-sm font-bold text-white">Save Expense</button>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete expense?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">This expense record will be removed.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={() => { removeExpense(confirmDel); toast("Expense deleted.", "info"); setConfirmDel(null); }} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
