"use client";

import { useState } from "react";
import { Send, CheckCircle2, FileText, Search, Users, BadgeCheck, Upload, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, Reveal, Eyebrow } from "@/components/ui";
import { saveApplication, todayISO } from "@/lib/inbox";

const steps = [
  { icon: FileText, title: "Submit Application", text: "Fill the form below — it takes about 10 minutes." },
  { icon: Search, title: "Application Review", text: "Our team reviews every application within 5 school days." },
  { icon: Users, title: "Assessment / Interview", text: "A friendly play-based interaction plus a family chat." },
  { icon: BadgeCheck, title: "Admission Confirmation", text: "Welcome aboard! Secure the seat within 7 days." },
];

type Errors = Record<string, string>;

export default function AdmissionPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [refId, setRefId] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Errors = {};
    const req = (k: string, label: string, min = 2) => {
      const v = String(fd.get(k) || "").trim();
      if (v.length < min) next[k] = `${label} is required.`;
    };
    req("studentName", "Student name");
    if (!String(fd.get("dob") || "")) next.dob = "Date of birth is required.";
    if (!String(fd.get("grade") || "")) next.grade = "Please choose a class.";
    req("father", "Father's name");
    req("mother", "Mother's name");
    const phone = String(fd.get("phone") || "").trim();
    if (phone.replace(/\D/g, "").length < 7) next.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get("email") || ""))) next.email = "Please enter a valid email.";
    req("address", "Address", 6);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      const ref = `SV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      saveApplication({
        id: ref,
        studentName: String(fd.get("studentName") || "").trim(),
        grade: String(fd.get("grade") || ""),
        guardian: String(fd.get("father") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        date: todayISO(),
      });
      setRefId(ref);
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const field = "w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-[15px] font-semibold outline-none placeholder:text-ink/30 focus:border-sky-400";
  const label = "text-sm font-extrabold";
  const err = (k: string) => errors[k] && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors[k]}</p>;

  return (
    <>
      <PageHero
        eyebrow="Admissions 2027–28"
        title={<>Start Your Child&apos;s Journey With Us</>}
        description="Nursery to Grade 8 · Limited seats per class · We reply to every application within 5 school days."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admission" }]}
      />

      {/* steps */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="relative h-full rounded-[1.5rem] border border-ink/8 bg-white p-6 shadow-soft">
                  <span className="font-display absolute top-4 right-5 text-4xl font-extrabold text-ink/8">0{i + 1}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100"><s.icon className="h-6 w-6 text-sky-600" aria-hidden /></span>
                  <h3 className="font-display mt-4 font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-[13.5px] text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* form */}
      <section className="pb-16 sm:pb-24">
        <Container className="max-w-4xl">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-ink/8 bg-white shadow-card">
              <div className="bg-ink px-8 py-6 text-white">
                <h2 className="font-display text-2xl font-bold">Application Form</h2>
                <p className="text-sm font-semibold text-white/70">Fields marked * are required. Documents can also be brought to the school office.</p>
              </div>

              {sent ? (
                <div className="px-8 py-14 text-center" role="status">
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden />
                  </span>
                  <h3 className="font-display mt-5 text-3xl font-bold">Application submitted successfully!</h3>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    Thank you! Our admissions team will contact you within 5 school days.
                    Your reference ID is <strong className="text-ink">{refId}</strong> — please keep it safe.
                  </p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button onClick={() => setSent(false)} className="rounded-2xl border-2 border-ink/10 px-6 py-3 font-extrabold hover:border-ink/25">
                      Submit another application
                    </button>
                    <a href="/contact" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-6 py-3 font-extrabold text-white">
                      Contact Admissions <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-8 px-6 py-8 sm:px-10" aria-label="Admission application form">
                  <fieldset>
                    <legend className="flex items-center gap-2"><Eyebrow color="bg-sky-100 text-sky-700">Student information</Eyebrow></legend>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div><label className={label} htmlFor="a-name">Student Name *</label><input id="a-name" name="studentName" className={`${field} mt-1.5`} placeholder="e.g. Lily Anderson" />{err("studentName")}</div>
                      <div><label className={label} htmlFor="a-dob">Date of Birth *</label><input id="a-dob" name="dob" type="date" className={`${field} mt-1.5`} />{err("dob")}</div>
                      <div>
                        <label className={label} htmlFor="a-gender">Gender</label>
                        <select id="a-gender" name="gender" className={`${field} mt-1.5`}><option>Girl</option><option>Boy</option><option>Prefer not to say</option></select>
                      </div>
                      <div>
                        <label className={label} htmlFor="a-grade">Applying for Class *</label>
                        <select id="a-grade" name="grade" defaultValue="" className={`${field} mt-1.5`}>
                          <option value="" disabled>Select a class</option>
                          {["Nursery", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"].map((g) => <option key={g}>{g}</option>)}
                        </select>{err("grade")}
                      </div>
                      <div className="sm:col-span-2"><label className={label} htmlFor="a-prev">Previous School (if any)</label><input id="a-prev" name="prev" className={`${field} mt-1.5`} placeholder="School name (optional)" /></div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend><Eyebrow color="bg-violet-100 text-violet-700">Parent / guardian information</Eyebrow></legend>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div><label className={label} htmlFor="a-father">Father&apos;s Name *</label><input id="a-father" name="father" className={`${field} mt-1.5`} placeholder="Father's full name" />{err("father")}</div>
                      <div><label className={label} htmlFor="a-mother">Mother&apos;s Name *</label><input id="a-mother" name="mother" className={`${field} mt-1.5`} placeholder="Mother's full name" />{err("mother")}</div>
                      <div><label className={label} htmlFor="a-phone">Guardian Phone *</label><input id="a-phone" name="phone" type="tel" className={`${field} mt-1.5`} placeholder="(555) 000-0000" />{err("phone")}</div>
                      <div><label className={label} htmlFor="a-email">Email *</label><input id="a-email" name="email" type="email" className={`${field} mt-1.5`} placeholder="you@example.com" />{err("email")}</div>
                      <div className="sm:col-span-2"><label className={label} htmlFor="a-addr">Address *</label><textarea id="a-addr" name="address" rows={2} className={`${field} mt-1.5 resize-none`} placeholder="Street, area, city" />{err("address")}</div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend><Eyebrow color="bg-emerald-100 text-emerald-700">Documents</Eyebrow></legend>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      {["Student Photo", "Birth Certificate", "Previous Report Card"].map((d) => (
                        <label key={d} className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 bg-cream px-4 py-6 text-center transition-all hover:border-sky-400 hover:bg-sky-50">
                          <Upload className="h-6 w-6 text-sky-500" aria-hidden />
                          <span className="text-[13px] font-extrabold">{d}</span>
                          <span className="text-[11.5px] font-bold text-muted">Click to upload (optional)</span>
                          <input type="file" className="sr-only" aria-label={d} />
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sunny px-6 py-4 text-[16px] font-extrabold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:bg-yellow-300">
                    Submit Application <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </button>
                  <p className="text-center text-[13px] font-semibold text-muted">By submitting, you agree to be contacted about the admission process.</p>
                </form>
              )}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
