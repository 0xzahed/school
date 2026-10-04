"use client";

import Image from "next/image";
import { MapPin, Clock, ArrowRight, ArrowUpRight, Pin, Tag } from "lucide-react";
import { Container, SectionHeading, Reveal, Counter, Eyebrow } from "./ui";
import { activities, events, notices, stats } from "@/data/school";

export function ActivitiesHome() {
  return (
    <section id="activities" className="scroll-mt-24 py-16 sm:py-24" aria-label="School activities">
      <Container>
        <SectionHeading
          eyebrow="Activities & clubs"
          eyebrowColor="bg-pink-100 text-pink-700"
          title={<>Learn. Create. <span className="text-pink-500">Play.</span> Repeat.</>}
          description="Eight worlds of fun beyond the classroom — every child discovers at least one thing they love."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a, i) => (
            <Reveal key={a.title} delay={(i % 4) * 80}>
              <article className="group h-full overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <div className="relative overflow-hidden">
                  <Image
                    src={a.image}
                    alt={`${a.title} activity at Sunshine Valley School`}
                    width={600}
                    height={400}
                    className="aspect-[4/2.8] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11.5px] font-extrabold ${a.chip}`}>
                    {a.title}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.accent} text-white`}>
                      <a.icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <h3 className="font-display text-[17px] font-bold">{a.title}</h3>
                  </div>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{a.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function StatsBand() {
  const colors = ["bg-sky-400", "bg-violet-400", "bg-sunny", "bg-emerald-400"];
  return (
    <section className="pb-16 sm:pb-24" aria-label="School statistics">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-400 via-sky-500 to-violet-500 p-8 shadow-card sm:p-12">
            <div className="dot-grid-light absolute inset-0 opacity-20" aria-hidden />
            <div className="relative grid gap-8 text-center text-white sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={s.label}>
                  <p className={`font-display mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${colors[i % 4]} ${i === 2 ? "text-ink" : "text-white"} shadow-soft`}>
                    ✦
                  </p>
                  <p className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/85">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function EventsHome() {
  return (
    <section id="events" className="scroll-mt-24 bg-white py-16 sm:py-24" aria-label="Upcoming events">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="reveal max-w-xl">
            <Eyebrow color="bg-orange-100 text-orange-700">Events</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">What&apos;s Happening at School?</h2>
            <p className="mt-3 text-muted">Concerts, fairs, sports and celebrations — come join the fun.</p>
          </div>
          <Reveal>
            <a href="/events" className="group inline-flex items-center gap-2 rounded-2xl border-2 border-ink/10 px-5 py-3 font-extrabold transition-all hover:border-ink/25">
              View All Events <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((e, i) => (
            <Reveal key={e.id} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/8 bg-cream shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-card">
                <div className="relative overflow-hidden">
                  <Image src={e.image} alt={e.title} width={700} height={420} className="aspect-[16/9.5] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute top-4 left-4 overflow-hidden rounded-2xl bg-white text-center shadow-soft">
                    <p className="font-display bg-ink px-4 pt-1.5 text-xl leading-none font-extrabold text-white">{e.day}</p>
                    <p className="bg-sunny px-4 py-1 text-[11px] font-black tracking-widest text-ink">{e.month}</p>
                  </div>
                  <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-[11.5px] font-extrabold text-ink">{e.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold transition-colors group-hover:text-sky-600">{e.title}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{e.description}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-bold text-ink/70">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sky-500" aria-hidden />{e.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-orange-500" aria-hidden />{e.time}</span>
                  </div>
                  <a href="/events" className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-sky-600">
                    View Event <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function NoticesHome() {
  return (
    <section className="py-16 sm:py-24" aria-label="Notice board">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Reveal>
            <Eyebrow color="bg-yellow-100 text-yellow-800">Notice board</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">Latest School Updates</h2>
            <p className="mt-3 leading-relaxed text-muted">Admissions, exams, holidays and meetings — everything parents need, in one friendly place.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-6 rounded-[1.5rem] border border-ink/8 bg-ink p-6 text-white shadow-card">
              <p className="font-display text-lg font-bold text-sunny">Never miss an update</p>
              <p className="mt-1 text-sm text-white/70">Get notices instantly on the parent portal and SMS alerts.</p>
              <a href="/news" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition-all hover:-translate-y-0.5">
                View All Notices <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>
        <div className="space-y-3.5">
          {notices.slice(0, 4).map((n, i) => (
            <Reveal key={n.id} delay={i * 80}>
              <a href="/news" className="group flex gap-4 rounded-[1.4rem] border border-ink/8 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                  {n.pinned ? <Pin className="h-5 w-5 text-sky-600" aria-hidden /> : <Tag className="h-5 w-5 text-violet-500" aria-hidden />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold">
                    <span className="rounded-full bg-sunny/60 px-2.5 py-0.5 text-ink">{n.category}</span>
                    <span className="text-muted">{n.date}</span>
                  </p>
                  <h3 className="font-display mt-1.5 text-[17px] font-bold transition-colors group-hover:text-sky-600">{n.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">{n.description}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-ink/20 transition-all group-hover:translate-x-1 group-hover:text-sky-500" aria-hidden />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
