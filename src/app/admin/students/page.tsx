"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Plus, Search, Upload, Download, Eye, Pencil, Trash2, MoreHorizontal, CheckSquare } from "lucide-react";
import { PageHeader, Avatar, Badge, Modal, Field, inputCls, Empty, Pagination, btnPrimary, btnGhost } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { classList, sections, type Student } from "@/data/sms";
import { cn } from "@/lib/utils";

const PAGE = 10;
const emptyForm = { name: "", class: "Class 1", section: "A", gender: "Female", guardian: "", phone: "" };

export default function StudentsPage() {
  const { students, addStudent, updateStudent, removeStudent, toast, log } = useAdmin();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("All");
  const [sec, setSec] = useState("All");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [confirmDel, setConfirmDel] = useState<Student | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return students.filter(
      (s) =>
        (cls === "All" || s.class === cls) &&
        (sec === "All" || s.section === sec) &&
        (gender === "All" || s.gender === gender) &&
        (status === "All" || s.status === status) &&
        (query === "" || `${s.name} ${s.id} ${s.phone}`.toLowerCase().includes(query))
    );
  }, [students, q, cls, sec, gender, status]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE));
  const slice = list.slice((page - 1) * PAGE, page * PAGE);
  const resetPage = () => setPage(1);

  const toggleSelect = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleAll = () =>
    setSelected((p) => (slice.every((s) => p.includes(s.id)) ? p.filter((id) => !slice.some((s) => s.id === id)) : [...new Set([...p, ...slice.map((s) => s.id)])]));

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const maxId = Math.max(...students.map((s) => Number(s.id.replace("ST-", ""))), 11447);
    addStudent({
      id: `ST-${maxId + 1}`, name: form.name.trim(), class: form.class, section: form.section,
      roll: students.filter((s) => s.class === form.class && s.section === form.section).length + 1,
      gender: form.gender as "Male" | "Female", dob: "2015-01-01", blood: "O+",
      address: "—", father: form.guardian.trim(), mother: "—", phone: form.phone.trim(),
      email: "", status: "Active", year: "2026",
    });
    toast("Student added successfully.");
    log(`Admitted new student ${form.name.trim()} to ${form.class}`, "Students");
    setAdding(false);
    setForm(emptyForm);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateStudent(editing.id, { name: form.name.trim(), class: form.class, section: form.section, gender: form.gender as "Male" | "Female", father: form.guardian.trim(), phone: form.phone.trim() });
    toast("Student updated successfully.");
    log(`Updated student profile (${editing.name})`, "Students");
    setEditing(null);
  };

  const startEdit = (s: Student) => {
    setForm({ name: s.name, class: s.class, section: s.section, gender: s.gender, guardian: s.father, phone: s.phone });
    setEditing(s);
    setMenuFor(null);
  };

  const doDelete = () => {
    if (!confirmDel) return;
    removeStudent(confirmDel.id);
    toast("Student deleted.", "info");
    log(`Deleted student ${confirmDel.name}`, "Students");
    setConfirmDel(null);
    setMenuFor(null);
  };

  const exportCSV = () => {
    const rows = [["ID", "Name", "Class", "Section", "Roll", "Gender", "Guardian", "Phone", "Status"], ...list.map((s) => [s.id, s.name, s.class, s.section, s.roll, s.gender, s.father, s.phone, s.status])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported ${list.length} students to CSV.`);
  };

  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split("\n").slice(1).filter((l) => l.trim());
      let n = 0;
      const maxBase = Math.max(...students.map((s) => Number(s.id.replace("ST-", ""))), 11447);
      lines.slice(0, 50).forEach((line, i) => {
        const cols = line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
        if (cols.length < 2 || !cols[0]) return;
        addStudent({
          id: `ST-${maxBase + i + 1}`, name: cols[0], class: cols[1] || "Class 1", section: cols[2] || "A",
          roll: i + 1, gender: (cols[3] === "Male" ? "Male" : "Female"), dob: "2015-01-01", blood: "O+",
          address: "—", father: cols[4] || "—", mother: "—", phone: cols[5] || "—", email: "",
          status: "Active", year: "2026",
        });
        n++;
      });
      toast(`Imported ${n} students from CSV.`);
      log(`Imported ${n} students from CSV`, "Students");
    };
    reader.readAsText(file);
  };

  const formFields = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2"><Field label="Full name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahim Ahmed" className={inputCls} /></Field></div>
      <Field label="Class"><select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className={inputCls}>{classList.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Section"><select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className={inputCls}>{sections.map((s) => <option key={s}>{s}</option>)}</select></Field>
      <Field label="Gender"><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputCls}><option>Female</option><option>Male</option></select></Field>
      <Field label="Guardian phone *"><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="017XXXXXXXX" className={inputCls} /></Field>
      <div className="sm:col-span-2"><Field label="Guardian name *"><input required value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} placeholder="e.g. Karim Ahmed" className={inputCls} /></Field></div>
    </div>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Students"
        sub={`${list.length.toLocaleString()} students found · ${students.length.toLocaleString()} total enrolled`}
        action={
          <>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" aria-label="Import CSV file"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) importCSV(f); e.target.value = ""; }} />
            <button onClick={() => fileRef.current?.click()} className={btnGhost}><Upload className="h-4 w-4" aria-hidden /> Import</button>
            <button onClick={exportCSV} className={btnGhost}><Download className="h-4 w-4" aria-hidden /> Export</button>
            <button onClick={() => { setForm(emptyForm); setAdding(true); }} className={btnPrimary}><Plus className="h-4 w-4" aria-hidden /> Add Student</button>
          </>
        }
      />

      {/* search + filters */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); resetPage(); }} placeholder="Search by name, ID or phone..." aria-label="Search students"
            className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { v: cls, set: (x: string) => { setCls(x); resetPage(); }, opts: ["All", ...classList], label: "Class" },
            { v: sec, set: (x: string) => { setSec(x); resetPage(); }, opts: ["All", ...sections], label: "Section" },
            { v: gender, set: (x: string) => { setGender(x); resetPage(); }, opts: ["All", "Male", "Female"], label: "Gender" },
            { v: status, set: (x: string) => { setStatus(x); resetPage(); }, opts: ["All", "Active", "Inactive"], label: "Status" },
          ].map((f) => (
            <select key={f.label} value={f.v} onChange={(e) => f.set(e.target.value)} aria-label={`Filter by ${f.label}`} className="rounded-xl border border-[#E2E8F0] px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
              <option value="All">{f.label}: All</option>
              {f.opts.filter((o) => o !== "All").map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
        {selected.length > 0 && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 px-3.5 py-2.5 text-[13px] font-bold text-sky-700" role="status">
            <CheckSquare className="h-4 w-4" aria-hidden /> {selected.length} selected
            <button onClick={() => setSelected([])} className="ml-auto underline">Clear</button>
          </p>
        )}
      </div>

      {slice.length === 0 ? (
        <Empty title="No students found." sub="Try a different search or filter." />
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white md:block">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
                  <th className="px-4 py-3.5 pl-5"><input type="checkbox" checked={slice.length > 0 && slice.every((s) => selected.includes(s.id))} onChange={toggleAll} aria-label="Select all on page" className="h-4 w-4 rounded accent-sky-500" /></th>
                  <th className="px-3 py-3.5 font-extrabold">Student</th>
                  <th className="px-3 py-3.5 font-extrabold">ID</th>
                  <th className="px-3 py-3.5 font-extrabold">Class</th>
                  <th className="px-3 py-3.5 font-extrabold">Guardian</th>
                  <th className="px-3 py-3.5 font-extrabold">Phone</th>
                  <th className="px-3 py-3.5 font-extrabold">Status</th>
                  <th className="px-4 py-3.5 pr-5 text-right font-extrabold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-sky-50/40">
                    <td className="px-4 py-3 pl-5"><input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} aria-label={`Select ${s.name}`} className="h-4 w-4 rounded accent-sky-500" /></td>
                    <td className="px-3 py-3"><Link href={`/admin/students/${s.id}`} className="flex items-center gap-2.5"><Avatar name={s.name} size="h-9 w-9 text-xs" /><span className="font-bold text-[#24324A] hover:text-sky-600">{s.name}</span></Link></td>
                    <td className="px-3 py-3 font-semibold text-slate-500">{s.id}</td>
                    <td className="px-3 py-3 font-semibold">{s.class} · {s.section}</td>
                    <td className="px-3 py-3 font-medium text-slate-600">{s.father}</td>
                    <td className="px-3 py-3 font-medium text-slate-600">{s.phone}</td>
                    <td className="px-3 py-3"><Badge tone={s.status} dot>{s.status}</Badge></td>
                    <td className="px-4 py-3 pr-5">
                      <div className="relative flex justify-end">
                        <button onClick={() => setMenuFor(menuFor === s.id ? null : s.id)} aria-label={`Actions for ${s.name}`} aria-expanded={menuFor === s.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" aria-hidden />
                        </button>
                        {menuFor === s.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} aria-hidden />
                            <div className="absolute top-9 right-0 z-20 w-40 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl">
                              <Link href={`/admin/students/${s.id}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold hover:bg-slate-50"><Eye className="h-3.5 w-3.5" aria-hidden />View</Link>
                              <button onClick={() => startEdit(s)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" aria-hidden />Edit</button>
                              <button onClick={() => { setConfirmDel(s); setMenuFor(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" aria-hidden />Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="grid gap-3 md:hidden">
            {slice.map((s) => (
              <article key={s.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/students/${s.id}`} className="block truncate text-[15px] font-bold">{s.name}</Link>
                    <p className="text-xs font-semibold text-slate-500">ID: {s.id}</p>
                  </div>
                  <Badge tone={s.status} dot>{s.status}</Badge>
                </div>
                <p className="mt-2.5 text-[13px] font-semibold text-slate-600">{s.class} · Section {s.section} · Roll {s.roll}</p>
                <p className="text-[13px] font-medium text-slate-500">Guardian: {s.father} · {s.phone}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/admin/students/${s.id}`} className="flex-1 rounded-xl bg-slate-100 py-2 text-center text-[13px] font-bold">View</Link>
                  <button onClick={() => startEdit(s)} className="flex-1 rounded-xl bg-slate-100 py-2 text-[13px] font-bold">Edit</button>
                </div>
              </article>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </>
      )}

      {(adding || editing) && (
        <Modal title={adding ? "Add Student" : `Edit ${editing?.name}`} onClose={() => { setAdding(false); setEditing(null); }}>
          <form onSubmit={adding ? submitAdd : submitEdit} className="space-y-4">
            {formFields}
            <button type="submit" className={cn(btnPrimary, "w-full py-3")}>{adding ? "Add Student" : "Save Changes"}</button>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete student?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">Are you sure you want to delete <strong className="text-[#24324A]">{confirmDel.name}</strong> ({confirmDel.id})? All linked records will be hidden. This cannot be undone.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className={cn(btnGhost, "flex-1")}>Cancel</button>
            <button onClick={doDelete} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600">Delete Student</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
