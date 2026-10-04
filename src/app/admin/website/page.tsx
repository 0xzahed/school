"use client";

import { useState } from "react";
import { Save, Eye } from "lucide-react";
import { PageHeader, Field, inputCls, Tabs, Badge } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { gallery } from "@/data/school";

const pageDocs = [
  { name: "About", desc: "School story, mission, principal message", updated: "Dec 18, 2026" },
  { name: "Academics", desc: "Subjects, methodology, calendar", updated: "Dec 12, 2026" },
  { name: "Admission", desc: "Process steps and application form", updated: "Dec 20, 2026" },
  { name: "Contact", desc: "Info, map and enquiry form", updated: "Dec 08, 2026" },
];

const newsSeeds = [
  { t: "Admissions Open for 2027", c: "Admissions", d: "Dec 02, 2026", s: "Published" },
  { t: "Annual Exam Schedule", c: "Exams", d: "Dec 10, 2026", s: "Published" },
  { t: "Winter Concert Highlights", c: "Events", d: "Dec 23, 2026", s: "Draft" },
];

export default function WebsitePage() {
  const { website, updateWebsite, toast, log } = useAdmin();
  const [tab, setTab] = useState("Homepage");
  const [form, setForm] = useState({ ...website });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsite(form);
    toast("Website content updated. Changes are live in this prototype.");
    log("Updated website homepage content", "Website");
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Website Content"
        sub="Mini CMS — manage the public site without editing code"
        action={
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
            <Eye className="h-4 w-4" aria-hidden /> View Website
          </a>
        }
      />

      <Tabs tabs={["Homepage", "Pages", "News", "Gallery"]} active={tab} onChange={setTab} />

      {tab === "Homepage" && (
        <form onSubmit={save} className="space-y-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
          <Field label="Hero title"><input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className={inputCls} /></Field>
          <Field label="Hero subtitle"><textarea rows={2} value={form.heroSub} onChange={(e) => setForm({ ...form, heroSub: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <Field label="About section"><textarea rows={2} value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Student statistic"><input value={form.statStudents} onChange={(e) => setForm({ ...form, statStudents: e.target.value })} className={inputCls} /></Field>
            <Field label="Teacher statistic"><input value={form.statTeachers} onChange={(e) => setForm({ ...form, statTeachers: e.target.value })} className={inputCls} /></Field>
          </div>
          <Field label="Announcement bar"><input value={form.notice} onChange={(e) => setForm({ ...form, notice: e.target.value })} className={inputCls} /></Field>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-white hover:bg-sky-500">
            <Save className="h-4 w-4" aria-hidden /> Save Changes
          </button>
        </form>
      )}

      {tab === "Pages" && (
        <div className="grid gap-3 md:grid-cols-2">
          {pageDocs.map((p) => (
            <article key={p.name} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-extrabold">/{p.name.toLowerCase()}</h2>
                <Badge tone="Published">Live</Badge>
              </div>
              <p className="mt-1 text-[13px] font-medium text-slate-500">{p.desc}</p>
              <p className="mt-2 text-xs font-semibold text-slate-400">Last edited {p.updated}</p>
              <button onClick={() => toast(`${p.name} page editor opened (prototype).`, "info")} className="mt-3 w-full rounded-xl bg-slate-100 py-2.5 text-[13px] font-bold hover:bg-slate-200">
                Edit Page
              </button>
            </article>
          ))}
        </div>
      )}

      {tab === "News" && (
        <div className="space-y-2.5">
          {newsSeeds.map((n) => (
            <article key={n.t} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{n.t}</p>
                <p className="text-xs font-semibold text-slate-500">{n.c} · {n.d}</p>
              </div>
              <Badge tone={n.s}>{n.s}</Badge>
              <button onClick={() => toast("News editor opened (prototype).", "info")} className="rounded-xl bg-slate-100 px-4 py-2 text-[13px] font-bold hover:bg-slate-200">Edit</button>
            </article>
          ))}
          <button onClick={() => toast("News composer opened (prototype).", "info")} className="w-full rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-white py-4 text-sm font-bold text-slate-500 hover:border-sky-300 hover:text-sky-600">
            + Create News Article
          </button>
        </div>
      )}

      {tab === "Gallery" && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.slice(0, 6).map((g) => (
              <div key={g.src} className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-extrabold">{g.category}</span>
                <button onClick={() => toast("Photo removed from gallery (prototype).", "info")} aria-label={`Delete photo ${g.alt}`}
                  className="absolute top-2 right-2 rounded-full bg-red-500 px-2.5 py-1 text-[10.5px] font-extrabold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => toast("Upload dialog opened (prototype).", "info")} className="w-full rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-white py-4 text-sm font-bold text-slate-500 hover:border-sky-300 hover:text-sky-600">
            + Upload Photos
          </button>
        </>
      )}
    </div>
  );
}
