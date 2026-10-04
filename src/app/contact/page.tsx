"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Siren } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, Reveal, Eyebrow } from "@/components/ui";
import { saveMessage, todayISO } from "@/lib/inbox";

const info = [
  { icon: MapPin, title: "School Address", lines: ["12 Rainbow Road, Green Meadows", "Springfield 40210"], bg: "bg-sky-100", c: "text-sky-600" },
  { icon: Phone, title: "Phone", lines: ["(555) 123-4567", "Mon–Fri, 8 AM – 4 PM"], bg: "bg-emerald-100", c: "text-emerald-600" },
  { icon: Mail, title: "Email", lines: ["hello@sunshinevalley.school", "admissions@sunshinevalley.school"], bg: "bg-violet-100", c: "text-violet-600" },
  { icon: Clock, title: "Office Hours", lines: ["Mon–Fri · 8:00 AM – 4:00 PM", "Sat · 9:00 AM – 12:00 PM"], bg: "bg-yellow-100", c: "text-yellow-700" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(fd.get("name") || "").trim().length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get("email") || ""))) next.email = "Please enter a valid email.";
    if (String(fd.get("message") || "").trim().length < 10) next.message = "Please write at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      saveMessage({
        id: `M-${Date.now()}`,
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        subject: String(fd.get("subject") || "General enquiry"),
        message: String(fd.get("message") || "").trim(),
        date: todayISO(),
      });
      setSent(true);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Come Say Hello — We&apos;d Love to Meet You</>}
        description="Visits, questions or just a hello — our friendly office team replies within one school day."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {info.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <div className="h-full rounded-[1.5rem] border border-ink/8 bg-white p-6 shadow-soft">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${r.bg}`}><r.icon className={`h-6 w-6 ${r.c}`} aria-hidden /></span>
                  <h2 className="font-display mt-4 font-bold">{r.title}</h2>
                  {r.lines.map((l) => <p key={l} className="text-sm font-semibold text-muted">{l}</p>)}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-card">
                <div className="relative">
                  <Image src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80" alt="Sunshine Valley School campus" width={900} height={420} className="aspect-[16/8] w-full object-cover" loading="lazy" />
                  <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-extrabold whitespace-nowrap text-white shadow-card">
                    <MapPin className="h-4 w-4 text-sunny" aria-hidden /> Find us here
                  </span>
                </div>
                <div className="space-y-3 p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold">Visit the Campus</h2>
                  <p className="text-[14.5px] text-muted">Tours run every Tuesday & Thursday at 10:00 AM — no booking needed. Just bring your curiosity (kids welcome!).</p>
                  <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
                    <Siren className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
                    <p className="text-[13.5px] font-bold text-red-700">Emergency contact (school hours): (555) 123-4999 · For urgent student matters only.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-[1.75rem] border border-ink/8 bg-white p-7 shadow-card sm:p-9">
                {sent ? (
                  <div className="flex h-full flex-col items-center justify-center py-10 text-center" role="status">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"><CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden /></span>
                    <h2 className="font-display mt-5 text-2xl font-bold">Message sent successfully!</h2>
                    <p className="mt-2 max-w-sm text-muted">Thanks for writing — we&apos;ll reply within one school day.</p>
                    <button onClick={() => setSent(false)} className="mt-6 rounded-2xl border-2 border-ink/10 px-6 py-3 font-extrabold hover:border-ink/25">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate aria-label="Contact form">
                    <Eyebrow color="bg-sky-100 text-sky-700">Send a message</Eyebrow>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div><label htmlFor="k-name" className="text-sm font-extrabold">Name *</label><input id="k-name" name="name" className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 font-semibold outline-none focus:border-sky-400" placeholder="Your full name" />{errors.name && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors.name}</p>}</div>
                      <div><label htmlFor="k-email" className="text-sm font-extrabold">Email *</label><input id="k-email" name="email" type="email" className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 font-semibold outline-none focus:border-sky-400" placeholder="you@example.com" />{errors.email && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors.email}</p>}</div>
                      <div><label htmlFor="k-phone" className="text-sm font-extrabold">Phone</label><input id="k-phone" name="phone" type="tel" className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 font-semibold outline-none focus:border-sky-400" placeholder="(555) 000-0000" /></div>
                      <div><label htmlFor="k-subject" className="text-sm font-extrabold">Subject</label><select id="k-subject" name="subject" className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 font-semibold outline-none focus:border-sky-400"><option>Admissions enquiry</option><option>Book a visit</option><option>Fees & transport</option><option>Something else</option></select></div>
                      <div className="sm:col-span-2"><label htmlFor="k-msg" className="text-sm font-extrabold">Message *</label><textarea id="k-msg" name="message" rows={5} className="mt-1.5 w-full resize-none rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 font-semibold outline-none focus:border-sky-400" placeholder="How can we help?" />{errors.message && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors.message}</p>}</div>
                    </div>
                    <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 px-6 py-4 font-extrabold text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-sky-500">
                      Send Message <Send className="h-4 w-4" aria-hidden />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
