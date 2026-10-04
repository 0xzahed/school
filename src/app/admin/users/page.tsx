"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { PageHeader, Avatar, Badge } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { permissionMatrix } from "@/data/sms";
import { cn } from "@/lib/utils";

const roles = ["Super Admin", "Admin", "Teacher", "Accountant", "Librarian"];
const actions = ["View", "Create", "Edit", "Delete"];
const roleOptions = ["Super Admin", "Admin", "Teacher", "Accountant", "Librarian", "Admission Officer"];

export default function UsersPage() {
  const { users, setUserRole, toggleUserStatus, toast, log } = useAdmin();
  const [roleFilter, setRoleFilter] = useState("All");

  const list = roleFilter === "All" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div className="space-y-4">
      <PageHeader title="Users & Roles" sub="Control who can see and do what" />

      <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead><tr className="border-b border-[#E2E8F0] bg-slate-50/60 text-[11px] tracking-wider text-slate-500 uppercase">
            <th className="px-5 py-3.5 font-extrabold">User</th><th className="px-3 py-3.5 font-extrabold">Role</th>
            <th className="px-3 py-3.5 font-extrabold">Last Login</th><th className="px-3 py-3.5 font-extrabold">Status</th>
            <th className="px-5 py-3.5 text-right font-extrabold">Access</th>
          </tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2.5"><Avatar name={u.name} size="h-9 w-9 text-xs" />
                    <span><span className="block font-bold">{u.name}</span><span className="block text-[11px] font-semibold text-slate-400">{u.email}</span></span></span>
                </td>
                <td className="px-3 py-3">
                  <select value={u.role} onChange={(e) => { setUserRole(u.id, e.target.value); toast(`${u.name} is now ${e.target.value}.`); log(`Changed role of ${u.name} to ${e.target.value}`, "Users"); }}
                    aria-label={`Role for ${u.name}`} className="rounded-lg border border-[#E2E8F0] px-2 py-1.5 text-[13px] font-bold outline-none focus:border-sky-400">
                    {roleOptions.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3 font-medium text-slate-500">{u.login}</td>
                <td className="px-3 py-3"><Badge tone={u.status} dot>{u.status}</Badge></td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => { toggleUserStatus(u.id); toast(`${u.name} ${u.status === "Active" ? "suspended" : "reactivated"}.`, u.status === "Active" ? "warning" : "success"); }}
                    className={cn("rounded-xl px-3.5 py-2 text-xs font-bold", u.status === "Active" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100")}>
                    {u.status === "Active" ? "Suspend" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filter by role"
          className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] font-semibold outline-none focus:border-sky-400">
          {["All", ...roleOptions].map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <h2 className="text-[15px] font-extrabold">Permission Matrix</h2>
        <p className="text-xs font-medium text-slate-500">What each role can do in every module</p>
        <table className="mt-4 w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2.5 pr-3 font-extrabold">Module</th>
              {roles.map((r) => <th key={r} colSpan={4} className="border-l border-[#E2E8F0] px-2 py-2.5 text-center font-extrabold">{r}</th>)}
            </tr>
            <tr className="border-b border-[#E2E8F0] text-[10.5px] tracking-wider text-slate-400 uppercase">
              <th className="py-2 pr-3"></th>
              {roles.map((r) => actions.map((a) => <th key={r + a} className="border-l border-slate-100 px-1 py-2 text-center font-extrabold">{a[0]}</th>))}
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.map((row) => (
              <tr key={row.module} className="border-b border-slate-100 last:border-0">
                <td className="py-2.5 pr-3 font-bold">{row.module}</td>
                {roles.map((r) => (row.perms[r] ?? [false, false, false, false]).map((ok, i) => (
                  <td key={r + i} className="border-l border-slate-100 px-1 py-2 text-center">
                    {ok
                      ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100"><Check className="h-3 w-3 text-emerald-600" aria-hidden /></span>
                      : <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100"><Minus className="h-3 w-3 text-slate-300" aria-hidden /></span>}
                  </td>
                )))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] font-bold text-slate-400">V = View · C = Create · E = Edit · D = Delete</p>
      </div>
    </div>
  );
}
