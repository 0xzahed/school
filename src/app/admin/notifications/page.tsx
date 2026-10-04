"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { PageHeader, Badge, Modal, Field, inputCls, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { todayISO, type Notification } from "@/data/sms";

const audiences = ["All students", "Parents", "Teachers", "Specific class", "Specific student"];
const channels = ["In-app", "Email", "SMS"];

export default function NotificationsPage() {
  const { notifications, sendNotification, toast, log } = useAdmin();
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", audience: "Parents", channel: "In-app", schedule: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Notification = {
      id: `NT-${Date.now()}`, title: form.title.trim(), message: form.message.trim(),
      audience: form.audience, channel: form.channel, date: form.schedule || todayISO(),
      status: form.schedule ? "Scheduled" : "Sent",
    };
    sendNotification(n);
    toast(form.schedule ? "Notification scheduled." : "Notification sent to " + form.audience + ".");
    log(`${form.schedule ? "Scheduled" : "Sent"} notification: ${n.title}`, "Notifications");
    setComposing(false);
    setForm({ title: "", message: "", audience: "Parents", channel: "In-app", schedule: "" });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        sub="Send in-app, email or SMS updates"
        action={
          <button onClick={() => setComposing(true)} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> New Notification
          </button>
        }
      />

      {notifications.length === 0 ? <Empty title="No notifications yet." /> : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <article key={n.id} className="flex gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100">
                <Send className="h-5 w-5 text-violet-600" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[11.5px] font-extrabold">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{n.audience}</span>
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-600">{n.channel}</span>
                  <Badge tone={n.status}>{n.status}</Badge>
                  <span className="font-semibold text-slate-400">{n.date}</span>
                </p>
                <h2 className="mt-1.5 text-[15px] font-extrabold">{n.title}</h2>
                <p className="mt-0.5 text-[13px] text-slate-500">{n.message}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {composing && (
        <Modal title="Send Notification" onClose={() => setComposing(false)}>
          <form onSubmit={submit} className="space-y-3.5">
            <Field label="Title *"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sports Day tomorrow" className={inputCls} /></Field>
            <Field label="Message *"><textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Keep it short and clear..." className={`${inputCls} resize-none`} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Audience"><select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className={inputCls}>{audiences.map((a) => <option key={a}>{a}</option>)}</select></Field>
              <Field label="Channel"><select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className={inputCls}>{channels.map((c) => <option key={c}>{c}</option>)}</select></Field>
            </div>
            <Field label="Schedule (optional — leave empty to send now)"><input type="date" value={form.schedule} min={todayISO()} onChange={(e) => setForm({ ...form, schedule: e.target.value })} className={inputCls} /></Field>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-bold text-white hover:bg-violet-600">
              <Send className="h-4 w-4" aria-hidden /> {form.schedule ? "Schedule" : "Send Now"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
