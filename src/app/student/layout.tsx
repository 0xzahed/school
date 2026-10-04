"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminProvider } from "@/components/admin/store";
import StudentShell from "@/components/student/StudentShell";
import { Toaster } from "@/components/admin/ui";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/student/login") {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-[#F8FAFC]">{children}</div>
        <Toaster />
      </AdminProvider>
    );
  }
  return (
    <AdminProvider>
      <StudentShell>{children}</StudentShell>
      <Toaster />
    </AdminProvider>
  );
}
