import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Eye, Gem, Quote, Trophy, Library, FlaskConical, Dumbbell, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, SectionHeading, Reveal, Eyebrow } from "@/components/ui";
import { AdmissionCTA } from "@/components/ShowcaseHome";

export const metadata: Metadata = { title: "About Our School" };

const values = [
  { icon: Heart, title: "Kindness First", text: "Every child feels safe, seen and celebrated for who they are.", bg: "bg-pink-100", c: "text-pink-500" },
  { icon: Eye, title: "Curiosity Always", text: "Questions are treasured — 'why?' is our favourite word.", bg: "bg-sky-100", c: "text-sky-600" },
  { icon: Gem, title: "Courage to Try", text: "Mistakes are proof of learning. We celebrate brave attempts.", bg: "bg-violet-100", c: "text-violet-600" },
];

const timeline = [
  { year: "2011", title: "A little school with a big dream", text: "Sunshine Valley opens with 60 students and 8 teachers in a renovated cottage." },
  { year: "2015", title: "The library & garden bloom", text: "A 5,000-book library and learning garden transform how we read and explore." },
  { year: "2019", title: "Innovation lab launches", text: "Coding, robotics and science clubs begin — winners at the regional science fair." },
  { year: "2023", title: "500 happy learners", text: "Our family grows past 500 students with a 4.9/5 parent satisfaction rating." },
  { year: "2026", title: "Looking to tomorrow", text: "New arts wing, swimming program and scholarships — the journey continues." },
];

const facilities = [
  { icon: Library, title: "Sunshine Library", text: "5,000+ books, cosy corners and weekly story quests." },
  { icon: FlaskConical, title: "Discovery Lab", text: "Safe, hands-on science and robotics for young makers." },
  { icon: Dumbbell, title: "Sports Village", text: "Playground, courts, swimming and daily movement." },
  { icon: Trophy, title: "Arts Wing", text: "Music rooms, art studio and a stage for little stars." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About our school"
        title={<>A Story of Joy, Learning & Growing Together</>}
        description="Since 2011 we've nurtured curious minds and kind hearts — blending strong academics with play, art and wonder."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* intro */}
      <section className="py-14 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Our introduction</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">A School That Feels Like a Second Home</h2>
            <p className="mt-4 leading-relaxed text-muted sm:text-lg">
              Sunshine Valley began with one belief: children learn best when they are happy.
              Today our sunlit campus is home to 500+ students, 35+ teachers and countless
              moments of discovery — from first-day butterflies to graduation-day cheers.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-sky-50 p-6">
                <h3 className="font-display text-lg font-bold text-sky-700">Our Mission</h3>
                <p className="mt-2 text-[14.5px] text-ink/70">To spark curiosity, build confidence and grow kind, capable young people ready for tomorrow.</p>
              </div>
              <div className="rounded-3xl bg-violet-50 p-6">
                <h3 className="font-display text-lg font-bold text-violet-700">Our Vision</h3>
                <p className="mt-2 text-[14.5px] text-ink/70">A world where every child loves learning — and carries that love for life.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <div className="overflow-hidden rounded-[1.75rem] shadow-card">
              <Image src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80" alt="Sunshine Valley School campus building" width={900} height={700} className="aspect-[4/3.4] w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-card">
              <Trophy className="h-8 w-8 text-yellow-500" aria-hidden />
              <p className="text-sm font-extrabold">“Best Primary School 2025”<br /><span className="font-bold text-muted">City Education Awards</span></p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* values */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Our values" eyebrowColor="bg-pink-100 text-pink-700" title={<>What We Hold Dear Every Day</>} description="Three simple promises guide every lesson, game and goodbye hug." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="h-full rounded-[1.5rem] border border-ink/8 bg-cream p-7 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${v.bg}`}><v.icon className={`h-7 w-7 ${v.c}`} aria-hidden /></span>
                  <h3 className="font-display mt-4 text-xl font-bold">{v.title}</h3>
                  <p className="mt-2 text-[14.5px] text-muted">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* principal full message */}
      <section className="py-14 sm:py-20">
        <Container>
          <Reveal>
            <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-[300px_1fr]">
              <Image src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80" alt="Mrs. Elena Brooks, Principal" width={500} height={600} className="mx-auto aspect-[4/4.6] w-full max-w-[300px] rounded-[1.5rem] object-cover" loading="lazy" />
              <div>
                <Quote className="h-9 w-9 fill-sunny text-sunny" aria-hidden />
                <h2 className="font-display mt-3 text-2xl font-bold sm:text-3xl">“School should be the happiest part of a child&apos;s day.”</h2>
                <div className="mt-4 space-y-3 leading-relaxed text-white/75">
                  <p>When we opened our doors in 2011, I promised every parent two things: your child will be known by name, and they will be loved while they learn. Fifteen years later, that promise still shapes everything — from how we greet children at the gate to how we celebrate their smallest wins.</p>
                  <p>Academics matter deeply here: our students read confidently, think critically and transition to top secondary schools. But what I&apos;m proudest of is harder to measure — the kindness in our hallways, the courage on our stage, the laughter in our garden.</p>
                  <p>Come and see it for yourself. My door — and our playground — is always open.</p>
                </div>
                <p className="font-display mt-5 text-lg font-bold text-sunny">Mrs. Elena Brooks</p>
                <p className="text-sm font-bold text-white/60">Principal · M.Ed, 22 years in education</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* history timeline */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Our journey" eyebrowColor="bg-sky-100 text-sky-700" title={<>Fifteen Years of Sunshine</>} description="From a little cottage school to a thriving campus — thank you for growing with us." />
          <ol className="relative mx-auto mt-12 max-w-3xl space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-0.5 before:bg-sky-200">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 60}>
                <li className="relative flex gap-5 pl-1">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-white shadow-soft">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden />
                  </span>
                  <div className="flex-1 rounded-3xl border border-ink/8 bg-cream p-5 shadow-soft">
                    <p className="inline-block rounded-full bg-sunny px-3 py-0.5 text-xs font-black">{t.year}</p>
                    <h3 className="font-display mt-2 text-lg font-bold">{t.title}</h3>
                    <p className="mt-1 text-[14.5px] text-muted">{t.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* facilities */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Campus & facilities" eyebrowColor="bg-emerald-100 text-emerald-700" title={<>Spaces Made for Wonder</>} description="Sunlit rooms, green corners and safe play areas — designed at child height." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="h-full rounded-[1.5rem] border border-ink/8 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100"><f.icon className="h-6 w-6 text-sky-600" aria-hidden /></span>
                  <h3 className="font-display mt-4 text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-[14px] text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <a href="/admission" className="group inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-7 py-4 font-extrabold text-white shadow-pop transition-all hover:-translate-y-0.5">
              Book a Campus Tour <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </Reveal>
        </Container>
      </section>

      <AdmissionCTA />
    </>
  );
}
