"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, BookOpen, UserRound, ArrowRight, Pencil } from "lucide-react";
import { PageHeader, Modal, Field, inputCls, Avatar } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";
import { classCards } from "@/data/sms";

export default function ClassesPage() {
  const { teachers, toast, log } = useAdmin();
  const [open, setOpen] = useState<string | null>(classCards.find((c) => c.name === "Class 6")?.name ?? null);
  const [assignFor, setAssignFor] = useState<{ cls: string; sec: string } | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const teacherOf = (cls: string, sec: string) => overrides[`${cls}|${sec}`] ?? classCards.find((c) => c.name === cls)?.sections.find((s) => s.name === sec)?.teacher ?? "—";

  const saveAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignFor || !teacherName) return;
    setOverrides((p) => ({ ...p, [`${assignFor.cls}|${assignFor.sec}`]: teacherName }));
    toast(`Teacher assigned to ${assignFor.cls} – ${assignFor.sec}.`);
    log(`Assigned ${teacherName} to ${assignFor.cls}-${assignFor.sec}`, "Classes");
    setAssignFor(null);
    setTeacherName("");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Classes" sub={`${classCards.length} classes · click a card for sections`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {classCards.map((c) => {
          const expanded = open === c.name;
          return (
            <article key={c.name} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
              <button onClick={() => setOpen(expanded ? null : c.name)} aria-expanded={expanded}
                className="flex w-full items-center gap-3.5 p-5 text-left">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-lg font-extrabold text-sky-700">
                  {c.name.replace("Class ", "C").replace("Nursery", "N").replace("KG", "K")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-extrabold">{c.name}</span>
                  <span className="block text-xs font-semibold text-slate-500">{c.students} students · {c.sections.length} sections</span>
                </span>
                <ArrowRight className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden />
              </button>

              {expanded && (
                <div className="space-y-2.5 border-t border-[#E2E8F0] bg-slate-50/60 p-4">
                  <p className="flex items-center gap-4 text-[12.5px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden />{c.students} students</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" aria-hidden />{c.subjectCount} subjects</span>
                    <span className="flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" aria-hidden />{c.teacher}</span>
                  </p>
                  {c.sections.map((s) => (
                    <div key={s.name} className="flex items-center gap-3 rounded-xl bg-white p-3">
                      <Avatar name={teacherOf(c.name, s.name)} size="h-9 w-9 text-xs" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold">Section {s.name}</p>
                        <p className="truncate text-xs font-semibold text-slate-500">{s.count} students · {teacherOf(c.name, s.name)}</p>
                      </div>
                      <button onClick={() => setAssignFor({ cls: c.name, sec: s.name })} aria-label={`Assign teacher to ${c.name} section ${s.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100">
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  ))}
                  <Link href="/admin/students" className="block rounded-xl bg-[#24324A] py-2.5 text-center text-[13px] font-bold text-white">
                    View Students
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {assignFor && (
        <Modal title={`Assign Teacher · ${assignFor.cls} – ${assignFor.sec}`} onClose={() => setAssignFor(null)}>
          <form onSubmit={saveAssign} className="space-y-4">
            <Field label="Class teacher">
              <select value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className={inputCls} required>
                <option value="">Select a teacher…</option>
                {teachers.slice(0, 40).map((t) => <option key={t.id} value={t.name}>{t.name} · {t.subject}</option>)}
              </select>
            </Field>
            <button type="submit" className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-white hover:bg-sky-500">Assign Teacher</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
