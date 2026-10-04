"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { todayISO, type SchoolEvent } from "@/data/sms";

const cats = ["Academic", "Sports", "Cultural", "Holiday", "Other"];

export default function EventsPage() {
  const { eventList, addEvent, updateEvent, removeEvent, toast, log } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<SchoolEvent | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", date: todayISO(), start: "09:00", end: "12:00", location: "", category: "Academic", status: "Draft" });

  const openAdd = () => {
    setForm({ name: "", description: "", date: todayISO(), start: "09:00", end: "12:00", location: "", category: "Academic", status: "Draft" });
    setAdding(true);
  };
  const openEdit = (e: SchoolEvent) => {
    setForm({ name: e.name, description: e.description, date: e.date, start: e.start, end: e.end, location: e.location, category: e.category, status: e.status });
    setEditing(e);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({ id: `E-${Date.now()}`, ...form, status: form.status as SchoolEvent["status"] });
    toast(form.status === "Published" ? "Event published." : "Event saved as draft.");
    log(`${form.status} event: ${form.name}`, "Events");
    setAdding(false);
  };
  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateEvent(editing.id, { ...form, status: form.status as SchoolEvent["status"] });
    toast("Event updated.");
    setEditing(null);
  };

  const fields = (
    <>
      <Field label="Event name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Annual Sports Day" className={inputCls} /></Field>
      <Field label="Description *"><textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will happen?" className={`${inputCls} resize-none`} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Date *"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></Field>
        <Field label="Start"><input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={inputCls} /></Field>
        <Field label="End"><input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location *"><input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. School Playground" className={inputCls} /></Field>
        <Field label="Category"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}><option>Draft</option><option>Published</option></select></Field>
    </>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Events"
        sub={`${eventList.length} events · drafts stay hidden until published`}
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> Create Event
          </button>
        }
      />

      {eventList.length === 0 ? <Empty title="No events yet." /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {eventList.map((e) => (
            <article key={e.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-extrabold tracking-wider text-sky-600 uppercase">{e.category} · {e.date}</p>
                  <h2 className="mt-1 text-[16px] font-extrabold">{e.name}</h2>
                </div>
                <Badge tone={e.status} dot>{e.status}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] text-slate-500">{e.description}</p>
              <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden />{e.start} – {e.end}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden />{e.location}</span>
              </p>
              <div className="mt-3.5 flex gap-2 border-t border-slate-100 pt-3">
                <button onClick={() => openEdit(e)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-[13px] font-bold hover:bg-slate-200">
                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                </button>
                <button onClick={() => { updateEvent(e.id, { status: e.status === "Published" ? "Draft" : "Published" }); toast(e.status === "Published" ? "Event unpublished (draft)." : "Event published.", "info"); }}
                  className="flex-1 rounded-xl border border-[#E2E8F0] py-2.5 text-[13px] font-bold hover:bg-slate-50">
                  {e.status === "Published" ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => setConfirmDel(e.id)} aria-label={`Delete ${e.name}`} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100">
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <Modal title={adding ? "Create Event" : "Edit Event"} onClose={() => { setAdding(false); setEditing(null); }}>
          <form onSubmit={adding ? submitAdd : submitEdit} className="space-y-3.5">
            {fields}
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">
              {adding ? (form.status === "Published" ? "Publish Event" : "Save Draft") : "Save Changes"}
            </button>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete event?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">This event will be permanently removed.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={() => { removeEvent(confirmDel); toast("Event deleted.", "info"); setConfirmDel(null); }} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
