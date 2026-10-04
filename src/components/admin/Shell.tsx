"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, redirect } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, BookOpen, Shapes, CalendarDays, CalendarOff, GraduationCap,
  ClipboardCheck, NotebookPen, Award, Trophy, Library, Wallet, CreditCard, Receipt,
  TrendingDown, Bell, PartyPopper, Inbox, Send, FileText, CheckCircle2, XCircle,
  Globe, ShieldCheck, Settings, LifeBuoy, School, LogOut, Menu, X, ChevronDown,
  Search, ChevronRight, UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin, statusOfApp } from "./store";
import type { Role } from "@/data/sms";
import { Avatar } from "./ui";
import CommandPalette from "./CommandPalette";

/* --------------------------------- menu ----------------------------------- */
type Item = { label: string; href: string; icon: typeof LayoutDashboard; roles: Role[] };
type Group = { title: string; items: Item[] };

const ALL: Role[] = ["super-admin", "admin", "teacher", "accountant", "librarian", "admission"];
const OFFICE: Role[] = ["super-admin", "admin", "accountant"];
const TEACH: Role[] = ["super-admin", "admin", "teacher"];

const groups: Group[] = [
  { title: "Main", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL }] },
  {
    title: "Academic",
    items: [
      { label: "Students", href: "/admin/students", icon: Users, roles: ALL },
      { label: "Teachers", href: "/admin/teachers", icon: Briefcase, roles: ["super-admin", "admin"] },
      { label: "Classes", href: "/admin/classes", icon: Shapes, roles: TEACH },
      { label: "Subjects", href: "/admin/subjects", icon: BookOpen, roles: TEACH },
      { label: "Class Routine", href: "/admin/routine", icon: CalendarDays, roles: TEACH },
      { label: "Holidays", href: "/admin/holidays", icon: CalendarOff, roles: TEACH },
      { label: "Academic Year", href: "/admin/academic-year", icon: GraduationCap, roles: ["super-admin", "admin"] },
    ],
  },
  {
    title: "Student Life",
    items: [
      { label: "Attendance", href: "/admin/attendance", icon: ClipboardCheck, roles: TEACH },
      { label: "Homework", href: "/admin/homework", icon: NotebookPen, roles: TEACH },
      { label: "Exams", href: "/admin/exams", icon: Award, roles: TEACH },
      { label: "Results", href: "/admin/results", icon: Trophy, roles: TEACH },
      { label: "Library", href: "/admin/library", icon: Library, roles: ["super-admin", "admin", "teacher", "librarian"] },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Fees", href: "/admin/fees", icon: Wallet, roles: OFFICE },
      { label: "Payments", href: "/admin/payments", icon: CreditCard, roles: OFFICE },
      { label: "Invoices", href: "/admin/invoices", icon: Receipt, roles: OFFICE },
      { label: "Expenses", href: "/admin/expenses", icon: TrendingDown, roles: ["super-admin", "admin", "accountant"] },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Notices", href: "/admin/notices", icon: Bell, roles: TEACH },
      { label: "Events", href: "/admin/events", icon: PartyPopper, roles: ["super-admin", "admin", "teacher"] },
      { label: "Messages", href: "/admin/messages", icon: Inbox, roles: ALL },
      { label: "Notifications", href: "/admin/notifications", icon: Send, roles: ["super-admin", "admin"] },
    ],
  },
  {
    title: "Admission",
    items: [
      { label: "Applications", href: "/admin/admissions", icon: FileText, roles: ["super-admin", "admin", "admission"] },
      { label: "Approved", href: "/admin/admissions/approved", icon: CheckCircle2, roles: ["super-admin", "admin", "admission"] },
      { label: "Rejected", href: "/admin/admissions/rejected", icon: XCircle, roles: ["super-admin", "admin", "admission"] },
    ],
  },
  {
    title: "Website",
    items: [{ label: "Website Content", href: "/admin/website", icon: Globe, roles: ["super-admin", "admin"] }],
  },
  {
    title: "System",
    items: [
      { label: "Reports", href: "/admin/reports", icon: FileText, roles: ["super-admin", "admin", "accountant"] },
      { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck, roles: ["super-admin", "admin"] },
      { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["super-admin", "admin"] },
    ],
  },
];

const crumbs: Record<string, string> = {
  admin: "Dashboard", students: "Students", teachers: "Teachers", classes: "Classes",
  subjects: "Subjects", routine: "Class Routine", holidays: "Holidays", "academic-year": "Academic Year",
  attendance: "Attendance", homework: "Homework", exams: "Exams", results: "Results",
  library: "Library", fees: "Fees", payments: "Payments", invoices: "Invoices",
  expenses: "Expenses", notices: "Notices", events: "Events", messages: "Messages",
  notifications: "Notifications", admissions: "Applications", approved: "Approved",
  rejected: "Rejected", website: "Website Content", reports: "Reports", users: "Users & Roles",
  settings: "Settings", activity: "Activity Log", login: "Login", "forgot-password": "Forgot Password",
};

export const roleLabel: Record<Role, string> = {
  "super-admin": "Super Admin", admin: "Admin", teacher: "Teacher",
  accountant: "Accountant", librarian: "Librarian", admission: "Admission Officer",
};

export function currentRole(): Role | null {
  if (typeof window === "undefined") return null;
  const r = localStorage.getItem("sv_role");
  const valid: Role[] = ["super-admin", "admin", "teacher", "accountant", "librarian", "admission"];
  // backward compatible with the old panel
  if (r === "admin" || r === "teacher" || r === "accountant") return r;
  return valid.includes(r as Role) ? (r as Role) : null;
}
export function currentUser(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("sv_user") || "Admin";
}

/* --------------------------------- sidebar --------------------------------- */
function Sidebar({ role, onNav }: { role: Role; onNav?: () => void }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(groups.map((g) => g.title));
  const { applications, appStatus, messages, msgRead } = useAdmin();
  const pendingApps = applications.filter((a) => statusOfApp(appStatus, a.id) === "Pending").length;
  const unread = messages.filter((m) => m.box === "inbox" && !msgRead.includes(m.id)).length;

  const toggle = (t: string) =>
    setOpenGroups((p) => (p.includes(t) ? p.filter((g) => g !== t) : [...p, t]));

  const badgeFor = (label: string) => {
    if (label === "Applications" && pendingApps > 0)
      return <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-700">{pendingApps}</span>;
    if (label === "Messages" && unread > 0)
      return <span className="ml-auto rounded-full bg-sky-100 px-2 py-0.5 text-[10.5px] font-extrabold text-sky-700">{unread}</span>;
    return null;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <Link href="/admin" onClick={onNav} className="flex items-center gap-2.5 border-b border-[#E2E8F0] px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400">
          <GraduationCap className="h-5 w-5 text-white" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-extrabold tracking-tight text-[#24324A]">Sunshine Valley</span>
          <span className="block text-[10.5px] font-bold tracking-[0.14em] text-[#64748B] uppercase">Management Portal</span>
        </span>
      </Link>

      <nav className="nice-scroll flex-1 space-y-4 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {groups.map((g) => {
          const items = g.items.filter((i) => i.roles.includes(role));
          if (items.length === 0) return null;
          const isOpen = openGroups.includes(g.title);
          return (
            <div key={g.title}>
              <button
                onClick={() => toggle(g.title)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-3 pb-1.5 text-[10.5px] font-extrabold tracking-[0.12em] text-[#94A3B8] uppercase"
              >
                {g.title}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen ? "" : "-rotate-90")} aria-hidden />
              </button>
              {isOpen && (
                <ul className="space-y-0.5">
                  {items.map((m) => {
                    const active = m.href === "/admin" ? pathname === "/admin" : pathname === m.href || pathname.startsWith(m.href + "/");
                    return (
                      <li key={m.href} className="relative">
                        <Link
                          href={m.href}
                          onClick={onNav}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold transition-colors",
                            active ? "bg-sky-50 text-sky-600" : "text-[#475569] hover:bg-slate-50 hover:text-[#24324A]"
                          )}
                        >
                          {active && <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sky-400" aria-hidden />}
                          <m.icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-sky-500" : "text-slate-400")} aria-hidden />
                          {m.label}
                          {badgeFor(m.label)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[#E2E8F0] p-3">
        <Link href="/admin/settings" onClick={onNav} className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-[#475569] hover:bg-slate-50">
          <School className="h-[18px] w-[18px] text-slate-400" aria-hidden /> School Profile
        </Link>
        <Link href="/admin/activity" onClick={onNav} className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-[#475569] hover:bg-slate-50">
          <LifeBuoy className="h-[18px] w-[18px] text-slate-400" aria-hidden /> Help &amp; Support
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        localStorage.removeItem("sv_role");
        localStorage.removeItem("sv_user");
        router.replace("/admin/login");
      }}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-red-500 hover:bg-red-50"
    >
      <LogOut className="h-[18px] w-[18px]" aria-hidden /> Logout
    </button>
  );
}

/* --------------------------------- header ---------------------------------- */
function Header({ role, user, onMenu }: { role: Role; user: string; onMenu: () => void }) {
  const [palette, setPalette] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { applications, appStatus, messages, msgRead, notifications } = useAdmin();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const segs = pathname.split("/").filter(Boolean).slice(1);
  const pendingApps = applications.filter((a) => statusOfApp(appStatus, a.id) === "Pending").length;
  const unread = messages.filter((m) => m.box === "inbox" && !msgRead.includes(m.id)).length;
  const notifCount = pendingApps + unread;

  const feed = [
    ...applications.filter((a) => statusOfApp(appStatus, a.id) === "Pending").slice(0, 2).map((a) => ({ t: `New application: ${a.name}`, s: `${a.class} · ${a.date}`, href: "/admin/admissions" })),
    ...messages.filter((m) => m.box === "inbox" && !msgRead.includes(m.id)).slice(0, 2).map((m) => ({ t: m.subject, s: `${m.from} · ${m.date}`, href: "/admin/messages" })),
    ...notifications.slice(0, 2).map((n) => ({ t: n.title, s: `${n.audience} · ${n.date}`, href: "/admin/notifications" })),
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-4 py-3 sm:px-6">
        <button onClick={onMenu} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] lg:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" aria-hidden />
        </button>

        <nav className="hidden min-w-0 items-center gap-1.5 text-[13px] font-semibold text-[#64748B] md:flex" aria-label="Breadcrumb">
          <Link href="/admin" className="hover:text-[#24324A]">Dashboard</Link>
          {segs.map((s, i) => (
            <span key={s + i} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
              {i === segs.length - 1 ? (
                <span className="truncate font-bold text-[#24324A]">{crumbs[s] ?? s}</span>
              ) : (
                <span className="truncate">{crumbs[s] ?? s}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setPalette(true)}
            className="hidden h-10 w-64 items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50 px-3.5 text-[13px] font-medium text-slate-400 hover:border-slate-300 md:flex"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="flex-1 text-left">Search students, teachers...</span>
            <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-extrabold text-slate-500 shadow-sm">Ctrl K</kbd>
          </button>
          <button onClick={() => setPalette(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] md:hidden" aria-label="Search">
            <Search className="h-5 w-5" aria-hidden />
          </button>

          {/* notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} aria-expanded={notifOpen} aria-label={`Notifications, ${notifCount} new`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] hover:bg-slate-50">
              <Bell className="h-5 w-5 text-[#475569]" aria-hidden />
              {notifCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white">{notifCount}</span>}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} aria-hidden />
                <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-xl">
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Notifications</p>
                  {feed.length === 0 && <p className="px-3 py-4 text-center text-[13px] font-semibold text-slate-500">All caught up.</p>}
                  {feed.map((f, i) => (
                    <Link key={i} href={f.href} onClick={() => setNotifOpen(false)} className="block rounded-xl px-3 py-2.5 hover:bg-slate-50">
                      <p className="truncate text-[13px] font-bold text-[#24324A]">{f.t}</p>
                      <p className="text-[11.5px] font-medium text-slate-500">{f.s}</p>
                    </Link>
                  ))}
                  <Link href="/admin/notifications" onClick={() => setNotifOpen(false)} className="mt-1 block rounded-xl bg-slate-50 px-3 py-2.5 text-center text-[13px] font-bold text-sky-600">
                    View all notifications
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* messages shortcut */}
          <Link href="/admin/messages" aria-label={`Messages, ${unread} unread`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] hover:bg-slate-50 sm:flex">
            <Inbox className="h-5 w-5 text-[#475569]" aria-hidden />
            {unread > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-extrabold text-white">{unread}</span>}
          </Link>

          {/* profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} aria-expanded={profileOpen} aria-label="Account menu"
              className="flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] py-1 pr-2.5 pl-1 hover:bg-slate-50">
              <Avatar name={user} size="h-8 w-8 text-xs" />
              <span className="hidden text-left leading-tight xl:block">
                <span className="block max-w-[110px] truncate text-[13px] font-bold text-[#24324A]">{user}</span>
                <span className="block text-[11px] font-semibold text-slate-500">{roleLabel[role]}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 xl:block" aria-hidden />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden />
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-xl">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <Avatar name={user} />
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold">{user}</p>
                      <p className="text-[11.5px] font-semibold text-slate-500">{roleLabel[role]}</p>
                    </div>
                  </div>
                  {[
                    { label: "My Profile", icon: UserRound, href: "/admin/settings" },
                    { label: "Account Settings", icon: Settings, href: "/admin/settings" },
                    { label: "Activity Log", icon: Bell, href: "/admin/activity" },
                  ].map((m) => (
                    <Link key={m.label} href={m.href} onClick={() => setProfileOpen(false)} className="mt-0.5 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[#475569] hover:bg-slate-50">
                      <m.icon className="h-4 w-4 text-slate-400" aria-hidden />{m.label}
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-[#E2E8F0] pt-1">
                    <button
                      onClick={() => { localStorage.removeItem("sv_role"); localStorage.removeItem("sv_user"); router.replace("/admin/login"); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" aria-hidden />Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}

/* ---------------------------------- shell ---------------------------------- */
export default function Shell({ children }: { children: ReactNode }) {
  const [role] = useState<Role | null>(() => currentRole());
  const [user] = useState<string>(() => currentUser());
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();

  if (!role) redirect("/admin/login");

  const allowed = groups.some((g) => g.items.some((i) => i.roles.includes(role) && (i.href === "/admin" ? pathname === "/admin" : pathname === i.href || pathname.startsWith(i.href + "/"))));
  if (!allowed && pathname !== "/admin/activity" && (role === "teacher" || role === "librarian" || role === "admission" || role === "accountant")) {
    if (typeof window !== "undefined" && !["/admin", "/admin/login"].includes(pathname)) redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-[#E2E8F0] lg:block">
        <Sidebar role={role} />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-[#24324A]/50" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="absolute top-0 bottom-0 left-0 w-72 max-w-[85vw] border-r border-[#E2E8F0]">
            <button onClick={() => setDrawer(false)} aria-label="Close navigation" className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <X className="h-4 w-4" aria-hidden />
            </button>
            <Sidebar role={role} onNav={() => setDrawer(false)} />
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Header role={role} user={user} onMenu={() => setDrawer(true)} />
        <div className="w-full px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
