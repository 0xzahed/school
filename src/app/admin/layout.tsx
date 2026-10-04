"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminProvider } from "@/components/admin/store";
import Shell from "@/components/admin/Shell";
import { Toaster } from "@/components/admin/ui";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login" || pathname === "/admin/forgot-password") {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-[#F8FAFC]">{children}</div>
        <Toaster />
      </AdminProvider>
    );
  }
  return (
    <AdminProvider>
      <Shell>{children}</Shell>
      <Toaster />
    </AdminProvider>
  );
}
