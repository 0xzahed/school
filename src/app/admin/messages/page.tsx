"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Trash2, Reply, Send } from "lucide-react";
import { PageHeader, Avatar, Modal, Field, inputCls, Empty, Tabs } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { todayISO, type Message } from "@/data/sms";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { messages, msgRead, markRead, removeMessage, sendMessage, toast, log, teachers } = useAdmin();
  const [box, setBox] = useState("Inbox");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [form, setForm] = useState({ to: "", subject: "", body: "" });

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return messages
      .filter((m) => (box === "Inbox" ? m.box === "inbox" : m.box === "sent"))
      .filter((m) => query === "" || `${m.from} ${m.subject} ${m.body}`.toLowerCase().includes(query))
      .sort((a, b) => (msgRead.includes(a.id) ? 1 : 0) - (msgRead.includes(b.id) ? 1 : 0));
  }, [messages, box, q, msgRead]);

  const unread = messages.filter((m) => m.box === "inbox" && !msgRead.includes(m.id)).length;
  const opened = messages.find((m) => m.id === openId);

  const open = (id: string) => {
    setOpenId(id);
    markRead(id);
  };

  const submitCompose = (e: React.FormEvent) => {
    e.preventDefault();
    const m: Message = {
      id: `M-${Date.now()}`, from: "You (Office)", email: "office@school.edu",
      subject: form.subject.trim() || "(no subject)", body: form.body.trim(), date: todayISO(), box: "sent",
    };
    sendMessage(m);
    toast(`Message sent to ${form.to}.`);
    log(`Sent message: ${m.subject}`, "Messages");
    setComposing(false);
    setForm({ to: "", subject: "", body: "" });
    setBox("Sent");
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Messages"
        sub={box === "Inbox" ? `${unread} unread` : `${list.length} sent messages`}
        action={
          <button onClick={() => setComposing(true)} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
            <Plus className="h-4 w-4" aria-hidden /> Compose
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:w-64"><Tabs tabs={["Inbox", "Sent"]} active={box} onChange={(t) => { setBox(t); setOpenId(null); }} /></div>
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages..." aria-label="Search messages"
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pr-3 pl-10 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </div>
      </div>

      {list.length === 0 ? <Empty title={box === "Inbox" ? "Inbox is empty." : "No sent messages yet."} /> : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <ul className="space-y-2">
            {list.map((m) => {
              const read = msgRead.includes(m.id);
              return (
                <li key={m.id}>
                  <button onClick={() => open(m.id)}
                    className={cn("flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-all", openId === m.id ? "border-sky-400 ring-2 ring-sky-100" : "border-[#E2E8F0] hover:border-slate-300")}>
                    <Avatar name={m.from} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={cn("truncate text-sm", read || m.box === "sent" ? "font-semibold text-slate-600" : "font-extrabold")}>{m.subject}</span>
                        {!read && m.box === "inbox" && <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" aria-label="Unread" />}
                      </span>
                      <span className="block truncate text-xs font-medium text-slate-500">{m.from} · {m.date}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="h-fit rounded-2xl border border-[#E2E8F0] bg-white p-5 lg:sticky lg:top-20">
            {!opened ? <p className="py-10 text-center text-sm font-semibold text-slate-500">Select a message to read it here.</p> : (
              <div>
                <div className="flex items-center gap-3">
                  <Avatar name={opened.from} size="h-11 w-11" />
                  <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-extrabold">{opened.subject}</h2>
                    <p className="truncate text-xs font-semibold text-slate-500">{opened.from} ({opened.email}) · {opened.date}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-[14px] leading-relaxed font-medium text-slate-700">{opened.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {opened.box === "inbox" && (
                    <a href={`mailto:${opened.email}?subject=Re: ${opened.subject}`} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-[13px] font-bold text-white hover:bg-sky-500">
                      <Reply className="h-4 w-4" aria-hidden /> Reply by Email
                    </a>
                  )}
                  <button onClick={() => setConfirmDel(opened.id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-100">
                    <Trash2 className="h-4 w-4" aria-hidden /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {composing && (
        <Modal title="Compose Message" onClose={() => setComposing(false)}>
          <form onSubmit={submitCompose} className="space-y-3.5">
            <Field label="To (teacher, parent or group) *">
              <input required value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="e.g. Class 6 parents" list="staff-list" className={inputCls} />
              <datalist id="staff-list">
                {teachers.slice(0, 10).map((t) => <option key={t.id} value={t.name} />)}
                <option value="All parents" />
                <option value="All teachers" />
              </datalist>
            </Field>
            <Field label="Subject *"><input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Message subject" className={inputCls} /></Field>
            <Field label="Message *"><textarea required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write your message..." className={`${inputCls} resize-none`} /></Field>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">
              <Send className="h-4 w-4" aria-hidden /> Send Message
            </button>
          </form>
        </Modal>
      )}

      {confirmDel && (
        <Modal title="Delete message?" onClose={() => setConfirmDel(null)}>
          <p className="text-sm font-medium text-slate-600">This message will be removed.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmDel(null)} className="flex-1 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold">Cancel</button>
            <button onClick={() => { removeMessage(confirmDel); setConfirmDel(null); setOpenId(null); toast("Message deleted.", "info"); }} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
