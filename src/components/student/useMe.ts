"use client";

import { useAdmin } from "../admin/store";

/** Current signed-in student (guarded by StudentShell). */
export function useMe() {
  const admin = useAdmin();
  const sid = typeof window !== "undefined" ? localStorage.getItem("sv_student_id") : null;
  const me = admin.students.find((s) => s.id === sid);
  return { me, admin };
}
