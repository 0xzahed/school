"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Star, Cloud, Users, GraduationCap, Award, Sparkles, Play } from "lucide-react";
import { Container, Reveal } from "./ui";
import { stats } from "@/data/school";
import { Counter } from "./ui";

const trustIcons = [Users, GraduationCap, Award, Sparkles];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Welcome">
      {/* soft background blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute top-20 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-yellow-100/80 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-12 pt-12 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20 lg:pb-16">
        {/* left */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-[13px] font-extrabold text-sky-700 shadow-soft">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunny text-ink">
                <Star className="h-3.5 w-3.5 fill-ink" aria-hidden />
              </span>
              Admissions open · 2027–28 · Nursery – Grade 8
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-[2.6rem] leading-[1.04] font-extrabold text-balance sm:text-6xl lg:text-[4.2rem]">
              Let&apos;s Learn,{" "}
              <span className="relative inline-block text-sky-500">
                Play
                <svg viewBox="0 0 120 14" className="absolute -bottom-1 left-0 w-full" aria-hidden>
                  <path d="M3 10 C 30 3, 90 3, 117 8" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" fill="none" />
                </svg>
              </span>{" "}
              &amp; Grow{" "}
              <span className="relative inline-block">
                Together!
                <Sparkles className="absolute -top-5 -right-7 h-7 w-7 text-orange-400 animate-wiggle" aria-hidden />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Where every child discovers their curiosity, builds confidence, and grows
              into their brightest self — in classrooms full of warmth, wonder and joy.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#about"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-7 py-4 text-[15px] font-extrabold text-white shadow-card transition-all hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-white" aria-hidden />
                Explore Our School
              </a>
              <a
                href="/admission"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-sunny px-7 py-4 text-[15px] font-extrabold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                Apply for Admission
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => {
                const Icon = trustIcons[i % trustIcons.length];
                return (
                  <div key={s.label} className="rounded-2xl border border-ink/8 bg-white/80 px-3 py-3 text-center shadow-soft backdrop-blur">
                    <Icon className="mx-auto h-5 w-5 text-sky-500" aria-hidden />
                    <dd className="font-display mt-1 text-xl font-extrabold text-ink">
                      <Counter value={s.value} suffix={s.suffix} />
                    </dd>
                    <dt className="text-[11.5px] leading-tight font-bold text-muted">{s.label}</dt>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>

        {/* right visual */}
        <Reveal delay={140} className="relative mx-auto w-full max-w-[520px]">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-sky-200 via-violet-200 to-yellow-100 blur-xl opacity-70" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border-8 border-white shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80"
                alt="Happy children raising hands in a bright classroom"
                width={900}
                height={1000}
                className="aspect-[4/4.4] w-full object-cover"
                priority
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-soft backdrop-blur">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
                  alt="Principal portrait"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="text-left">
                  <p className="text-[13.5px] font-extrabold text-ink">“Every child shines here.”</p>
                  <p className="text-xs font-bold text-muted">— Mrs. Elena Brooks, Principal</p>
                </div>
              </div>
            </div>

            {/* floating badges */}
            <div className="animate-float absolute -top-5 -left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-card" style={{ "--float-rot": "-3deg" } as CSSProperties}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100"><Award className="h-4 w-4 text-emerald-600" aria-hidden /></span>
              <span className="text-[13px] font-extrabold">15+ Years<br /><span className="font-bold text-muted">of Excellence</span></span>
            </div>
            <div className="animate-float-slow absolute top-1/3 -right-3 flex items-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-white shadow-card sm:-right-6" style={{ "--float-rot": "3deg" } as CSSProperties}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sunny"><Star className="h-4 w-4 fill-ink text-ink" aria-hidden /></span>
              <span className="text-[13px] font-extrabold">4.9 Parent<br /><span className="font-bold text-white/70">Rating</span></span>
            </div>
            <div className="animate-float absolute -bottom-5 left-8 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-card" style={{ "--float-rot": "2deg", animationDelay: "1s" } as CSSProperties}>
              <Cloud className="h-5 w-5 text-sky-400" aria-hidden />
              <span className="text-[13px] font-extrabold">Safe · Kind · Joyful</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
