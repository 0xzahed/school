"use client";

import { PageHeader, Avatar, Empty } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/store";

const moduleColor: Record<string, string> = {
  Finance: "bg-emerald-100 text-emerald-700", Results: "bg-amber-100 text-amber-700",
  Notices: "bg-sky-100 text-sky-700", Library: "bg-violet-100 text-violet-700",
  Students: "bg-blue-100 text-blue-700", Admissions: "bg-orange-100 text-orange-700",
};

export default function ActivityPage() {
  const { activity } = useAdmin();

  return (
    <div className="space-y-4">
      <PageHeader title="Activity Log" sub="Every important action, who did it and when" />

      {activity.length === 0 ? <Empty title="No activity yet." /> : (
        <ol className="relative space-y-0 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
          {activity.map((x, i) => (
            <li key={x.id} className={`relative flex gap-4 pb-6 last:pb-0 ${i < activity.length - 1 ? "before:absolute before:top-10 before:bottom-0 before:left-[22px] before:w-px before:bg-slate-200" : ""}`}>
              <Avatar name={x.user} />
              <div className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-bold">{x.action}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>{x.user}</span>·<span>{x.time}</span>·
                  <span className={`rounded-full px-2 py-0.5 font-extrabold ${moduleColor[x.module] ?? "bg-slate-200 text-slate-600"}`}>{x.module}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
