"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Pin } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { todayISO, type Notice } from "@/data/sms";
import { cn } from "@/lib/utils";

const cats = ["Admissions", "Exams", "Holiday", "Parents", "Sports", "General"];
const audiences = ["Everyone", "Students", "Parents", "Teachers", "Specific Class"];
const statuses = ["Published", "Draft", "Scheduled"];

export default function NoticesPage() {
  const { noticeList, addNotice, updateNotice, removeNotice, toast, log } = useAdmin();
  const [filter, setFilter] = useState("All");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "General", description: "", audience: "Everyone", status: "Published", expiry: "" });

  const list = useMemo(() => {
    const sorted = [...noticeList].sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));
    return filter === "All" ? sorted : sorted.filter((n) => n.status === filter);
  }, [noticeList, filter]);

  const openAdd = () => {
    setForm({ title: "", category: "General", description: "", audience: "Everyone", status: "Published", expiry: "" });
    setAdding(true);
  };
  const openEdit = (n: Notice) => {
    setForm({ title: n.title, category: n.category, description: n.description, audience: n.audience, status: n.status, expiry: n.expiry });
    setEditing(n);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({
      id: `N-${Date.now()}`, title: form.title.trim(), category: form.category, description: form.description.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      expiry: form.expiry || "—", audience: form.audience, status: form.status as Notice["status"], pinned: false,
    });
    toast(`Notice ${form.status === "Draft" ? "saved as draft" : form.status === "Scheduled" ? "scheduled" : "published"}.`);
    log(`${form.status} notice: ${form.title.trim()}`, "Notices");
    setAdding(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateNotice(editing.id, { title: form.title.trim(), category: form.category, description: form.description.trim(), audience: form.audience, status: form.status as Notice["status"], expiry: form.expiry || editing.expiry });
    toast("Notice updated.");
    setEditing(null);
  };

  const formFields = (
    <>
      <Field label="Title *"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Winter Concert on Dec 22" className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Audience"><select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className={inputCls}>{audiences.map((a) => <option key={a}>{a}</option>)}</select></Field>
      </div>
      <Field label="Description *"><textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Details..." className={cn(inputCls, "resize-none")} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Expiry date"><input type="date" value={form.expiry} min={todayISO()} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className={inputCls} /></Field>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notices"
        sub={`${noticeList.length} notices · pinned float to top`}
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> Create Notice
          </button>
        }
      />

      <div className="flex gap-1.5 rounded-2xl border border-[#E2E8F0] bg-white p-1.5" role="tablist" aria-label="Filter by status">
        {["All", ...statuses].map((s) => (
          <button key={s} role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}
            className={cn("rounded-xl px-4 py-2 text-[13px] font-bold", filter === s ? "bg-[#24324A] text-white" : "text-slate-500 hover:bg-slate-100")}>
            {s}
          </button>
        ))}
      </div>

      {list.length === 0 ? <Empty title="No notices here." /> : (
        <div className="space-y-2.5">
          {list.map((n) => (
            <article key={n.id} className={cn("flex gap-4 rounded-2xl border bg-white p-4 sm:p-5", n.pinned ? "border-amber-300" : "border-[#E2E8F0]")}>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[11.5px] font-extrabold">
                  <Badge tone="Active">{n.category}</Badge>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{n.audience}</span>
                  <Badge tone={n.status}>{n.status}</Badge>
                  {n.pinned && <Badge tone="Pending">Pinned</Badge>}
                  <span className="font-semibold text-slate-400">{n.date} · expires {n.expiry}</span>
                </p>
                <h2 className="mt-1.5 text-[15.5px] font-extrabold">{n.title}</h2>
                <p className="mt-1 line-clamp-2 text-[13px] text-slate-500">{n.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button onClick={() => updateNotice(n.id, { pinned: !n.pinned })} aria-label={n.pinned ? "Unpin" : "Pin"} aria-pressed={!!n.pinned}
                  className={cn("flex h-8 w-8 items-center justify-center rounded-lg", n.pinned ? "bg-amber-100 text-amber-600" : "hover:bg-slate-100 hover:text-amber-500")}>
                  <Pin className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button onClick={() => openEdit(n)} aria-label={`Edit ${n.title}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100">
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button onClick={() => setConfirmDel(n.id)} aria-label={`Delete ${n.title}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <Modal title={adding ? "Create Notice" : "Edit Notice"} onClose={() => { setAdding(false); setEditing(null); }}>
          <form onSubmit={adding ? submitAdd : submitEdit} className="space-y-3.5">
            {formFields}
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">
              {adding ? (form.status === "Draft" ? "Save Draft" : form.status === "Scheduled" ? "Schedule Notice" : "Publish Notice") : "Save Changes"}
            </button>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete notice?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">This notice will be removed for all audiences.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={() => { removeNotice(confirmDel); toast("Notice deleted.", "info"); setConfirmDel(null); }} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
