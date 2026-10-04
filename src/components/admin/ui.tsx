"use client";

import type { ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/data/sms";
import { useAdmin, type Toast } from "./store";

/* --------------------------------- Avatar --------------------------------- */
export function Avatar({ name, size = "h-10 w-10 text-sm" }: { name: string; size?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full font-extrabold", avatarColor(name), size)} aria-hidden>
      {initials(name)}
    </span>
  );
}

/* -------------------------------- Page header ------------------------------ */
export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-[#24324A] sm:text-2xl">{title}</h1>
        {sub && <p className="mt-0.5 text-[13px] font-medium text-[#64748B]">{sub}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

/* --------------------------------- Stat card ------------------------------- */
export function StatCard({ icon: Icon, label, value, trend, compare, bg }: {
  icon: typeof X; label: string; value: string; trend?: string; compare?: string; bg: string;
}) {
  const up = trend?.startsWith("+");
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 transition-shadow hover:shadow-[0_8px_24px_-12px_rgb(36_50_74/0.25)]">
      <div className="flex items-start justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", bg)}>
          <Icon className="h-5 w-5 text-white" aria-hidden />
        </span>
        {trend && (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold", up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
            {up ? <TrendingUp className="h-3 w-3" aria-hidden /> : <TrendingDown className="h-3 w-3" aria-hidden />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-[26px] leading-none font-extrabold tracking-tight text-[#24324A]">{value}</p>
      <p className="mt-1.5 text-[13px] font-semibold text-[#64748B]">{label}</p>
      {compare && <p className="mt-0.5 text-[11.5px] font-medium text-[#94A3B8]">{compare}</p>}
    </div>
  );
}

/* ---------------------------------- Badge ---------------------------------- */
const badgeStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-600", Sent: "bg-emerald-50 text-emerald-600",
  Approved: "bg-emerald-50 text-emerald-600", Active: "bg-emerald-50 text-emerald-600",
  Completed: "bg-emerald-50 text-emerald-600", Published: "bg-emerald-50 text-emerald-600",
  Available: "bg-emerald-50 text-emerald-600", Replied: "bg-emerald-50 text-emerald-600",
  Partial: "bg-amber-50 text-amber-600", Pending: "bg-amber-50 text-amber-600",
  Scheduled: "bg-amber-50 text-amber-600", Draft: "bg-slate-100 text-slate-500",
  Unpaid: "bg-red-50 text-red-500", Rejected: "bg-red-50 text-red-500",
  Overdue: "bg-red-50 text-red-500", Suspended: "bg-red-50 text-red-500",
  Inactive: "bg-slate-100 text-slate-500", Expired: "bg-slate-100 text-slate-500",
  "On Leave": "bg-amber-50 text-amber-600", Refunded: "bg-slate-100 text-slate-500",
  "Under Review": "bg-sky-50 text-sky-600", Upcoming: "bg-sky-50 text-sky-600",
  Ongoing: "bg-violet-50 text-violet-600", P: "bg-emerald-50 text-emerald-600",
  A: "bg-red-50 text-red-500", L: "bg-amber-50 text-amber-600", H: "bg-slate-100 text-slate-400",
};
export function Badge({ tone, children, dot }: { tone: string; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap", badgeStyles[tone] ?? "bg-slate-100 text-slate-500")}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/* ---------------------------------- Modal ---------------------------------- */
export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-[#24324A]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={cn("max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl", wide ? "max-w-2xl" : "max-w-lg")} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#24324A]">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- Drawer --------------------------------- */
export function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-[#24324A]/50" onClick={onClose} aria-hidden />
      <aside className="absolute top-0 right-0 bottom-0 w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl" role="dialog" aria-label={title}>
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-extrabold text-[#24324A]">{title}</h2>
          <button onClick={onClose} aria-label="Close panel" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </aside>
    </div>
  );
}

/* ------------------------------- Field / input ------------------------------ */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-bold text-[#24324A]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
export const inputCls =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm font-medium text-[#24324A] outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-sky-500 disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#24324A] transition-all hover:bg-slate-50";

/* ------------------------------ Empty / skeleton ---------------------------- */
export function Empty({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-white px-6 py-12 text-center" role="status">
      <p className="text-[15px] font-bold text-[#24324A]">{title}</p>
      {sub && <p className="mt-1 text-[13px] font-medium text-[#64748B]">{sub}</p>}
    </div>
  );
}
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200/70", className)} aria-hidden />;
}
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2.5 rounded-2xl border border-[#E2E8F0] bg-white p-4" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-9 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- Pagination ------------------------------- */
export function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const nums: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) nums.push(i);
  return (
    <nav className="flex items-center justify-center gap-1.5 pt-2" aria-label="Pagination">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[13px] font-bold disabled:opacity-40">Prev</button>
      {nums[0] > 1 && <span className="px-1 text-slate-400">…</span>}
      {nums.map((n) => (
        <button key={n} onClick={() => onPage(n)} aria-current={n === page ? "page" : undefined}
          className={cn("h-8 w-8 rounded-lg text-[13px] font-bold", n === page ? "bg-[#24324A] text-white" : "border border-[#E2E8F0] bg-white hover:bg-slate-50")}>
          {n}
        </button>
      ))}
      {nums[nums.length - 1] < totalPages && <span className="px-1 text-slate-400">…</span>}
      <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[13px] font-bold disabled:opacity-40">Next</button>
    </nav>
  );
}

/* --------------------------------- Progress -------------------------------- */
export function Progress({ value, color = "bg-sky-400" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ----------------------------------- Tabs ----------------------------------- */
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1" role="tablist">
      {tabs.map((t) => (
        <button key={t} role="tab" aria-selected={active === t} onClick={() => onChange(t)}
          className={cn("rounded-lg px-4 py-2 text-[13px] font-bold whitespace-nowrap transition-all", active === t ? "bg-white text-[#24324A] shadow-sm" : "text-[#64748B] hover:text-[#24324A]")}>
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------- Toaster --------------------------------- */
const toastStyle: Record<Toast["tone"], { bg: string; Icon: typeof Info }> = {
  success: { bg: "bg-emerald-500", Icon: CheckCircle2 },
  error: { bg: "bg-red-500", Icon: AlertCircle },
  info: { bg: "bg-sky-500", Icon: Info },
  warning: { bg: "bg-amber-500", Icon: AlertTriangle },
};
export function Toaster() {
  const { toasts, dismissToast } = useAdmin();
  return (
    <div className="fixed right-4 bottom-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const s = toastStyle[t.tone];
        return (
          <div key={t.id} className="flex items-start gap-3 rounded-2xl bg-[#24324A] p-4 text-white shadow-xl">
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", s.bg)}>
              <s.Icon className="h-4 w-4" aria-hidden />
            </span>
            <p className="flex-1 pt-1 text-[13.5px] font-semibold">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss notification" className="text-white/60 hover:text-white">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
