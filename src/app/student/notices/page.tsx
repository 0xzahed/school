"use client";

import { Bell, Pin } from "lucide-react";
import { PageHeader, Badge, Empty, Avatar } from "@/components/admin/ui";
import { useMe } from "@/components/student/useMe";
import { cn } from "@/lib/utils";

export default function StudentNotices() {
  const { me, admin } = useMe();
  if (!me) return <Empty title="Loading notices..." />;

  const list = [...admin.noticeList]
    .filter((x) => x.status === "Published")
    .filter((x) => ["Everyone", "Students", "Parents"].includes(x.audience) || x.audience === me.class)
    .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));

  return (
    <div className="space-y-4">
      <PageHeader title="School Notices" sub="Announcements for you and your parents" />
      {list.length === 0 ? <Empty title="No notices right now." /> : (
        <ul className="space-y-2.5">
          {list.map((x) => (
            <li key={x.id} className={cn("flex gap-3.5 rounded-2xl border bg-white p-4 sm:p-5", x.pinned ? "border-amber-300" : "border-[#E2E8F0]")}>
              <Avatar name={x.title} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold">
                  <Badge tone="Active">{x.category}</Badge>
                  <span className="font-semibold text-slate-400">{x.date}</span>
                  {x.pinned && <span className="flex items-center gap-1 text-amber-600"><Pin className="h-3 w-3" aria-hidden />Pinned</span>}
                </p>
                <h2 className="mt-1 text-[15px] font-extrabold">{x.title}</h2>
                <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{x.description}</p>
              </div>
              <Bell className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
