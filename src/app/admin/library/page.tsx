"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Undo2, BookOpen, BookCopy, CircleCheck, AlarmClock } from "lucide-react";
import { PageHeader, StatCard, Badge, Modal, Field, inputCls, Empty, Pagination, Tabs, Avatar, btnPrimary } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { todayISO } from "@/data/sms";

const PAGE = 10;

export default function LibraryPage() {
  const { books, loans, students, issueBook, returnBook, toast, log } = useAdmin();
  const [tab, setTab] = useState("Books");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);
  const [issuing, setIssuing] = useState<string | null>(null);
  const [form, setForm] = useState({ studentId: "", due: todayISO() });

  const issued = loans.filter((l) => !l.returned).length;
  const overdue = loans.filter((l) => !l.returned && l.due < todayISO()).length;
  const cats = useMemo(() => ["All", ...Array.from(new Set(books.map((b) => b.category)))], [books]);

  const bookList = useMemo(() => {
    const query = q.trim().toLowerCase();
    return books.filter(
      (b) => (cat === "All" || b.category === cat) &&
        (query === "" || `${b.title} ${b.author} ${b.id} ${b.isbn}`.toLowerCase().includes(query))
    );
  }, [books, q, cat]);
  const slice = bookList.slice((page - 1) * PAGE, page * PAGE);

  const activeLoans = useMemo(() => loans.filter((l) => !l.returned).slice(0, 40), [loans]);
  const history = useMemo(() => loans.filter((l) => l.returned).slice(0, 20), [loans]);

  const submitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuing || !form.studentId) return;
    const st = students.find((s) => s.id === form.studentId || s.name.toLowerCase() === form.studentId.toLowerCase());
    if (!st) {
      toast("Student not found. Use ID (ST-xxxxx) or exact name.", "error");
      return;
    }
    issueBook(issuing, st.id, form.due);
    toast(`Book issued to ${st.name}.`);
    log(`Issued book to ${st.name}`, "Library");
    setIssuing(null);
    setForm({ studentId: "", due: todayISO() });
  };

  const loanRow = (l: (typeof loans)[number], showReturn: boolean) => {
    const b = books.find((x) => x.id === l.bookId);
    const s = students.find((x) => x.id === l.studentId);
    const late = !l.returned && l.due < todayISO();
    return (
      <li key={l.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3">
        <Avatar name={s?.name ?? "?"} size="h-9 w-9 text-xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{b?.title ?? l.bookId}</p>
          <p className="text-xs font-semibold text-slate-500">{s?.name ?? l.studentId} · due {l.due}</p>
        </div>
        {late ? <Badge tone="Overdue" dot>Overdue</Badge> : l.returned ? <Badge tone="Completed">Returned</Badge> : <Badge tone="Upcoming">Issued</Badge>}
        {showReturn && !l.returned && (
          <button onClick={() => { returnBook(l.id); toast("Book returned to shelf."); }} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-600 hover:bg-emerald-100">
            <Undo2 className="h-3.5 w-3.5" aria-hidden /> Return
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Library" sub="Catalog, issue & returns" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Total Books" value={books.reduce((a, b) => a + b.qty, 0).toLocaleString()} compare={`${books.length} titles`} bg="bg-sky-400" />
        <StatCard icon={BookCopy} label="Issued Books" value={String(issued)} compare="currently out" bg="bg-violet-400" />
        <StatCard icon={CircleCheck} label="Available" value={books.reduce((a, b) => a + b.available, 0).toLocaleString()} compare="copies on shelf" bg="bg-emerald-400" />
        <StatCard icon={AlarmClock} label="Overdue" value={String(overdue)} compare="needs follow-up" bg="bg-red-400" />
      </div>

      <Tabs tabs={["Books", "Issued", "History"]} active={tab} onChange={setTab} />

      {tab === "Books" && (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search title, author, ISBN..." aria-label="Search books"
                className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
            </div>
            <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} aria-label="Filter by category"
              className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {slice.length === 0 ? <Empty title="No books found." /> : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                    <th className="px-5 py-3.5 font-extrabold">Book</th><th className="px-3 py-3.5 font-extrabold">Author</th>
                    <th className="px-3 py-3.5 font-extrabold">ISBN</th><th className="px-3 py-3.5 font-extrabold">Category</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Available</th><th className="px-5 py-3.5 text-right font-extrabold">Action</th>
                  </tr></thead>
                  <tbody>
                    {slice.map((b) => (
                      <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/40">
                        <td className="px-5 py-3"><p className="font-bold">{b.title}</p><p className="text-[11px] font-semibold text-slate-400">{b.id}</p></td>
                        <td className="px-3 py-3 font-medium text-slate-600">{b.author}</td>
                        <td className="px-3 py-3 font-medium text-slate-500">{b.isbn}</td>
                        <td className="px-3 py-3"><Badge tone="Upcoming">{b.category}</Badge></td>
                        <td className="px-3 py-3 text-center font-extrabold">{b.available}/{b.qty}</td>
                        <td className="px-5 py-3 text-right">
                          <button disabled={b.available === 0} onClick={() => setIssuing(b.id)}
                            className={btnPrimary + " px-3.5 py-2 text-xs disabled:opacity-40"}>
                            <Plus className="h-3.5 w-3.5" aria-hidden /> Issue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={Math.max(1, Math.ceil(bookList.length / PAGE))} onPage={setPage} />
            </>
          )}
        </>
      )}

      {tab === "Issued" && (
        <ul className="space-y-2.5">
          {activeLoans.length === 0 && <Empty title="Nothing issued right now." />}
          {activeLoans.map((l) => loanRow(l, true))}
        </ul>
      )}

      {tab === "History" && (
        <ul className="space-y-2.5">
          {history.length === 0 && <Empty title="No return history yet." />}
          {history.map((l) => loanRow(l, false))}
        </ul>
      )}

      {issuing && (
        <Modal title="Issue Book" onClose={() => setIssuing(null)}>
          <form onSubmit={submitIssue} className="space-y-4">
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold">{books.find((b) => b.id === issuing)?.title}</p>
            <Field label="Student ID or exact name *">
              <input required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="e.g. ST-10245" className={inputCls} />
            </Field>
            <Field label="Return due date *">
              <input required type="date" value={form.due} min={todayISO()} onChange={(e) => setForm({ ...form, due: e.target.value })} className={inputCls} />
            </Field>
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">Confirm Issue</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
