"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Download, Pencil, Trash2 } from "lucide-react";
import { PageHeader, Avatar, Badge, Modal, Field, inputCls, Empty, Pagination, btnPrimary, btnGhost } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { type Teacher } from "@/data/sms";

const PAGE = 12;

export default function TeachersPage() {
  const { teachers, addTeacher, updateTeacher, removeTeacher, toast, log } = useAdmin();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [confirmDel, setConfirmDel] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", subject: "Mathematics", department: "Mathematics", phone: "", email: "" });

  const depts = useMemo(() => ["All", ...Array.from(new Set(teachers.map((t) => t.department)))], [teachers]);
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return teachers.filter(
      (t) => (dept === "All" || t.department === dept) &&
        (query === "" || `${t.name} ${t.id} ${t.subject}`.toLowerCase().includes(query))
    );
  }, [teachers, q, dept]);

  const slice = list.slice((page - 1) * PAGE, page * PAGE);

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacher({
      id: `EMP-${1087 + teachers.length}`, name: form.name.trim(), department: form.department,
      subject: form.subject, phone: form.phone.trim() || "01800000000",
      email: form.email.trim() || "teacher@school.edu", joining: new Date().toISOString().slice(0, 10),
      salary: 28000, classes: "Class 1", status: "Active",
    });
    toast("Teacher added successfully.");
    log(`Added teacher ${form.name.trim()}`, "Teachers");
    setAdding(false);
    setForm({ name: "", subject: "Mathematics", department: "Mathematics", phone: "", email: "" });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateTeacher(editing.id, { name: form.name.trim(), subject: form.subject, department: form.department, phone: form.phone.trim(), email: form.email.trim() });
    toast("Teacher updated successfully.");
    setEditing(null);
  };

  const startEdit = (t: Teacher) => {
    setForm({ name: t.name, subject: t.subject, department: t.department, phone: t.phone, email: t.email });
    setEditing(t);
  };

  const exportCSV = () => {
    const rows = [["ID", "Name", "Department", "Subject", "Phone", "Joining", "Status"], ...list.map((t) => [t.id, t.name, t.department, t.subject, t.phone, t.joining, t.status])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "teachers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported ${list.length} teachers to CSV.`);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teachers"
        sub={`${list.length} staff found · ${teachers.length} total`}
        action={
          <>
            <button onClick={exportCSV} className={btnGhost}><Download className="h-4 w-4" aria-hidden /> Export</button>
            <button onClick={() => setAdding(true)} className={btnPrimary}><Plus className="h-4 w-4" aria-hidden /> Add Teacher</button>
          </>
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name, ID or subject..." aria-label="Search teachers"
            className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
        <select value={dept} onChange={(e) => { setDept(e.target.value); setPage(1); }} aria-label="Filter by department"
          className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
          {depts.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {slice.length === 0 ? <Empty title="No teachers found." /> : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                <th className="px-5 py-3.5 font-extrabold">Teacher</th><th className="px-3 py-3.5 font-extrabold">Employee ID</th>
                <th className="px-3 py-3.5 font-extrabold">Department</th><th className="px-3 py-3.5 font-extrabold">Subject</th>
                <th className="px-3 py-3.5 font-extrabold">Phone</th><th className="px-3 py-3.5 font-extrabold">Joining</th>
                <th className="px-3 py-3.5 font-extrabold">Status</th><th className="px-5 py-3.5 text-right font-extrabold">Actions</th>
              </tr></thead>
              <tbody>
                {slice.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/40">
                    <td className="px-5 py-3"><Link href={`/admin/teachers/${t.id}`} className="flex items-center gap-2.5"><Avatar name={t.name} size="h-9 w-9 text-xs" /><span className="font-bold hover:text-sky-600">{t.name}</span></Link></td>
                    <td className="px-3 py-3 font-semibold text-slate-500">{t.id}</td>
                    <td className="px-3 py-3 font-semibold">{t.department}</td>
                    <td className="px-3 py-3"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11.5px] font-bold text-violet-600">{t.subject}</span></td>
                    <td className="px-3 py-3 font-medium text-slate-600">{t.phone}</td>
                    <td className="px-3 py-3 font-medium text-slate-600">{t.joining}</td>
                    <td className="px-3 py-3"><Badge tone={t.status} dot>{t.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => startEdit(t)} aria-label={`Edit ${t.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100"><Pencil className="h-3.5 w-3.5" aria-hidden /></button>
                        <button onClick={() => setConfirmDel(t)} aria-label={`Delete ${t.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" aria-hidden /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE))} onPage={setPage} />
        </>
      )}

      {(adding || editing) && (
        <Modal title={adding ? "Add Teacher" : `Edit ${editing?.name}`} onClose={() => { setAdding(false); setEditing(null); }}>
          <form onSubmit={adding ? submitAdd : submitEdit} className="space-y-3.5">
            <Field label="Full name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahim Khan" className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Subject"><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls}>
                {["Bangla", "English", "Mathematics", "Science", "ICT", "Social Science", "Religion", "Physical Education", "Art"].map((s) => <option key={s}>{s}</option>)}
              </select></Field>
              <Field label="Department"><select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputCls}>
                {["Science", "Mathematics", "Language", "ICT", "Arts", "Sports"].map((d) => <option key={d}>{d}</option>)}
              </select></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="018XXXXXXXX" className={inputCls} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@school.edu" className={inputCls} /></Field>
            </div>
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">{adding ? "Add Teacher" : "Save Changes"}</button>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete teacher?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">Are you sure you want to remove <strong className="text-[#24324A]">{confirmDel.name}</strong>? This cannot be undone.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={() => { removeTeacher(confirmDel.id); toast("Teacher deleted.", "info"); setConfirmDel(null); }} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
