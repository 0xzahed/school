"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader, Badge, Empty, Pagination } from "@/components/admin/ui";
import { subjectRows, classList } from "@/data/sms";

const PAGE = 12;

export default function SubjectsPage() {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("All");
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return subjectRows.filter(
      (r) => (cls === "All" || r.class === cls) && (query === "" || `${r.name} ${r.code} ${r.teacher}`.toLowerCase().includes(query))
    );
  }, [q, cls]);

  const slice = list.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="space-y-4">
      <PageHeader title="Subjects" sub={`${list.length} subject assignments across ${classList.length} classes`} />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search subject, code or teacher..." aria-label="Search subjects"
            className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
        <select value={cls} onChange={(e) => { setCls(e.target.value); setPage(1); }} aria-label="Filter by class"
          className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
          <option>All</option>
          {classList.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {slice.length === 0 ? <Empty title="No subjects found." /> : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {slice.map((r, i) => (
              <article key={`${r.code}-${r.class}-${i}`} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-[15px] font-extrabold">{r.name}</h2>
                    <p className="text-xs font-bold text-slate-500">{r.code} · {r.class}</p>
                  </div>
                  <Badge tone={r.status} dot>{r.status}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-[13px]">
                  <span className="font-semibold text-slate-500">Teacher</span>
                  <span className="font-bold">{r.teacher}</span>
                </div>
                <p className="mt-2 text-right text-xs font-bold text-slate-400">{r.credit} credits</p>
              </article>
            ))}
          </div>
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE))} onPage={setPage} />
        </>
      )}
    </div>
  );
}
