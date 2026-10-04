/* Central mock-data layer for the School Management System (admin panel).
   Deterministic generation (seeded RNG) + Bangladeshi realistic content. */

export type Role = "super-admin" | "admin" | "teacher" | "accountant" | "librarian" | "admission";

/* ---------------------------------- types ---------------------------------- */
export type Student = {
  id: string;
  name: string;
  class: string;
  section: string;
  roll: number;
  gender: "Male" | "Female";
  dob: string;
  blood: string;
  address: string;
  father: string;
  mother: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  year: string;
};

export type Teacher = {
  id: string;
  name: string;
  department: string;
  subject: string;
  phone: string;
  email: string;
  joining: string;
  salary: number;
  classes: string;
  status: "Active" | "On Leave";
};

export type Book = { id: string; title: string; author: string; isbn: string; category: string; qty: number; available: number };
export type Loan = { id: string; bookId: string; studentId: string; issued: string; due: string; returned: boolean };

export type Invoice = { no: string; studentId: string; head: string; amount: number; paid: number; method: string; date: string; status: "Paid" | "Pending" | "Partial" | "Refunded" };
export type Payment = { id: string; invoice: string; studentId: string; amount: number; method: string; date: string; status: "Paid" | "Pending" | "Partial" | "Refunded" };
export type Expense = { id: string; head: string; amount: number; date: string; by: string; note: string };

export type Homework = { id: string; class: string; section: string; subject: string; title: string; due: string; done: number; total: number; status: "Active" | "Completed" };
export type Exam = { id: string; name: string; year: string; start: string; end: string; classes: string; status: "Upcoming" | "Ongoing" | "Completed" };
export type ExamSlot = { id: string; examId: string; class: string; subject: string; date: string; start: string; end: string; room: string };

export type Application = { id: string; name: string; class: string; guardian: string; phone: string; email: string; date: string; school: string };
export type Notice = { id: string; title: string; category: string; description: string; date: string; expiry: string; audience: string; status: "Published" | "Draft" | "Scheduled"; pinned?: boolean };
export type SchoolEvent = { id: string; name: string; description: string; date: string; start: string; end: string; location: string; category: string; status: "Draft" | "Published" };
export type Message = { id: string; from: string; email: string; subject: string; body: string; date: string; box: "inbox" | "sent" };
export type Notification = { id: string; title: string; message: string; audience: string; channel: string; date: string; status: "Sent" | "Scheduled" };
export type StaffUser = { id: string; name: string; email: string; role: string; status: "Active" | "Suspended"; login: string };
export type ActivityItem = { id: string; user: string; action: string; module: string; time: string };
export type HolidayType = "Government" | "School" | "Religious" | "Observance";
export type Holiday = { id: string; date: string; name: string; type: HolidayType; description: string };

/* ----------------------------------- rng ----------------------------------- */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260704);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));

export const hashStr = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

/* ---------------------------------- names ---------------------------------- */
const maleFirst = ["Rahim", "Sakib", "Tanvir", "Arif", "Hasan", "Fahim", "Nabil", "Rakib", "Shakib", "Imran", "Mehedi", "Sabbir", "Rifat", "Joy", "Shanto", "Tanim", "Rafi", "Siam", "Niloy", "Ashik"];
const femaleFirst = ["Nusrat", "Mim", "Tania", "Priya", "Sadia", "Nabila", "Riya", "Sumaiya", "Tasnim", "Faria", "Maliha", "Anika", "Ishrat", "Lamiya", "Orpa", "Shifa", "Keya", "Dipa", "Rupa", "Eva"];
const last = ["Ahmed", "Hasan", "Rahman", "Akter", "Khan", "Uddin", "Hossain", "Islam", "Chowdhury", "Sarker", "Mondal", "Das", "Ghosh", "Roy", "Talukder", "Miah", "Sheikh", "Karim", "Begum", "Jahan"];
const fathers = ["Karim", "Abdul", "Mohammad", "Harun", "Jamal", "Rashid", "Kamal", "Nasir", "Faruk", "Selim"];
const mothers = ["Salma", "Nasrin", "Shirin", "Rehana", "Fatema", "Ayesha", "Marium", "Jahanara", "Rokeya", "Hasina"];

export const classList = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
export const sections = ["A", "B", "C"];
const bloods = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const areas = ["Mirpur, Dhaka", "Dhanmondi, Dhaka", "Uttara, Dhaka", "Banani, Dhaka", "Wari, Dhaka", "Mohammadpur, Dhaka", "Bashundhara, Dhaka", "Jatrabari, Dhaka"];

/* --------------------------------- students -------------------------------- */
function makeStudents(): Student[] {
  const out: Student[] = [];
  let n = 0;
  const per = [52, 56, 96, 100, 104, 104, 108, 112, 112, 112, 116, 116]; // ≈ 1248
  classList.forEach((cls, ci) => {
    const total = per[ci];
    const perSec = Math.ceil(total / 3);
    sections.forEach((sec, si) => {
      const count = Math.min(perSec, total - si * perSec);
      for (let r = 1; r <= count; r++) {
        n++;
        const female = rnd() < 0.48;
        const fn = female ? pick(femaleFirst) : pick(maleFirst);
        const ln = pick(last);
        const name = `${fn} ${ln}`;
        out.push({
          id: `ST-${10200 + n}`,
          name,
          class: cls,
          section: sec,
          roll: r,
          gender: female ? "Female" : "Male",
          dob: `${int(2009, 2019)}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
          blood: pick(bloods),
          address: pick(areas),
          father: `${pick(fathers)} ${ln}`,
          mother: `${pick(mothers)} ${pick(last)}`,
          phone: `017${String(int(10000000, 99999999))}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}${n}@example.com`,
          status: rnd() < 0.97 ? "Active" : "Inactive",
          year: "2026",
        });
      }
    });
  });
  return out;
}
export const students: Student[] = makeStudents();

/* --------------------------------- teachers -------------------------------- */
const subjects = ["Bangla", "English", "Mathematics", "Science", "ICT", "Social Science", "Religion", "Physical Education", "Art"];
const departments = ["Science", "Mathematics", "Language", "ICT", "Arts", "Sports"];

function makeTeachers(): Teacher[] {
  const out: Teacher[] = [];
  for (let i = 0; i < 86; i++) {
    const female = rnd() < 0.55;
    const name = `${female ? pick(femaleFirst) : pick(maleFirst)} ${pick(last)}`;
    const subject = subjects[i % subjects.length];
    out.push({
      id: `EMP-${1001 + i}`,
      name,
      department: i < 12 ? pick(departments) : departments[hashStr(subject) % departments.length],
      subject,
      phone: `018${String(int(10000000, 99999999))}`,
      email: `${name.split(" ")[0].toLowerCase()}.${(1001 + i)}@school.edu`,
      joining: `${int(2012, 2025)}-${String(int(1, 12)).padStart(2, "0")}-01`,
      salary: int(22000, 68000),
      classes: `Class ${int(1, 10)}`,
      status: rnd() < 0.94 ? "Active" : "On Leave",
    });
  }
  // recognizable leads first
  out[0] = { ...out[0], name: "Sarah Ahmed", subject: "Science", department: "Science" };
  out[1] = { ...out[1], name: "Rahim Khan", subject: "Mathematics", department: "Mathematics" };
  return out;
}
export const teachers: Teacher[] = makeTeachers();

/* ------------------------------ classes/subjects ---------------------------- */
export const classCards = classList.map((c) => {
  const list = students.filter((s) => s.class === c);
  const secs = sections.map((sec) => {
    const inSec = list.filter((s) => s.section === sec);
    const lead = teachers[hashStr(c + sec) % teachers.length];
    return { name: sec, count: inSec.length, teacher: lead.name };
  });
  const ct = teachers[hashStr(c) % teachers.length];
  return { name: c, students: list.length, sections: secs, teacher: ct.name, subjectCount: c === "Nursery" || c === "KG" ? 5 : 9 };
});

export const subjectRows = (() => {
  const rows: Array<{ code: string; name: string; class: string; teacher: string; credit: number; status: string }> = [];
  const subs = ["Bangla", "English", "Mathematics", "Science", "ICT", "Social Science", "Religion", "Physical Education", "Art"];
  classList.forEach((c) => {
    const n = c === "Nursery" || c === "KG" ? 5 : 9;
    for (let i = 0; i < n; i++) {
      const sub = subs[i];
      const t = teachers[(hashStr(c + sub)) % teachers.length];
      rows.push({
        code: `${sub.slice(0, 3).toUpperCase()}-${101 + i}`,
        name: sub,
        class: c,
        teacher: t.name,
        credit: sub === "Mathematics" || sub === "English" ? 4 : 3,
        status: "Active",
      });
    }
  });
  return rows;
})();

/* ------------------------------ routine/slots ------------------------------- */
export const routineDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const routineSlots = [
  { p: "Period 1", time: "08:00 - 08:45" },
  { p: "Period 2", time: "08:45 - 09:30" },
  { p: "Period 3", time: "09:45 - 10:30" },
  { p: "Period 4", time: "10:30 - 11:15" },
  { p: "Period 5", time: "11:30 - 12:15" },
  { p: "Period 6", time: "12:15 - 01:00" },
];
export const routineFor = (cls: string, section: string): string[][] => {
  const pool = ["Bangla", "English", "Mathematics", "Science", "ICT", "Social Science", "Religion", "Physical Education", "Art"];
  const shift = hashStr(cls + section) % pool.length;
  return routineDays.map((_, di) => routineSlots.map((_, pi) => pool[(di + pi + shift) % pool.length]));
};
export const teacherForSubject = (subject: string, cls: string): string => {
  const row = subjectRows.find((r) => r.name === subject && r.class === cls);
  return row ? row.teacher : teachers[hashStr(subject) % teachers.length].name;
};

/* ---------------------------------- library --------------------------------- */
const bookTitles: Array<[string, string, string]> = [
  ["Amar Bangla Boi", "NCTB", "Textbook"], ["English for Today", "NCTB", "Textbook"],
  ["Gonit Shikhi", "Abdul Karim", "Textbook"], ["Bigganer Mojar Khela", "Dr. Nabila Hossain", "Science"],
  ["Harry Potter and the Philosopher's Stone", "J.K. Rowling", "Story"], ["The Little Prince", "Antoine de Saint-Exupéry", "Story"],
  ["Thakurmar Jhuli", "Dakshinaranjan Mitra", "Story"], ["Feluda Samagra", "Satyajit Ray", "Story"],
  ["A Brief History of Time", "Stephen Hawking", "Science"], ["ICT Shohoj Path", "Tanvir Ahmed", "ICT"],
  ["Bangladesher Itihas", "Prof. Salma Khan", "History"], ["Moral Stories for Children", "Various", "Story"],
  ["Mathematics Olympiad Guide", "Rafid Hossain", "Academic"], ["English Grammar in Use", "Raymond Murphy", "Academic"],
];
export const books: Book[] = Array.from({ length: 150 }, (_, i) => {
  const [t, a, c] = bookTitles[i % bookTitles.length];
  const qty = int(2, 12);
  return { id: `BK-${1001 + i}`, title: i < bookTitles.length ? t : `${t} Vol. ${Math.floor(i / bookTitles.length) + 1}`, author: a, isbn: `978-984-${String(10000 + i)}`, category: c, qty, available: Math.max(0, qty - int(0, 3)) };
});
export const loans: Loan[] = Array.from({ length: 30 }, (_, i) => ({
  id: `LN-${5001 + i}`,
  bookId: books[int(0, 60)].id,
  studentId: students[int(0, 900)].id,
  issued: `2026-12-${String(int(1, 24)).padStart(2, "0")}`,
  due: `2026-12-${String(int(25, 31)).padStart(2, "0")}`,
  returned: i % 4 === 0,
}));

/* ------------------------------- fees/finance ------------------------------- */
export const feeHeads = [
  { head: "Admission Fee", amount: 5000 },
  { head: "Monthly Fee", amount: 1500 },
  { head: "Exam Fee", amount: 800 },
  { head: "Transport Fee", amount: 1200 },
  { head: "Library Fee", amount: 300 },
  { head: "Other", amount: 500 },
];
const payMethods = ["Cash", "Bank", "Mobile Banking", "Online Payment"];

export const invoices: Invoice[] = Array.from({ length: 420 }, (_, i) => {
  const st = students[int(0, students.length - 1)];
  const head = pick(feeHeads);
  const r = rnd();
  const status = r < 0.62 ? "Paid" : r < 0.8 ? "Partial" : r < 0.95 ? "Pending" : "Refunded";
  const paid = status === "Paid" ? head.amount : status === "Partial" ? Math.round(head.amount * 0.5) : 0;
  return {
    no: `INV-${2048 + i}`,
    studentId: st.id,
    head: head.head,
    amount: head.amount,
    paid,
    method: paid > 0 ? pick(payMethods) : "—",
    date: `2026-${String(int(7, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
    status,
  };
});

export const payments: Payment[] = invoices
  .filter((v) => v.paid > 0)
  .slice(0, 320)
  .map((v, i) => ({
    id: `PAY-${9001 + i}`,
    invoice: v.no,
    studentId: v.studentId,
    amount: v.paid,
    method: v.method,
    date: v.date,
    status: v.status === "Paid" ? "Paid" : "Partial",
  }));

export const expenses: Expense[] = [
  { id: "EXP-01", head: "Teacher Salaries (Dec)", amount: 1850000, date: "2026-12-05", by: "Accounts", note: "Monthly payroll" },
  { id: "EXP-02", head: "Electricity Bill", amount: 48500, date: "2026-12-08", by: "Accounts", note: "DESCO" },
  { id: "EXP-03", head: "Library Books", amount: 62000, date: "2026-12-10", by: "Librarian", note: "120 new books" },
  { id: "EXP-04", head: "Bus Fuel & Maintenance", amount: 38000, date: "2026-12-12", by: "Transport", note: "3 buses" },
  { id: "EXP-05", head: "Science Lab Equipment", amount: 54000, date: "2026-12-15", by: "Science Dept", note: "Microscopes" },
  { id: "EXP-06", head: "Sports Day Arrangements", amount: 28000, date: "2026-12-18", by: "Sports Dept", note: "Annual sports day" },
];

/* ------------------------------ homework/exams ------------------------------ */
export const homeworkSeeds: Homework[] = [
  { id: "HW-01", class: "Class 6", section: "A", subject: "Mathematics", title: "Exercise 4.2 — Fractions (Q1–Q10)", due: "2026-12-28", done: 28, total: 34, status: "Active" },
  { id: "HW-02", class: "Class 8", section: "B", subject: "English", title: "Paragraph: My Aim in Life", due: "2026-12-29", done: 22, total: 36, status: "Active" },
  { id: "HW-03", class: "Class 5", section: "A", subject: "Bangla", title: "Rochona: Amader Gram", due: "2026-12-27", done: 31, total: 33, status: "Active" },
  { id: "HW-04", class: "Class 9", section: "A", subject: "Science", title: "Chapter 7 MCQ practice", due: "2026-12-26", done: 30, total: 35, status: "Completed" },
  { id: "HW-05", class: "Class 7", section: "C", subject: "ICT", title: "Draw computer parts & label", due: "2026-12-30", done: 12, total: 32, status: "Active" },
];

export const exams: Exam[] = [
  { id: "EX-01", name: "Mid Term Examination", year: "2026", start: "2027-01-12", end: "2027-01-26", classes: "Class 6 – Class 10", status: "Upcoming" },
  { id: "EX-02", name: "Final Examination", year: "2026", start: "2027-04-05", end: "2027-04-22", classes: "All classes", status: "Upcoming" },
  { id: "EX-03", name: "First Term Class Test", year: "2026", start: "2026-10-04", end: "2026-10-12", classes: "Class 1 – Class 10", status: "Completed" },
  { id: "EX-04", name: "Model Test", year: "2026", start: "2026-11-20", end: "2026-11-28", classes: "Class 10", status: "Completed" },
];

export const examSlots: ExamSlot[] = [
  { id: "ES-01", examId: "EX-01", class: "Class 8", subject: "Mathematics", date: "2027-01-12", start: "09:00", end: "12:00", room: "Room 201" },
  { id: "ES-02", examId: "EX-01", class: "Class 8", subject: "English", date: "2027-01-13", start: "09:00", end: "12:00", room: "Room 201" },
  { id: "ES-03", examId: "EX-01", class: "Class 8", subject: "Science", date: "2027-01-14", start: "09:00", end: "12:00", room: "Room 202" },
  { id: "ES-04", examId: "EX-03", class: "Class 6", subject: "Bangla", date: "2026-10-04", start: "09:00", end: "11:00", room: "Room 105" },
  { id: "ES-05", examId: "EX-03", class: "Class 6", subject: "Mathematics", date: "2026-10-05", start: "09:00", end: "11:00", room: "Room 105" },
];

export const marksFor = (studentId: string, subject: string, examId = "EX-03"): { written: number; mcq: number; total: number } => {
  const h = hashStr(studentId + "|" + subject + "|" + examId);
  const written = 38 + (h % 30);
  const mcq = 12 + (h % 16);
  return { written, mcq, total: Math.min(100, written + mcq) };
};
export const gradeFor = (t: number) => (t >= 80 ? "A+" : t >= 70 ? "A" : t >= 60 ? "A-" : t >= 50 ? "B" : t >= 40 ? "C" : "F");

/* --------------------------- applications/messages -------------------------- */
export const applications: Application[] = Array.from({ length: 48 }, (_, i) => {
  const female = rnd() < 0.5;
  const name = `${female ? pick(femaleFirst) : pick(maleFirst)} ${pick(last)}`;
  return {
    id: `APP-${3100 + i}`,
    name,
    class: pick(["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"]),
    guardian: `${pick(fathers)} ${pick(last)}`,
    phone: `019${String(int(10000000, 99999999))}`,
    email: `guardian${3100 + i}@example.com`,
    date: `2026-12-${String(int(10, 26)).padStart(2, "0")}`,
    school: rnd() < 0.6 ? "Greenfield Kindergarten" : "—",
  };
});

export const messages: Message[] = [
  { id: "M-01", from: "Hannah Cole", email: "hannah@example.com", subject: "Admission enquiry", body: "Hello, I would like to book a campus tour for next Tuesday with my child. What time do tours start?", date: "2026-12-22", box: "inbox" },
  { id: "M-02", from: "Imran Sheikh", email: "imran@example.com", subject: "Bus service from Lakeview?", body: "Is school bus service available from the Lakeview area? And what is the quarterly fee for Class 2?", date: "2026-12-23", box: "inbox" },
  { id: "M-03", from: "Julia Martins", email: "julia@example.com", subject: "Visit before applying", body: "We are moving nearby in January. Can we visit the kindergarten classrooms before applying?", date: "2026-12-24", box: "inbox" },
  { id: "M-04", from: "Office", email: "office@school.edu", subject: "Winter concert invitation", body: "Dear parents, you are warmly invited to the winter concert on Dec 22 at 5:30 PM.", date: "2026-12-20", box: "sent" },
];

export const notices: Notice[] = [
  { id: "N-01", title: "Admissions Open for 2027", category: "Admissions", description: "Applications for Nursery to Class 9 are now open. Limited seats per class.", date: "Dec 02, 2026", expiry: "Mar 31, 2027", audience: "Everyone", status: "Published", pinned: true },
  { id: "N-02", title: "Mid Term Exam Routine Published", category: "Exams", description: "The mid term timetable for Class 6–10 is available on the portal.", date: "Dec 10, 2026", expiry: "Jan 27, 2027", audience: "Students", status: "Published" },
  { id: "N-03", title: "Winter Vacation: Dec 24 – Jan 04", category: "Holiday", description: "School reopens on Jan 05. Happy holidays to every family.", date: "Dec 15, 2026", expiry: "Jan 05, 2027", audience: "Everyone", status: "Published" },
  { id: "N-04", title: "Parent-Teacher Meeting on Jan 10", category: "Parents", description: "Meet class teachers and review first-term progress together.", date: "Dec 18, 2026", expiry: "Jan 10, 2027", audience: "Parents", status: "Scheduled" },
  { id: "N-05", title: "Library Week Draft", category: "General", description: "Draft plan for library week activities.", date: "Dec 20, 2026", expiry: "Feb 01, 2027", audience: "Students", status: "Draft" },
];

export const schoolEvents: SchoolEvent[] = [
  { id: "E-01", name: "Annual Sports Day", description: "Races, relays and medals for every young athlete.", date: "2026-12-20", start: "09:00", end: "13:00", location: "School Playground", category: "Sports", status: "Published" },
  { id: "E-02", name: "Science Fair", description: "Student-built models and experiments for the whole family.", date: "2027-01-14", start: "10:00", end: "15:00", location: "Innovation Hall", category: "Academic", status: "Published" },
  { id: "E-03", name: "Winter Music Concert", description: "Choir and orchestra night under lights.", date: "2026-12-22", start: "17:30", end: "20:00", location: "Auditorium", category: "Cultural", status: "Published" },
  { id: "E-04", name: "Book Fair (Draft)", description: "Three-day book fair with local publishers.", date: "2027-02-08", start: "09:00", end: "16:00", location: "Main Field", category: "Academic", status: "Draft" },
];

/* ------------------------------ users/activity ------------------------------ */
export const staffUsers: StaffUser[] = [
  { id: "U-01", name: "Amelia Hart", email: "admin@school.edu", role: "Super Admin", status: "Active", login: "Today, 08:42" },
  { id: "U-02", name: "Sarah Ahmed", email: "sarah@school.edu", role: "Teacher", status: "Active", login: "Today, 08:15" },
  { id: "U-03", name: "Robert Dutta", email: "accounts@school.edu", role: "Accountant", status: "Active", login: "Today, 09:02" },
  { id: "U-04", name: "Nadia Hossain", email: "nadia@school.edu", role: "Teacher", status: "Active", login: "Yesterday, 16:40" },
  { id: "U-05", name: "Kamal Uddin", email: "library@school.edu", role: "Librarian", status: "Active", login: "Today, 08:30" },
  { id: "U-06", name: "Farhana Eve", email: "admission@school.edu", role: "Admission Officer", status: "Active", login: "Today, 09:20" },
  { id: "U-07", name: "Tanvir Hasan", email: "tanvir@school.edu", role: "Teacher", status: "Suspended", login: "Dec 20, 2026" },
];

export const permissionMatrix: Array<{ module: string; perms: Record<string, boolean[]> }> = [
  { module: "Students", perms: { "Super Admin": [true, true, true, true], Admin: [true, true, true, true], Teacher: [true, false, true, false], Accountant: [true, false, false, false], Librarian: [true, false, false, false] } },
  { module: "Teachers", perms: { "Super Admin": [true, true, true, true], Admin: [true, true, true, false], Teacher: [true, false, false, false], Accountant: [false, false, false, false], Librarian: [false, false, false, false] } },
  { module: "Fees", perms: { "Super Admin": [true, true, true, true], Admin: [true, true, true, false], Teacher: [false, false, false, false], Accountant: [true, true, true, false], Librarian: [false, false, false, false] } },
  { module: "Results", perms: { "Super Admin": [true, true, true, true], Admin: [true, true, true, false], Teacher: [true, true, true, false], Accountant: [false, false, false, false], Librarian: [false, false, false, false] } },
  { module: "Library", perms: { "Super Admin": [true, true, true, true], Admin: [true, true, true, false], Teacher: [true, false, false, false], Accountant: [false, false, false, false], Librarian: [true, true, true, true] } },
  { module: "Website", perms: { "Super Admin": [true, true, true, true], Admin: [true, true, true, true], Teacher: [false, false, false, false], Accountant: [false, false, false, false], Librarian: [false, false, false, false] } },
];

export const activitySeeds: ActivityItem[] = [
  { id: "A-01", user: "Amelia Hart", action: "Admitted new student Nusrat Jahan to Class 6", module: "Admissions", time: "10 minutes ago" },
  { id: "A-02", user: "Robert Dutta", action: "Recorded fee payment #INV-2091 (৳1,500)", module: "Finance", time: "25 minutes ago" },
  { id: "A-03", user: "Amelia Hart", action: "Published notice: Annual Sports Day", module: "Notices", time: "1 hour ago" },
  { id: "A-04", user: "Sarah Ahmed", action: "Submitted Class 8 attendance (94%)", module: "Attendance", time: "2 hours ago" },
  { id: "A-05", user: "Kamal Uddin", action: "Issued 12 books to Class 7 students", module: "Library", time: "3 hours ago" },
  { id: "A-06", user: "Sarah Ahmed", action: "Published Class 8 Mid Term results", module: "Results", time: "Yesterday" },
];

/* ------------------------------ dashboard series ---------------------------- */
export const growthSeries = [
  { m: "Jan", students: 1085 }, { m: "Feb", students: 1112 }, { m: "Mar", students: 1140 },
  { m: "Apr", students: 1175 }, { m: "May", students: 1210 }, { m: "Jun", students: 1248 },
];
export const attendanceSeries = [
  { d: "Sat", present: 1150, absent: 60, late: 38 }, { d: "Sun", present: 0, absent: 0, late: 0 },
  { d: "Mon", present: 1180, absent: 42, late: 26 }, { d: "Tue", present: 1165, absent: 55, late: 28 },
  { d: "Wed", present: 1192, absent: 36, late: 20 }, { d: "Thu", present: 1084, absent: 92, late: 72 },
];
export const collectionSeries = [
  { m: "Jan", amount: 612000 }, { m: "Feb", amount: 688000 }, { m: "Mar", amount: 745000 },
  { m: "Apr", amount: 701000 }, { m: "May", amount: 792000 }, { m: "Jun", amount: 845000 },
];
export const distribution = [
  { name: "Primary (1–5)", value: 512, color: "#38BDF8" },
  { name: "Secondary (6–8)", value: 428, color: "#A78BFA" },
  { name: "Higher Sec (9–10)", value: 308, color: "#FACC15" },
];

/* ------------------------------ holidays (full year) -------------------------- */
/* Lunar (marked *) dates are approximate. */
export const seedHolidays: Holiday[] = [
  { id: "H-01", date: "2026-02-04", name: "Shab-e-Barat *", type: "Religious", description: "Night of forgiveness — school closed." },
  { id: "H-02", date: "2026-02-21", name: "Shaheed Day & Mother Language Day", type: "Government", description: "International Mother Language Day — school closed, morning procession." },
  { id: "H-03", date: "2026-03-16", name: "Shab-e-Qadr *", type: "Religious", description: "Night of Decree — school closed." },
  { id: "H-04", date: "2026-03-19", name: "Eid-ul-Fitr Holiday *", type: "Government", description: "Eid holidays begin." },
  { id: "H-05", date: "2026-03-20", name: "Eid-ul-Fitr *", type: "Government", description: "Eid Mubarak! School closed." },
  { id: "H-06", date: "2026-03-21", name: "Eid-ul-Fitr Holiday *", type: "Government", description: "Eid holidays continue." },
  { id: "H-07", date: "2026-03-26", name: "Independence Day", type: "Government", description: "National Independence Day — flag hoisting at school." },
  { id: "H-08", date: "2026-04-14", name: "Pohela Boishakh", type: "Government", description: "Bengali New Year 1433 — Mongol Shobhajatra." },
  { id: "H-09", date: "2026-05-01", name: "May Day", type: "Government", description: "International Workers' Day." },
  { id: "H-10", date: "2026-05-12", name: "Buddha Purnima *", type: "Religious", description: "Birth of Gautam Buddha — school closed." },
  { id: "H-11", date: "2026-05-27", name: "Eid-ul-Azha *", type: "Government", description: "Festival of Sacrifice — school closed." },
  { id: "H-12", date: "2026-05-28", name: "Eid-ul-Azha Holiday *", type: "Government", description: "Eid holidays continue." },
  { id: "H-13", date: "2026-06-26", name: "Holy Ashura *", type: "Religious", description: "School closed." },
  { id: "H-14", date: "2026-07-13", name: "Summer Break", type: "School", description: "Mid-year break — no classes." },
  { id: "H-15", date: "2026-07-14", name: "Summer Break", type: "School", description: "Mid-year break — no classes." },
  { id: "H-16", date: "2026-08-27", name: "Eid-e-Miladunnabi *", type: "Religious", description: "Birth of Prophet Muhammad (PBUH)." },
  { id: "H-17", date: "2026-09-04", name: "Janmashtami *", type: "Religious", description: "Birth of Lord Krishna — school closed." },
  { id: "H-18", date: "2026-10-20", name: "Durga Puja (Bijoya Dashami) *", type: "Religious", description: "School closed." },
  { id: "H-19", date: "2026-12-16", name: "Victory Day", type: "Government", description: "National Victory Day — parade and cultural program." },
  { id: "H-20", date: "2026-12-24", name: "Winter Vacation", type: "School", description: "Winter break begins — no classes." },
  { id: "H-21", date: "2026-12-25", name: "Christmas Day", type: "Government", description: "School closed." },
  { id: "H-22", date: "2026-12-27", name: "Winter Vacation", type: "School", description: "Winter break — no classes." },
  { id: "H-23", date: "2026-12-28", name: "Winter Vacation", type: "School", description: "Winter break — no classes." },
  { id: "H-24", date: "2026-12-29", name: "Winter Vacation", type: "School", description: "Winter break — no classes." },
  { id: "H-25", date: "2026-12-30", name: "Winter Vacation", type: "School", description: "Winter break — no classes." },
  { id: "H-26", date: "2026-12-31", name: "Winter Vacation", type: "School", description: "Winter break — last day of the year." },
];

export const holidayTypeStyle: Record<HolidayType, string> = {
  Government: "bg-red-100 text-red-600",
  School: "bg-sky-100 text-sky-700",
  Religious: "bg-emerald-100 text-emerald-700",
  Observance: "bg-amber-100 text-amber-700",
};
export const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* --------------------------------- helpers ---------------------------------- */
export const tk = (n: number) => `৳${n.toLocaleString("en-IN")}`;
export const todayISO = () => new Date().toISOString().slice(0, 10);

const avatarColors = ["bg-sky-100 text-sky-700", "bg-violet-100 text-violet-700", "bg-pink-100 text-pink-700", "bg-emerald-100 text-emerald-700", "bg-orange-100 text-orange-700", "bg-yellow-100 text-yellow-800"];
export const avatarColor = (name: string) => avatarColors[hashStr(name) % avatarColors.length];
export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

export type AttStatus = "P" | "A" | "L";
export function pastStatus(dateISO: string, studentId: string, extraHolidays?: Set<string>, weeklyOff = 5): AttStatus | "H" {
  const d = new Date(dateISO + "T00:00:00");
  if (d.getDay() === weeklyOff) return "H"; // weekly holiday (Friday by default)
  if (extraHolidays?.has(dateISO)) return "H";
  const h = hashStr(dateISO + "|" + studentId) % 100;
  if (h < 90) return "P";
  if (h < 95) return "L";
  return "A";
}

export const studentById = (id: string) => students.find((s) => s.id === id);
export const bookById = (id: string) => books.find((b) => b.id === id);
