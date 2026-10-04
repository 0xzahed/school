"use client";

import { Printer, Wallet } from "lucide-react";
import { PageHeader, Badge, Empty, Progress } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { tk } from "@/data/sms";

export default function StudentFees() {
  const { me, admin } = useMe();
  if (!me) return <Empty title="Loading fees..." />;

  const mine = admin.invoices.filter((v) => v.studentId === me.id);
  const total = mine.reduce((a, v) => a + v.amount, 0);
  const paid = mine.reduce((a, v) => a + v.paid, 0);
  const due = total - paid;
  const pct = total ? Math.round((paid / total) * 100) : 100;

  return (
    <div className="space-y-4">
      <PageHeader title="My Fees" sub="Receipts and dues for this session" />
      <div className="rounded-2xl bg-[#24324A] p-5 text-white sm:p-6">
        <p className="flex items-center gap-2 text-[13px] font-bold text-white/70"><Wallet className="h-4 w-4" aria-hidden /> Fee summary</p>
        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
          <p className="text-sm font-bold">Total <span className="block text-2xl font-extrabold">{tk(total)}</span></p>
          <p className="text-sm font-bold">Paid <span className="block text-2xl font-extrabold text-emerald-400">{tk(paid)}</span></p>
          <p className="text-sm font-bold">Due <span className="block text-2xl font-extrabold text-amber-400">{tk(due)}</span></p>
        </div>
        <div className="mt-3"><Progress value={pct} color="bg-emerald-400" /></div>
        {due > 0 && <p className="mt-2 text-[13px] font-semibold text-white/70">Please ask your guardian to pay {tk(due)} at the school office.</p>}
      </div>

      {mine.length === 0 ? <Empty title="No invoices yet." /> : (
        <ul className="space-y-2.5">
          {mine.map((v) => (
            <li key={v.no} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold">{v.no} · {v.head}</p>
                <p className="text-xs font-semibold text-slate-500">{v.date} · {v.method} · paid {tk(v.paid)} of {tk(v.amount)}</p>
              </div>
              <Badge tone={v.status} dot>{v.status}</Badge>
              <button onClick={() => window.print()} aria-label={`Print receipt ${v.no}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-extrabold hover:bg-slate-200">
                <Printer className="h-3.5 w-3.5" aria-hidden /> Receipt
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
