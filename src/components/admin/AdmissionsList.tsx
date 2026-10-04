"use client";

import { useMemo, useState } from "react";
import { Search, Check, Clock, XCircle, Eye, Phone, Mail, GraduationCap, FileText, UserCheck, UserX } from "lucide-react";
import { PageHeader, Avatar, Badge, Empty, Pagination, Modal, StatCard } from "@/components/admin/ui";
import { useAdmin, statusOfApp, type AppStatus } from "@/components/admin/store";
import { cn } from "@/lib/utils";
import type { Application } from "@/data/sms";

const PAGE = 8;

export default function AdmissionsList({ preset, title, sub }: { preset: "All" | AppStatus; title: string; sub: string }) {
  const { applications, appStatus, setAppStatus, toast, log } = useAdmin();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | AppStatus>(preset);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Application | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: applications.length, Pending: 0, "Under Review": 0, Approved: 0, Rejected: 0 };
    applications.forEach((a) => { c[statusOfApp(appStatus, a.id)]++; });
    return c;
  }, [applications, appStatus]);

  const list = useMemo(
    () =>
      applications.filter(
        (a) =>
          (filter === "All" || statusOfApp(appStatus, a.id) === filter) &&
          (q.trim() === "" || `${a.name} ${a.guardian} ${a.class}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [applications, appStatus, filter, q]
  );
  const slice = list.slice((page - 1) * PAGE, page * PAGE);

  const decide = (id: string, s: AppStatus, name: string) => {
    setAppStatus(id, s);
    if (s === "Approved") {
      toast(`${name} approved and enrolled.`);
      log(`Approved admission: ${name}`, "Admissions");
    } else if (s === "Rejected") {
      toast(`${name} rejected.`, "info");
      log(`Rejected admission: ${name}`, "Admissions");
    } else {
      toast(`${name} marked as ${s.toLowerCase()}.`, "info");
    }
    setDetail(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader title={title} sub={sub} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total Applications" value={String(counts.All)} bg="bg-sky-400" />
        <StatCard icon={Clock} label="Pending Review" value={String(counts.Pending + counts["Under Review"])} bg="bg-amber-400" />
        <StatCard icon={UserCheck} label="Approved" value={String(counts.Approved)} bg="bg-emerald-400" />
        <StatCard icon={UserX} label="Rejected" value={String(counts.Rejected)} bg="bg-red-400" />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter applications">
          {(["All", "Pending", "Under Review", "Approved", "Rejected"] as const).map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => { setFilter(f); setPage(1); }}
              className={cn("rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-all", filter === f ? "bg-[#24324A] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>
              {f} · {counts[f]}
            </button>
          ))}
        </div>
        <div className="relative lg:ml-auto lg:w-64">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search..." aria-label="Search applications"
            className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
      </div>

      {slice.length === 0 ? <Empty title="No applications here." sub="New website submissions land in Pending." /> : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                <th className="px-5 py-3.5 font-extrabold">Applicant</th><th className="px-3 py-3.5 font-extrabold">Applying Class</th>
                <th className="px-3 py-3.5 font-extrabold">Guardian</th><th className="px-3 py-3.5 font-extrabold">Phone</th>
                <th className="px-3 py-3.5 font-extrabold">Submitted</th><th className="px-3 py-3.5 font-extrabold">Status</th>
                <th className="px-5 py-3.5 text-right font-extrabold">Actions</th>
              </tr></thead>
              <tbody>
                {slice.map((a) => {
                  const st = statusOfApp(appStatus, a.id);
                  return (
                    <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/40">
                      <td className="px-5 py-3"><span className="flex items-center gap-2.5"><Avatar name={a.name} size="h-9 w-9 text-xs" /><span><span className="block font-bold">{a.name}</span><span className="block text-[11px] font-semibold text-slate-400">{a.id}</span></span></span></td>
                      <td className="px-3 py-3 font-semibold">{a.class}</td>
                      <td className="px-3 py-3 font-medium text-slate-600">{a.guardian}</td>
                      <td className="px-3 py-3 font-medium text-slate-600">{a.phone}</td>
                      <td className="px-3 py-3 font-medium text-slate-600">{a.date}</td>
                      <td className="px-3 py-3"><Badge tone={st} dot>{st}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setDetail(a)} aria-label={`View ${a.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100"><Eye className="h-3.5 w-3.5" aria-hidden /></button>
                          {(st === "Pending" || st === "Under Review") && (
                            <>
                              <button onClick={() => decide(a.id, "Approved", a.name)} aria-label={`Approve ${a.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"><Check className="h-3.5 w-3.5" aria-hidden /></button>
                              <button onClick={() => decide(a.id, "Rejected", a.name)} aria-label={`Reject ${a.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><XCircle className="h-3.5 w-3.5" aria-hidden /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE))} onPage={setPage} />
        </>
      )}

      {detail && (
        <Modal title="Application Details" onClose={() => setDetail(null)} wide>
          <div className="flex items-center gap-3.5">
            <Avatar name={detail.name} size="h-14 w-14 text-lg" />
            <div>
              <h3 className="text-lg font-extrabold">{detail.name}</h3>
              <p className="text-[13px] font-semibold text-slate-500">{detail.id} · Applied {detail.date}</p>
            </div>
            <span className="ml-auto"><Badge tone={statusOfApp(appStatus, detail.id)} dot>{statusOfApp(appStatus, detail.id)}</Badge></span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["Applying Class", detail.class], ["Guardian", detail.guardian],
              ["Phone", detail.phone], ["Email", detail.email],
              ["Previous School", detail.school], ["Documents", "Birth certificate · Photo (verified)"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <p className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">{k}</p>
                <p className="mt-0.5 font-bold">{k === "Phone" ? <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" aria-hidden />{v}</span> : k === "Email" ? <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" aria-hidden />{v}</span> : v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-sky-50 px-4 py-3 text-[13px] font-semibold text-sky-700">
            <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4" aria-hidden />Application history: Submitted → {statusOfApp(appStatus, detail.id)}</p>
          </div>
          {(statusOfApp(appStatus, detail.id) === "Pending" || statusOfApp(appStatus, detail.id) === "Under Review") && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => decide(detail.id, "Approved", detail.name)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600">
                <Check className="h-4 w-4" aria-hidden /> Approve
              </button>
              <button onClick={() => decide(detail.id, "Under Review", detail.name)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-100 px-4 py-3 text-sm font-bold text-sky-700 hover:bg-sky-200">
                <Clock className="h-4 w-4" aria-hidden /> Request Information
              </button>
              <button onClick={() => decide(detail.id, "Rejected", detail.name)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-200">
                <XCircle className="h-4 w-4" aria-hidden /> Reject
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
