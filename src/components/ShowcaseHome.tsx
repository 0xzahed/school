"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Expand, X, ChevronLeft, ChevronRight, Quote, Star,
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, ArrowRight, HeartHandshake,
} from "lucide-react";
import { Container, SectionHeading, Reveal, Eyebrow } from "./ui";
import { gallery, teachers, testimonials } from "@/data/school";
import { saveMessage, todayISO } from "@/lib/inbox";
import { cn } from "@/lib/utils";

/* --------------------------------- Gallery -------------------------------- */
export function GalleryHome() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = gallery.slice(0, 6);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setLightbox((v) => (v === null ? v : (v + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <section id="gallery" className="scroll-mt-24 bg-white py-16 sm:py-24" aria-label="Photo gallery">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          eyebrowColor="bg-violet-100 text-violet-700"
          title={<>Happy Moments, <span className="text-violet-500">Happy Memories</span></>}
          description="Peek inside our classrooms, playgrounds and celebrations."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((g, i) => (
            <Reveal key={g.src} delay={(i % 3) * 80} className={cn(i === 0 && "row-span-2")}>
              <button
                onClick={() => setLightbox(i)}
                className="group relative block h-full w-full overflow-hidden rounded-[1.4rem] shadow-soft focus-visible:outline-sky-400"
                aria-label={`Open photo: ${g.alt}`}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={700}
                  height={i === 0 ? 900 : 500}
                  className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-105", i === 0 ? "aspect-[3/4.1] h-full" : "aspect-[4/3]")}
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink">
                    <Expand className="h-5 w-5" aria-hidden />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <a href="/gallery" className="group inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3.5 font-extrabold text-white shadow-soft transition-all hover:-translate-y-0.5">
            Explore Full Gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </Reveal>
      </Container>

      {/* lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <button className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={close} aria-label="Close photo viewer">
            <X className="h-5 w-5" aria-hidden />
          </button>
          <button className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={items[lightbox].src} alt={items[lightbox].alt} width={1100} height={800} className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-card" />
            <figcaption className="mt-3 text-center text-sm font-bold text-white/80">{items[lightbox].alt} · {lightbox + 1} / {items.length}</figcaption>
          </figure>
          <button className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
}

/* --------------------------------- Teachers ------------------------------- */
export function TeachersHome() {
  return (
    <section id="teachers" className="scroll-mt-24 py-16 sm:py-24" aria-label="Our teachers">
      <Container>
        <SectionHeading
          eyebrow="Our teachers"
          eyebrowColor="bg-emerald-100 text-emerald-700"
          title={<>Meet Our <span className="text-emerald-500">Amazing Teachers</span></>}
          description="Friendly faces your children will love — and educators you can trust."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 80}>
              <article className="group h-full overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white text-center shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-card">
                <div className="relative p-5 pb-0">
                  <div className="overflow-hidden rounded-[1.2rem]">
                    <Image src={t.image} alt={`Portrait of ${t.name}, ${t.subject} teacher`} width={500} height={500} className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <span className={cn("absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[11.5px] font-extrabold whitespace-nowrap shadow-soft", t.color)}>
                    {t.subject}
                  </span>
                </div>
                <div className="p-5 pt-4">
                  <h3 className="font-display text-lg font-bold">{t.name}</h3>
                  <p className="text-[12.5px] font-extrabold tracking-wide text-muted uppercase">{t.role}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{t.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------- Testimonials ------------------------------ */
export function TestimonialsHome() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-cream py-16 sm:py-24" aria-label="Testimonials">
      <Container>
        <SectionHeading
          eyebrow="School family"
          eyebrowColor="bg-sky-100 text-sky-700"
          title={<>What Our School Family <span className="text-sky-500">Says</span></>}
          description="Real words from the parents and students who call Sunshine Valley home."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="relative flex h-full flex-col rounded-[1.5rem] border border-ink/8 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <Quote className="h-8 w-8 fill-sunny text-sunny" aria-hidden />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/80">“{t.quote}”</blockquote>
                <div className="mt-3 flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-sunny text-sunny" aria-hidden />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-ink/8 pt-4">
                  <Image src={t.avatar} alt={`Photo of ${t.name}`} width={48} height={48} className={cn("h-12 w-12 rounded-full object-cover ring-4", t.color)} loading="lazy" />
                  <div>
                    <p className="font-display text-[15.5px] font-bold">{t.name}</p>
                    <p className="text-xs font-bold text-muted">{t.label}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------- Admission CTA ----------------------------- */
export function AdmissionCTA() {
  return (
    <section className="py-16 sm:py-24" aria-label="Admission call to action">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-7 py-14 text-center shadow-card sm:px-12">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />
              <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
              <div className="dot-grid-light absolute top-8 left-8 h-20 w-36 opacity-25" />
              <div className="dot-grid-light absolute right-8 bottom-8 h-20 w-36 opacity-25" />
              <span className="animate-float absolute top-8 left-[12%] text-2xl">☁️</span>
              <span className="animate-float-slow absolute top-10 right-[14%] text-2xl">⭐</span>
              <span className="animate-float absolute bottom-10 left-[20%] text-2xl" style={{ animationDelay: "1.2s" }}>📚</span>
              <span className="animate-float-slow absolute right-[22%] bottom-8 text-2xl" style={{ animationDelay: "0.6s" }}>✏️</span>
            </div>
            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-sunny px-4 py-1.5 text-xs font-black tracking-widest text-ink uppercase">
                <HeartHandshake className="h-4 w-4" aria-hidden /> Limited seats · 2027–28
              </span>
              <h2 className="font-display mt-5 text-3xl font-extrabold text-balance text-white sm:text-5xl">
                Ready to Start the Journey?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/75 sm:text-lg">
                Give your child a place to learn, explore, create and shine. Applications take less than 10 minutes.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href="/admission" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-sunny px-8 py-4 font-extrabold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:bg-yellow-300">
                  Apply for Admission <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
                <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 px-8 py-4 font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
                  Contact School
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------- Contact home ------------------------------ */
export function ContactHome() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (name.length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email.";
    if (message.length < 10) next.message = "Please write a message of at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      saveMessage({
        id: `M-${Date.now()}`,
        name,
        email,
        subject: String(fd.get("subject") || "General enquiry"),
        message,
        date: todayISO(),
      });
      setSent(true);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 pb-20 sm:pb-28" aria-label="Contact us">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div>
              <Eyebrow color="bg-sky-100 text-sky-700">Get in touch</Eyebrow>
              <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">We&apos;d Love to Hear From You</h2>
              <p className="mt-3 leading-relaxed text-muted">Questions about admissions, visits or daily life? Message us — we reply within one school day.</p>
              <ul className="mt-7 space-y-3.5">
                {[
                  { icon: MapPin, title: "Visit us", text: "12 Rainbow Road, Green Meadows, Springfield 40210", bg: "bg-sky-100", c: "text-sky-600" },
                  { icon: Phone, title: "Call us", text: "(555) 123-4567 · Mon–Fri, 8 AM – 4 PM", bg: "bg-emerald-100", c: "text-emerald-600" },
                  { icon: Mail, title: "Email us", text: "hello@sunshinevalley.school", bg: "bg-violet-100", c: "text-violet-600" },
                  { icon: Clock, title: "Office hours", text: "Mon–Fri 8:00 AM – 4:00 PM · Sat 9:00 AM – 12:00 PM", bg: "bg-yellow-100", c: "text-yellow-700" },
                ].map((r) => (
                  <li key={r.title} className="flex items-start gap-3.5 rounded-2xl border border-ink/8 bg-white p-4 shadow-soft">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${r.bg}`}>
                      <r.icon className={`h-5 w-5 ${r.c}`} aria-hidden />
                    </span>
                    <span>
                      <span className="font-display block font-bold">{r.title}</span>
                      <span className="text-sm font-semibold text-muted">{r.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {/* map mockup */}
              <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-ink/8 shadow-soft">
                <Image
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80"
                  alt="Map view of the Sunshine Valley School campus area"
                  width={900}
                  height={320}
                  className="aspect-[16/7] w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-extrabold whitespace-nowrap text-white shadow-card">
                  <MapPin className="h-4 w-4 text-sunny" aria-hidden /> Sunshine Valley School
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full rounded-[1.75rem] border border-ink/8 bg-white p-7 shadow-card sm:p-9">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center" role="status">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden />
                  </span>
                  <h3 className="font-display mt-5 text-2xl font-bold">Message sent successfully!</h3>
                  <p className="mt-2 max-w-sm text-muted">Thank you for reaching out. Our office will reply within one school day.</p>
                  <button onClick={() => setSent(false)} className="mt-6 rounded-2xl border-2 border-ink/10 px-6 py-3 font-extrabold transition-all hover:border-ink/25">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate aria-label="Contact form">
                  <h3 className="font-display text-2xl font-bold">Send a Message</h3>
                  <p className="mt-1 text-sm font-semibold text-muted">We usually reply within one school day.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="text-sm font-extrabold">Name *</label>
                      <input id="c-name" name="name" placeholder="Your full name" autoComplete="name"
                        className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-[15px] font-semibold outline-none placeholder:text-ink/30 focus:border-sky-400" />
                      {errors.name && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="text-sm font-extrabold">Email *</label>
                      <input id="c-email" name="email" type="email" placeholder="you@example.com" autoComplete="email"
                        className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-[15px] font-semibold outline-none placeholder:text-ink/30 focus:border-sky-400" />
                      {errors.email && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-phone" className="text-sm font-extrabold">Phone</label>
                      <input id="c-phone" name="phone" type="tel" placeholder="(555) 000-0000" autoComplete="tel"
                        className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-[15px] font-semibold outline-none placeholder:text-ink/30 focus:border-sky-400" />
                    </div>
                    <div>
                      <label htmlFor="c-subject" className="text-sm font-extrabold">Subject</label>
                      <select id="c-subject" name="subject" className="mt-1.5 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-[15px] font-semibold outline-none focus:border-sky-400">
                        <option>Admissions enquiry</option>
                        <option>School visit</option>
                        <option>Fees &amp; transport</option>
                        <option>Something else</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="c-msg" className="text-sm font-extrabold">Message *</label>
                      <textarea id="c-msg" name="message" rows={4} placeholder="How can we help?"
                        className="mt-1.5 w-full resize-none rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-[15px] font-semibold outline-none placeholder:text-ink/30 focus:border-sky-400" />
                      {errors.message && <p className="mt-1 text-[13px] font-bold text-red-500" role="alert">{errors.message}</p>}
                    </div>
                  </div>
                  <button type="submit" className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 px-6 py-4 font-extrabold text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-sky-500">
                    Send Message <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
