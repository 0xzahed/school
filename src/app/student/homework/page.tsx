"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { PageHeader, Badge, Empty, Progress } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { cn } from "@/lib/utils";

export default function StudentHomework() {
  const { me, admin } = useMe();
  const [done, setDone] = useState<string[]>([]);
  if (!me) return <Empty title="Loading homework..." />;

  const list = admin.homework.filter((h) => h.class === me.class);
  const toggle = (id: string) => setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="space-y-4">
      <PageHeader title="My Homework" sub={`${done.length}/${list.length} marked done by you`} />
      {list.length === 0 ? <Empty title="No homework right now. Enjoy!" /> : (
        <ul className="space-y-2.5">
          {list.map((h) => {
            const isDone = done.includes(h.id);
            return (
              <li key={h.id}>
                <button onClick={() => toggle(h.id)} aria-pressed={isDone}
                  className={cn("flex w-full items-center gap-3.5 rounded-2xl border bg-white p-4 text-left transition-all",
                    isDone ? "border-emerald-200 bg-emerald-50/50" : "border-[#E2E8F0] hover:border-sky-300")}>
                  {isDone
                    ? <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" aria-hidden />
                    : <Circle className="h-6 w-6 shrink-0 text-slate-300" aria-hidden />}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-extrabold", isDone && "text-slate-400 line-through")}>{h.title}</span>
                    <span className="block text-xs font-semibold text-slate-500">{h.subject} · {h.class}-{h.section} · due {h.due}</span>
                    <span className="mt-1.5 block max-w-xs"><Progress value={(h.done / h.total) * 100} color="bg-sky-400" /></span>
                  </span>
                  <Badge tone={h.status}>{h.status}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-center text-xs font-semibold text-slate-400">Tap a card to mark it done — your teacher sees class progress.</p>
    </div>
  );
}
