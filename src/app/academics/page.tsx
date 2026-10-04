import type { Metadata } from "next";
import { BookOpen, PenLine, CalendarDays, ClipboardCheck, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, SectionHeading, Reveal } from "@/components/ui";
import { subjects } from "@/data/school";
import { AdmissionCTA } from "@/components/ShowcaseHome";

export const metadata: Metadata = { title: "Academics" };

const methodology = [
  { icon: BookOpen, title: "Play-Based Foundations", text: "Nursery–Grade 2 learn through stories, songs, manipulatives and joyful exploration.", color: "bg-sky-100 text-sky-600" },
  { icon: PenLine, title: "Inquiry & Projects", text: "Grades 3–8 tackle real projects — building, experimenting, presenting, reflecting.", color: "bg-violet-100 text-violet-600" },
  { icon: CalendarDays, title: "Balanced Rhythm", text: "Short focused lessons, movement breaks, reading time and creative afternoons.", color: "bg-emerald-100 text-emerald-600" },
  { icon: ClipboardCheck, title: "Gentle Assessment", text: "No fear of exams: portfolios, observations and kind feedback show real growth.", color: "bg-orange-100 text-orange-600" },
];

const calendar = [
  { term: "Term 1", dates: "Sep – Dec", note: "Foundations, friendships & winter concert" },
  { term: "Term 2", dates: "Jan – Mar", note: "Projects, science fair & book parade" },
  { term: "Term 3", dates: "Apr – Jun", note: "Sports, exhibitions & celebration week" },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title={<>Strong Foundations, Joyful Learning</>}
        description="Nursery to Grade 8 · A curriculum blending national standards with creativity, character and curiosity."
        crumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Subjects" eyebrowColor="bg-sky-100 text-sky-700" title={<>Six Tracks of Discovery</>} description="Every week includes all six — because mathematicians need music, and artists need science." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 80}>
                <div className={`h-full rounded-[1.5rem] border p-6 ${s.bg}`}>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconBg}`}><s.icon className={`h-7 w-7 ${s.iconColor}`} aria-hidden /></span>
                  <h3 className="font-display mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] text-ink/65">{s.description}</p>
                  <ul className="mt-4 space-y-1.5 text-[13.5px] font-bold text-ink/60">
                    <li>· 4–5 sessions per week</li>
                    <li>· Small groups, hands-on kits</li>
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-14 text-white sm:py-20">
        <Container>
          <SectionHeading dark eyebrow="How we teach" eyebrowColor="bg-white/10 text-sunny" title={<>Learning That Feels Like Play</>} description="Our methodology respects how young brains actually grow — through doing, not drilling." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methodology.map((m, i) => (
              <Reveal key={m.title} delay={i * 80}>
                <div className="h-full rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${m.color}`}><m.icon className="h-6 w-6" aria-hidden /></span>
                  <h3 className="font-display mt-4 text-lg font-bold">{m.title}</h3>
                  <p className="mt-2 text-[14px] text-white/70">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-bold">Academic Calendar 2026–27</h2>
              <p className="mt-3 text-muted">Three joyful terms with celebrations woven through every season.</p>
            </Reveal>
            <div className="mt-6 space-y-4">
              {calendar.map((c, i) => (
                <Reveal key={c.term} delay={i * 80}>
                  <div className="flex items-center gap-5 rounded-3xl border border-ink/8 bg-white p-5 shadow-soft">
                    <span className="font-display flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-sky-400 text-white">
                      <span className="text-lg leading-none font-extrabold">T{i + 1}</span>
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">{c.term} <span className="ml-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-extrabold text-sky-700">{c.dates}</span></h3>
                      <p className="text-sm font-semibold text-muted">{c.note}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal delay={100}>
              <h2 className="font-display text-3xl font-bold">Examination, the Gentle Way</h2>
              <p className="mt-3 text-muted">We measure growth without stealing joy — portfolios over pressure.</p>
            </Reveal>
            <ol className="mt-6 space-y-4">
              {[
                { t: "Daily observations", d: "Teachers note progress in reading, maths and social skills every week." },
                { t: "Project showcases", d: "Each term ends with exhibitions where students present their work proudly." },
                { t: "Term reviews", d: "Friendly written assessments plus a parent-teacher conversation — no ranking." },
              ].map((s, i) => (
                <Reveal key={s.t} delay={i * 80}>
                  <li className="flex gap-4 rounded-3xl bg-sunny/25 p-5">
                    <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-extrabold text-white">{i + 1}</span>
                    <div><h3 className="font-display font-bold">{s.t}</h3><p className="text-sm text-ink/65">{s.d}</p></div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={150}>
              <a href="/admission" className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3.5 font-extrabold text-white">
                Ask About Our Curriculum <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <AdmissionCTA />
    </>
  );
}
