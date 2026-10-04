"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  students as baseStudents, teachers as baseTeachers, books as baseBooks, loans as baseLoans,
  invoices as baseInvoices, payments as basePayments, expenses as baseExpenses,
  homeworkSeeds, exams as baseExams, examSlots as baseExamSlots,
  applications as baseApplications, messages as baseMessages, notices as baseNotices,
  schoolEvents as baseEvents, staffUsers as baseUsers, activitySeeds, seedHolidays,
  type Student, type Teacher, type Book, type Loan, type Invoice, type Payment,
  type Expense, type Homework, type Exam, type ExamSlot, type Application,
  type Notice, type SchoolEvent, type Message, type Notification, type StaffUser,
  type ActivityItem, type AttStatus, type Holiday,
} from "@/data/sms";
import { getInboxApplications, getInboxMessages } from "@/lib/inbox";

/* ------------------------------ persistence ------------------------------- */
function load<T>(key: string, fallback: () => T): T {
  if (typeof window === "undefined") return fallback();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
    const v = fallback();
    localStorage.setItem(key, JSON.stringify(v));
    return v;
  } catch {
    return fallback();
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/* --------------------------------- toasts ---------------------------------- */
export type Toast = { id: number; message: string; tone: "success" | "error" | "info" | "warning" };
let toastId = 1;

/* --------------------------------- context --------------------------------- */
export type AppStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

type AdminValue = {
  // data
  students: Student[];
  teachers: Teacher[];
  books: Book[];
  loans: Loan[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  homework: Homework[];
  examList: Exam[];
  examSlots: ExamSlot[];
  applications: Application[];
  messages: Message[];
  noticeList: Notice[];
  eventList: SchoolEvent[];
  users: StaffUser[];
  notifications: Notification[];
  holidays: Holiday[];
  activity: ActivityItem[];
  attendance: Record<string, Record<string, AttStatus>>;
  appStatus: Record<string, AppStatus>;
  msgRead: string[];
  removedMsgs: string[];
  publishedResults: string[];
  website: WebsiteContent;
  settings: Settings;
  // actions
  toast: (message: string, tone?: Toast["tone"]) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  log: (action: string, module: string, user?: string) => void;
  addStudent: (s: Student) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  addTeacher: (t: Teacher) => void;
  updateTeacher: (id: string, patch: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;
  setDayAttendance: (key: string, rec: Record<string, AttStatus>) => void;
  addHomework: (h: Homework) => void;
  removeHomework: (id: string) => void;
  recordPayment: (invoiceNo: string, amount: number, method: string, date: string) => void;
  addExpense: (e: Expense) => void;
  removeExpense: (id: string) => void;
  setAppStatus: (id: string, s: AppStatus) => void;
  addNotice: (n: Notice) => void;
  updateNotice: (id: string, patch: Partial<Notice>) => void;
  removeNotice: (id: string) => void;
  addEvent: (e: SchoolEvent) => void;
  updateEvent: (id: string, patch: Partial<SchoolEvent>) => void;
  removeEvent: (id: string) => void;
  markRead: (id: string) => void;
  removeMessage: (id: string) => void;
  sendMessage: (m: Message) => void;
  sendNotification: (n: Notification) => void;
  addHoliday: (h: Holiday) => void;
  updateHoliday: (id: string, patch: Partial<Holiday>) => void;
  removeHoliday: (id: string) => void;
  issueBook: (bookId: string, studentId: string, due: string) => void;
  returnBook: (loanId: string) => void;
  addExamSlot: (s: ExamSlot) => void;
  publishResult: (key: string) => void;
  unpublishResult: (key: string) => void;
  setUserRole: (id: string, role: string) => void;
  toggleUserStatus: (id: string) => void;
  updateWebsite: (patch: Partial<WebsiteContent>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
};

export type WebsiteContent = {
  heroTitle: string;
  heroSub: string;
  aboutText: string;
  statStudents: string;
  statTeachers: string;
  notice: string;
};

export type Settings = {
  schoolName: string;
  phone: string;
  email: string;
  address: string;
  year: string;
  currency: string;
  weeklyHoliday: number;
  emailNotif: boolean;
  smsNotif: boolean;
  pushNotif: boolean;
  twoFA: boolean;
};

const defaultWebsite: WebsiteContent = {
  heroTitle: "Let's Learn, Play & Grow Together!",
  heroSub: "Where every child discovers curiosity, builds confidence and grows into their brightest self.",
  aboutText: "Since 2011 we blend strong academics with play, art and exploration.",
  statStudents: "1248",
  statTeachers: "86",
  notice: "Admissions open for 2027 — Nursery to Class 9.",
};
const defaultSettings: Settings = {
  schoolName: "Sunshine Valley School",
  phone: "(555) 123-4567",
  email: "hello@sunshinevalley.school",
  address: "12 Rainbow Road, Green Meadows, Springfield",
  year: "2026",
  currency: "BDT (৳)",
  weeklyHoliday: 5,
  emailNotif: true,
  smsNotif: true,
  pushNotif: false,
  twoFA: false,
};

const AdminContext = createContext<AdminValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = toastId++;
    setToasts((p) => [...p, { id, message, tone }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3600);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const [activity, setActivity] = useState<ActivityItem[]>(() => load("sms_activity", () => activitySeeds));
  const log = useCallback((action: string, module: string, user?: string) => {
    const u = user ?? (typeof window !== "undefined" ? localStorage.getItem("sv_user") || "Admin" : "Admin");
    setActivity((prev) => {
      const next = [{ id: `A-${Date.now()}`, user: u, action, module, time: "Just now" }, ...prev].slice(0, 60);
      save("sms_activity", next);
      return next;
    });
  }, []);

  /* students: base + diffs */
  const [addedStudents, setAddedStudents] = useState<Student[]>(() => load("sms_added_students", () => [] as Student[]));
  const [updatedStudents, setUpdatedStudents] = useState<Record<string, Partial<Student>>>(() => load("sms_updated_students", () => ({} as Record<string, Partial<Student>>)));
  const [deletedStudents, setDeletedStudents] = useState<string[]>(() => load("sms_deleted_students", () => [] as string[]));
  const students = useMemo(() => {
    const base = baseStudents.filter((s) => !deletedStudents.includes(s.id)).map((s) => ({ ...s, ...(updatedStudents[s.id] ?? {}) }));
    return [...addedStudents, ...base];
  }, [addedStudents, updatedStudents, deletedStudents]);

  const addStudent = useCallback((s: Student) => {
    setAddedStudents((p) => { const n = [s, ...p]; save("sms_added_students", n); return n; });
  }, []);
  const updateStudent = useCallback((id: string, patch: Partial<Student>) => {
    setAddedStudents((p) => {
      if (p.some((s) => s.id === id)) {
        const n = p.map((s) => (s.id === id ? { ...s, ...patch } : s));
        save("sms_added_students", n);
        return n;
      }
      return p;
    });
    setUpdatedStudents((p) => { const n = { ...p, [id]: { ...(p[id] ?? {}), ...patch } }; save("sms_updated_students", n); return n; });
  }, []);
  const removeStudent = useCallback((id: string) => {
    setAddedStudents((p) => { const n = p.filter((s) => s.id !== id); save("sms_added_students", n); return n; });
    setDeletedStudents((p) => { const n = [...p, id]; save("sms_deleted_students", n); return n; });
  }, []);

  /* teachers: base + diffs */
  const [addedTeachers, setAddedTeachers] = useState<Teacher[]>(() => load("sms_added_teachers", () => [] as Teacher[]));
  const [updatedTeachers, setUpdatedTeachers] = useState<Record<string, Partial<Teacher>>>(() => load("sms_updated_teachers", () => ({} as Record<string, Partial<Teacher>>)));
  const [deletedTeachers, setDeletedTeachers] = useState<string[]>(() => load("sms_deleted_teachers", () => [] as string[]));
  const teachers = useMemo(() => {
    const base = baseTeachers.filter((t) => !deletedTeachers.includes(t.id)).map((t) => ({ ...t, ...(updatedTeachers[t.id] ?? {}) }));
    return [...addedTeachers, ...base];
  }, [addedTeachers, updatedTeachers, deletedTeachers]);
  const addTeacher = useCallback((t: Teacher) => {
    setAddedTeachers((p) => { const n = [t, ...p]; save("sms_added_teachers", n); return n; });
  }, []);
  const updateTeacher = useCallback((id: string, patch: Partial<Teacher>) => {
    setAddedTeachers((p) => (p.some((t) => t.id === id) ? (() => { const n = p.map((t) => (t.id === id ? { ...t, ...patch } : t)); save("sms_added_teachers", n); return n; })() : p));
    setUpdatedTeachers((p) => { const n = { ...p, [id]: { ...(p[id] ?? {}), ...patch } }; save("sms_updated_teachers", n); return n; });
  }, []);
  const removeTeacher = useCallback((id: string) => {
    setAddedTeachers((p) => { const n = p.filter((t) => t.id !== id); save("sms_added_teachers", n); return n; });
    setDeletedTeachers((p) => { const n = [...p, id]; save("sms_deleted_teachers", n); return n; });
  }, []);

  /* small entities: snapshots */
  const [books, setBooks] = useState<Book[]>(() => load("sms_books", () => baseBooks));
  const [loans, setLoans] = useState<Loan[]>(() => load("sms_loans", () => baseLoans));
  const [invoices, setInvoices] = useState<Invoice[]>(() => load("sms_invoices", () => baseInvoices));
  const [payments, setPayments] = useState<Payment[]>(() => load("sms_payments", () => basePayments));
  const [expenses, setExpenses] = useState<Expense[]>(() => load("sms_expenses", () => baseExpenses));
  const [homework, setHomework] = useState<Homework[]>(() => load("sms_homework", () => homeworkSeeds));
  const [examList] = useState<Exam[]>(baseExams);
  const [examSlots, setExamSlots] = useState<ExamSlot[]>(() => load("sms_examslots", () => baseExamSlots));
  const [attendance, setAttendance] = useState<Record<string, Record<string, AttStatus>>>(() => load("sms_attendance", () => ({})));
  const [appStatus, setAppStatusState] = useState<Record<string, AppStatus>>(() => load("sms_app_status", () => ({})));
  const [msgRead, setMsgRead] = useState<string[]>(() => load("sms_msg_read", () => ["M-04"] as string[]));
  const [removedMsgs, setRemovedMsgs] = useState<string[]>(() => load("sms_removed_msgs", () => [] as string[]));
  const [sentMsgs, setSentMsgs] = useState<Message[]>(() => load("sms_sent", () => [] as Message[]));
  const [extraNotices, setExtraNotices] = useState<Notice[]>(() => load("sms_notices", () => [] as Notice[]));
  const [goneNotices, setGoneNotices] = useState<string[]>(() => load("sms_gone_notices", () => [] as string[]));
  const [noticeEdits, setNoticeEdits] = useState<Record<string, Partial<Notice>>>(() => load("sms_notice_edits", () => ({})));
  const [extraEvents, setExtraEvents] = useState<SchoolEvent[]>(() => load("sms_events", () => [] as SchoolEvent[]));
  const [goneEvents, setGoneEvents] = useState<string[]>(() => load("sms_gone_events", () => [] as string[]));
  const [eventEdits, setEventEdits] = useState<Record<string, Partial<SchoolEvent>>>(() => load("sms_event_edits", () => ({})));
  const [users, setUsers] = useState<StaffUser[]>(() => load("sms_users", () => baseUsers));
  const [notifications, setNotifications] = useState<Notification[]>(() => load("sms_notifications", () => [
    { id: "NT-01", title: "Sports Day Reminder", message: "Annual Sports Day starts 9 AM at the playground.", audience: "Parents", channel: "SMS", date: "2026-12-18", status: "Sent" },
    { id: "NT-02", title: "Fee Due Reminder", message: "December fees are due by the 10th.", audience: "Parents", channel: "Email", date: "2026-12-05", status: "Sent" },
  ] as Notification[]));
  const [publishedResults, setPublishedResults] = useState<string[]>(() => load("sms_published", () => ["EX-03|Class 6"] as string[]));
  const [holidays, setHolidays] = useState<Holiday[]>(() => load("sms_holidays", () => seedHolidays));
  const [website, setWebsite] = useState<WebsiteContent>(() => load("sms_website", () => defaultWebsite));
  const [settings, setSettings] = useState<Settings>(() => load("sms_settings", () => defaultSettings));

  /* merged views */
  const seenA = new Set<string>();
  const applications: Application[] = [];
  if (typeof window !== "undefined") {
    getInboxApplications().forEach((a) => {
      if (!seenA.has(a.id)) {
        seenA.add(a.id);
        applications.push({ id: a.id, name: a.studentName, class: a.grade, guardian: a.guardian ?? "—", phone: a.phone, email: a.email, date: a.date, school: "—" });
      }
    });
  }
  baseApplications.forEach((a) => {
    if (!seenA.has(a.id)) {
      seenA.add(a.id);
      applications.push(a);
    }
  });

  const seenM = new Set<string>();
  const messages: Message[] = [];
  if (typeof window !== "undefined") {
    getInboxMessages().forEach((m) => {
      if (!seenM.has(m.id) && !removedMsgs.includes(m.id)) {
        seenM.add(m.id);
        messages.push({ id: m.id, from: m.name, email: m.email, subject: m.subject, body: m.message, date: m.date, box: "inbox" });
      }
    });
  }
  [...sentMsgs, ...baseMessages].forEach((m) => {
    if (!seenM.has(m.id) && !removedMsgs.includes(m.id)) {
      seenM.add(m.id);
      messages.push(m);
    }
  });

  const noticeList: Notice[] = [
    ...extraNotices,
    ...baseNotices.filter((n) => !goneNotices.includes(n.id)).map((n) => ({ ...n, ...(noticeEdits[n.id] ?? {}) })),
  ];
  const eventList: SchoolEvent[] = [
    ...extraEvents,
    ...baseEvents.filter((e) => !goneEvents.includes(e.id)).map((e) => ({ ...e, ...(eventEdits[e.id] ?? {}) })),
  ];

  /* actions */
  const setDayAttendance = useCallback((key: string, rec: Record<string, AttStatus>) => {
    setAttendance((p) => { const n = { ...p, [key]: rec }; save("sms_attendance", n); return n; });
  }, []);
  const addHomework = useCallback((h: Homework) => {
    setHomework((p) => { const n = [h, ...p]; save("sms_homework", n); return n; });
  }, []);
  const removeHomework = useCallback((id: string) => {
    setHomework((p) => { const n = p.filter((h) => h.id !== id); save("sms_homework", n); return n; });
  }, []);
  const recordPayment = useCallback((invoiceNo: string, amount: number, method: string, date: string) => {
    setInvoices((p) => {
      const n = p.map((v) => {
        if (v.no !== invoiceNo) return v;
        const paid = Math.min(v.amount, v.paid + amount);
        return { ...v, paid, method, date, status: (paid >= v.amount ? "Paid" : paid > 0 ? "Partial" : "Pending") as Invoice["status"] };
      });
      save("sms_invoices", n);
      return n;
    });
    setPayments((p) => {
      const inv = baseInvoices.find((v) => v.no === invoiceNo);
      const invNow = invoices.find((v) => v.no === invoiceNo);
      const target = invNow ?? inv;
      const n = [{ id: `PAY-${Date.now()}`, invoice: invoiceNo, studentId: target?.studentId ?? "", amount, method, date, status: "Paid" as const }, ...p];
      save("sms_payments", n);
      return n;
    });
  }, [invoices]);
  const addExpense = useCallback((e: Expense) => {
    setExpenses((p) => { const n = [e, ...p]; save("sms_expenses", n); return n; });
  }, []);
  const removeExpense = useCallback((id: string) => {
    setExpenses((p) => { const n = p.filter((e) => e.id !== id); save("sms_expenses", n); return n; });
  }, []);
  const setAppStatus = useCallback((id: string, s: AppStatus) => {
    setAppStatusState((p) => { const n = { ...p, [id]: s }; save("sms_app_status", n); return n; });
  }, []);
  const addNotice = useCallback((n: Notice) => {
    setExtraNotices((p) => { const x = [n, ...p]; save("sms_notices", x); return x; });
  }, []);
  const updateNotice = useCallback((id: string, patch: Partial<Notice>) => {
    setExtraNotices((p) => (p.some((n) => n.id === id) ? (() => { const x = p.map((n) => (n.id === id ? { ...n, ...patch } : n)); save("sms_notices", x); return x; })() : p));
    setNoticeEdits((p) => { const x = { ...p, [id]: { ...(p[id] ?? {}), ...patch } }; save("sms_notice_edits", x); return x; });
  }, []);
  const removeNotice = useCallback((id: string) => {
    setExtraNotices((p) => { const x = p.filter((n) => n.id !== id); save("sms_notices", x); return x; });
    setGoneNotices((p) => { const x = [...p, id]; save("sms_gone_notices", x); return x; });
  }, []);
  const addEvent = useCallback((e: SchoolEvent) => {
    setExtraEvents((p) => { const x = [e, ...p]; save("sms_events", x); return x; });
  }, []);
  const updateEvent = useCallback((id: string, patch: Partial<SchoolEvent>) => {
    setExtraEvents((p) => (p.some((e) => e.id === id) ? (() => { const x = p.map((e) => (e.id === id ? { ...e, ...patch } : e)); save("sms_events", x); return x; })() : p));
    setEventEdits((p) => { const x = { ...p, [id]: { ...(p[id] ?? {}), ...patch } }; save("sms_event_edits", x); return x; });
  }, []);
  const removeEvent = useCallback((id: string) => {
    setExtraEvents((p) => { const x = p.filter((e) => e.id !== id); save("sms_events", x); return x; });
    setGoneEvents((p) => { const x = [...p, id]; save("sms_gone_events", x); return x; });
  }, []);
  const markRead = useCallback((id: string) => {
    setMsgRead((p) => { const x = p.includes(id) ? p : [...p, id]; save("sms_msg_read", x); return x; });
  }, []);
  const removeMessage = useCallback((id: string) => {
    setRemovedMsgs((p) => { const x = [...p, id]; save("sms_removed_msgs", x); return x; });
  }, []);
  const sendMessage = useCallback((m: Message) => {
    setSentMsgs((p) => { const x = [m, ...p]; save("sms_sent", x); return x; });
  }, []);
  const sendNotification = useCallback((n: Notification) => {
    setNotifications((p) => { const x = [n, ...p]; save("sms_notifications", x); return x; });
  }, []);
  const addHoliday = useCallback((h: Holiday) => {
    setHolidays((p) => { const x = [...p, h].sort((a, b) => a.date.localeCompare(b.date)); save("sms_holidays", x); return x; });
  }, []);
  const updateHoliday = useCallback((id: string, patch: Partial<Holiday>) => {
    setHolidays((p) => { const x = p.map((h) => (h.id === id ? { ...h, ...patch } : h)).sort((a, b) => a.date.localeCompare(b.date)); save("sms_holidays", x); return x; });
  }, []);
  const removeHoliday = useCallback((id: string) => {
    setHolidays((p) => { const x = p.filter((h) => h.id !== id); save("sms_holidays", x); return x; });
  }, []);
  const issueBook = useCallback((bookId: string, studentId: string, due: string) => {
    setLoans((p) => { const x = [{ id: `LN-${Date.now()}`, bookId, studentId, issued: new Date().toISOString().slice(0, 10), due, returned: false }, ...p]; save("sms_loans", x); return x; });
    setBooks((p) => { const x = p.map((b) => (b.id === bookId ? { ...b, available: Math.max(0, b.available - 1) } : b)); save("sms_books", x); return x; });
  }, []);
  const returnBook = useCallback((loanId: string) => {
    setLoans((p) => {
      const loan = p.find((l) => l.id === loanId);
      const x = p.map((l) => (l.id === loanId ? { ...l, returned: true } : l));
      save("sms_loans", x);
      if (loan && !loan.returned) {
        setBooks((b) => { const y = b.map((bk) => (bk.id === loan.bookId ? { ...bk, available: bk.available + 1 } : bk)); save("sms_books", y); return y; });
      }
      return x;
    });
  }, []);
  const addExamSlot = useCallback((s: ExamSlot) => {
    setExamSlots((p) => { const x = [...p, s]; save("sms_examslots", x); return x; });
  }, []);
  const publishResult = useCallback((key: string) => {
    setPublishedResults((p) => { const x = p.includes(key) ? p : [...p, key]; save("sms_published", x); return x; });
  }, []);
  const unpublishResult = useCallback((key: string) => {
    setPublishedResults((p) => { const x = p.filter((k) => k !== key); save("sms_published", x); return x; });
  }, []);
  const setUserRole = useCallback((id: string, role: string) => {
    setUsers((p) => { const x = p.map((u) => (u.id === id ? { ...u, role } : u)); save("sms_users", x); return x; });
  }, []);
  const toggleUserStatus = useCallback((id: string) => {
    setUsers((p) => { const x = p.map((u) => (u.id === id ? { ...u, status: (u.status === "Active" ? "Suspended" : "Active") as StaffUser["status"] } : u)); save("sms_users", x); return x; });
  }, []);
  const updateWebsite = useCallback((patch: Partial<WebsiteContent>) => {
    setWebsite((p) => { const x = { ...p, ...patch }; save("sms_website", x); return x; });
  }, []);
  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((p) => { const x = { ...p, ...patch }; save("sms_settings", x); return x; });
  }, []);

  const value: AdminValue = {
    students, teachers, books, loans, invoices, payments, expenses, homework, examList, examSlots,
    applications, messages, noticeList, eventList, users, notifications, holidays, activity, attendance,
    appStatus, msgRead, removedMsgs, publishedResults, website, settings,
    toast, toasts, dismissToast, log,
    addStudent, updateStudent, removeStudent, addTeacher, updateTeacher, removeTeacher,
    setDayAttendance, addHomework, removeHomework, recordPayment, addExpense, removeExpense,
    setAppStatus, addNotice, updateNotice, removeNotice, addEvent, updateEvent, removeEvent,
    markRead, removeMessage, sendMessage, sendNotification, addHoliday, updateHoliday, removeHoliday, issueBook, returnBook,
    addExamSlot, publishResult, unpublishResult, setUserRole, toggleUserStatus,
    updateWebsite, updateSettings,
  };
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

export const statusOfApp = (m: Record<string, AppStatus>, id: string): AppStatus => m[id] ?? "Pending";
