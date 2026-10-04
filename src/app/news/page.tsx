"use client";

import { useMemo, useState } from "react";
import { Search, Pin, Tag, ArrowRight, BellOff } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, Reveal } from "@/components/ui";
import { notices } from "@/data/school";
import { cn } from "@/lib/utils";

const cats = ["All", "Admissions", "Exams", "Holiday", "Parents", "Sports", "Trip"] as const;

export default function NewsPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<(typeof cats)[number]>("All");

  const list = useMemo(
    () =>
      notices.filter(
        (n) =>
          (active === "All" || n.category === active) &&
          (q.trim() === "" || `${n.title} ${n.description}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, active]
  );

  return (
    <>
      <PageHero
        eyebrow="News & notices"
        title={<>Latest School Updates</>}
        description="Admissions, schedules, holidays and celebrations — search or filter to find what matters to you."
        crumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink/35" aria-hidden />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search notices… (e.g. admission, holiday)"
                  aria-label="Search notices"
                  className="w-full rounded-2xl border-2 border-ink/10 bg-white py-3.5 pr-4 pl-11 text-[15px] font-semibold outline-none placeholder:text-ink/30 focus:border-sky-400"
                />
              </div>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter notices">
                {cats.map((c) => (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={active === c}
                    onClick={() => setActive(c)}
                    className={cn(
                      "rounded-full px-4 py-2 text-[13px] font-extrabold transition-all",
                      active === c ? "bg-ink text-white" : "border border-ink/10 bg-white text-ink/60 hover:border-ink/25"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {list.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-[2rem] border border-dashed border-ink/15 bg-white px-6 py-16 text-center" role="status">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100"><BellOff className="h-8 w-8 text-yellow-600" aria-hidden /></span>
              <h2 className="font-display mt-4 text-2xl font-bold">No notices found.</h2>
              <p className="mt-2 text-muted">Try a different keyword or category.</p>
              <button onClick={() => { setQ(""); setActive("All"); }} className="mt-5 rounded-2xl bg-ink px-6 py-3 font-extrabold text-white">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {list.map((n, i) => (
                <Reveal key={n.id} delay={(i % 2) * 70}>
                  <article className="group flex h-full gap-4 rounded-[1.4rem] border border-ink/8 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                      {n.pinned ? <Pin className="h-5 w-5 text-sky-600" aria-hidden /> : <Tag className="h-5 w-5 text-violet-500" aria-hidden />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold">
                        <span className="rounded-full bg-sunny/60 px-2.5 py-0.5 text-ink">{n.category}</span>
                        <span className="text-muted">{n.date}</span>
                        {n.pinned && <span className="rounded-full bg-ink px-2.5 py-0.5 text-white">Pinned</span>}
                      </p>
                      <h2 className="font-display mt-2 text-lg font-bold group-hover:text-sky-600">{n.title}</h2>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{n.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-sky-600">
                        Read More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
