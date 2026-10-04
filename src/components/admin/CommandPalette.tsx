"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Bell, CalendarDays, Settings, LayoutDashboard, Users, Wallet } from "lucide-react";
import { useAdmin } from "./store";
import { Avatar } from "./ui";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Fees", href: "/admin/fees", icon: Wallet },
  { label: "Notices", href: "/admin/notices", icon: Bell },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { students, teachers, invoices, noticeList, eventList } = useAdmin();

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open ]);

  const close = useCallback(() => {
    setQ("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return null;
    return {
      students: students.filter((s) => `${s.name} ${s.id}`.toLowerCase().includes(query)).slice(0, 5),
      teachers: teachers.filter((t) => `${t.name} ${t.id}`.toLowerCase().includes(query)).slice(0, 3),
      invoices: invoices.filter((v) => `${v.no} ${v.studentId}`.toLowerCase().includes(query)).slice(0, 3),
      notices: noticeList.filter((n) => n.title.toLowerCase().includes(query)).slice(0, 3),
      events: eventList.filter((e) => e.name.toLowerCase().includes(query)).slice(0, 3),
      pages: navItems.filter((n) => n.label.toLowerCase().includes(query)),
    };
  }, [q, students, teachers, invoices, noticeList, eventList]);

  if (!open) return null;

  const go = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center bg-[#24324A]/50 p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Global search" onClick={close}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search students, teachers, invoices, notices..."
            aria-label="Search anything"
            className="w-full bg-transparent py-4 text-[15px] font-medium outline-none placeholder:text-slate-400"
          />
          <button onClick={close} aria-label="Close search" className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">ESC</button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!results ? (
            <div className="px-3 py-6 text-center">
              <p className="text-sm font-bold text-[#24324A]">Type at least 2 characters to search</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {navItems.map((n) => (
                  <button key={n.href} onClick={() => go(n.href)} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold hover:bg-sky-100 hover:text-sky-700">
                    <n.icon className="h-3.5 w-3.5" aria-hidden />{n.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {results.pages.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Pages</p>
                  {results.pages.map((n) => (
                    <button key={n.href} onClick={() => go(n.href)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold hover:bg-sky-50">
                      <n.icon className="h-4 w-4 text-sky-500" aria-hidden />{n.label}
                    </button>
                  ))}
                </div>
              )}
              {results.students.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Students</p>
                  {results.students.map((s) => (
                    <button key={s.id} onClick={() => go(`/admin/students/${s.id}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-sky-50">
                      <Avatar name={s.name} size="h-8 w-8 text-xs" />
                      <span><span className="block text-sm font-bold">{s.name}</span><span className="block text-xs font-medium text-slate-500">{s.id} · {s.class}-{s.section}</span></span>
                    </button>
                  ))}
                </div>
              )}
              {results.teachers.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Teachers</p>
                  {results.teachers.map((t) => (
                    <button key={t.id} onClick={() => go(`/admin/teachers/${t.id}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-sky-50">
                      <Avatar name={t.name} size="h-8 w-8 text-xs" />
                      <span><span className="block text-sm font-bold">{t.name}</span><span className="block text-xs font-medium text-slate-500">{t.subject} · {t.id}</span></span>
                    </button>
                  ))}
                </div>
              )}
              {results.invoices.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Invoices</p>
                  {results.invoices.map((v) => (
                    <button key={v.no} onClick={() => go("/admin/invoices")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold hover:bg-sky-50">
                      <FileText className="h-4 w-4 text-violet-500" aria-hidden />{v.no} · {v.studentId}
                    </button>
                  ))}
                </div>
              )}
              {results.notices.length + results.events.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Notices &amp; Events</p>
                  {results.notices.map((n) => (
                    <button key={n.id} onClick={() => go("/admin/notices")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold hover:bg-sky-50">
                      <Bell className="h-4 w-4 text-amber-500" aria-hidden />{n.title}
                    </button>
                  ))}
                  {results.events.map((e) => (
                    <button key={e.id} onClick={() => go("/admin/events")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold hover:bg-sky-50">
                      <CalendarDays className="h-4 w-4 text-emerald-500" aria-hidden />{e.name}
                    </button>
                  ))}
                </div>
              )}
              {results.students.length + results.teachers.length + results.invoices.length + results.notices.length + results.events.length + results.pages.length === 0 && (
                <p className="px-3 py-8 text-center text-sm font-bold text-slate-500">No results for &ldquo;{q}&rdquo;.</p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-[#E2E8F0] px-4 py-2.5 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5"><X className="h-3 w-3" aria-hidden /> ESC to close</span>
          <span>Search across the whole system</span>
        </div>
      </div>
    </div>
  );
}
