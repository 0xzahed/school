"use client";

import { useState } from "react";
import { Save, ShieldCheck, Smartphone } from "lucide-react";
import { weekDays } from "@/data/sms";
import { PageHeader, Field, inputCls, Tabs } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { cn } from "@/lib/utils";

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-emerald-500" : "bg-slate-200")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, toast, log } = useAdmin();
  const [tab, setTab] = useState("School Profile");
  const [form, setForm] = useState({ ...settings });
  const [pass, setPass] = useState({ cur: "", next: "", again: "" });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    toast("Settings saved successfully.");
    log("Updated school settings", "Settings");
  };

  const changePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.next.length < 6) {
      toast("New password must be at least 6 characters.", "error");
      return;
    }
    if (pass.next !== pass.again) {
      toast("New passwords do not match.", "error");
      return;
    }
    toast("Password changed successfully.");
    log("Changed account password", "Security");
    setPass({ cur: "", next: "", again: "" });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" sub="School profile, academics, finance, notifications and security" />
      <Tabs tabs={["School Profile", "Academic", "Finance", "Notifications", "Security"]} active={tab} onChange={setTab} />

      {tab === "School Profile" && (
        <form onSubmit={save} className="grid gap-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:grid-cols-2 sm:p-6">
          <Field label="School name"><input value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} className={inputCls} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></Field>
          <Field label="Website"><input value="www.sunshinevalley.school" readOnly className={cn(inputCls, "bg-slate-50")} /></Field>
          <div className="sm:col-span-2"><Field label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} /></Field></div>
          <div className="sm:col-span-2"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white hover:bg-sky-500"><Save className="h-4 w-4" aria-hidden /> Save Profile</button></div>
        </form>
      )}

      {tab === "Academic" && (
        <form onSubmit={save} className="grid gap-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Active academic year"><select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls}>
            {["2026", "2025", "2024"].map((y) => <option key={y}>{y}</option>)}
          </select></Field>
          <Field label="Grading system"><select className={inputCls} defaultValue="A+ to F (80 = A+)"><option>A+ to F (80 = A+)</option><option>GPA 5.0 scale</option><option>Percentage only</option></select></Field>
          <Field label="Minimum attendance %"><input defaultValue="75" type="number" min={0} max={100} className={inputCls} /></Field>
          <Field label="Weekly holiday"><select value={form.weeklyHoliday} onChange={(e) => setForm({ ...form, weeklyHoliday: Number(e.target.value) })} className={inputCls}>{weekDays.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></Field>
          <div className="sm:col-span-2"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white hover:bg-sky-500"><Save className="h-4 w-4" aria-hidden /> Save Academic Settings</button></div>
        </form>
      )}

      {tab === "Finance" && (
        <form onSubmit={save} className="grid gap-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Currency"><select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputCls}>
            <option>BDT (৳)</option><option>USD ($)</option>
          </select></Field>
          <Field label="Invoice prefix"><input defaultValue="INV-" className={inputCls} /></Field>
          <Field label="Late fee per month (৳)"><input defaultValue="100" type="number" className={inputCls} /></Field>
          <Field label="Discount limit %"><input defaultValue="20" type="number" className={inputCls} /></Field>
          <div className="sm:col-span-2"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white hover:bg-sky-500"><Save className="h-4 w-4" aria-hidden /> Save Finance Settings</button></div>
        </form>
      )}

      {tab === "Notifications" && (
        <form onSubmit={save} className="space-y-2.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
          {[
            { k: "emailNotif" as const, t: "Email notifications", d: "Fee receipts, results and notices by email" },
            { k: "smsNotif" as const, t: "SMS notifications", d: "Urgent alerts and fee reminders by SMS" },
            { k: "pushNotif" as const, t: "Push notifications", d: "In-app alerts for staff panel users" },
          ].map((r) => (
            <div key={r.k} className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3.5">
              <div className="flex-1"><p className="text-sm font-bold">{r.t}</p><p className="text-xs font-medium text-slate-500">{r.d}</p></div>
              <Toggle on={form[r.k]} onClick={() => setForm({ ...form, [r.k]: !form[r.k] })} label={r.t} />
            </div>
          ))}
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white hover:bg-sky-500"><Save className="h-4 w-4" aria-hidden /> Save Preferences</button>
        </form>
      )}

      {tab === "Security" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={changePass} className="space-y-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold"><ShieldCheck className="h-5 w-5 text-emerald-500" aria-hidden />Change Password</h2>
            <Field label="Current password"><input type="password" required value={pass.cur} onChange={(e) => setPass({ ...pass, cur: e.target.value })} className={inputCls} /></Field>
            <Field label="New password"><input type="password" required value={pass.next} onChange={(e) => setPass({ ...pass, next: e.target.value })} className={inputCls} /></Field>
            <Field label="Confirm new password"><input type="password" required value={pass.again} onChange={(e) => setPass({ ...pass, again: e.target.value })} className={inputCls} /></Field>
            <button type="submit" className="w-full rounded-xl bg-[#24324A] px-4 py-3 text-sm font-bold text-white">Update Password</button>
          </form>
          <div className="space-y-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold"><Smartphone className="h-5 w-5 text-sky-500" aria-hidden />Sessions &amp; 2FA</h2>
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3.5">
              <div className="flex-1"><p className="text-sm font-bold">Two-factor authentication</p><p className="text-xs font-medium text-slate-500">Extra code on every new device</p></div>
              <Toggle on={form.twoFA} onClick={() => { setForm({ ...form, twoFA: !form.twoFA }); toast(`Two-factor ${!form.twoFA ? "enabled" : "disabled"}.`, "info"); }} label="Two-factor authentication" />
            </div>
            {[["This device · Chrome", "Active now"], ["Office PC · Edge", "2 hours ago"]].map(([d, w]) => (
              <div key={d} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                <span className="font-bold">{d}</span>
                <span className="ml-auto text-xs font-semibold text-slate-500">{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
