"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MapPin, Clock, CalendarX2, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, Reveal } from "@/components/ui";
import { events } from "@/data/school";
import { cn } from "@/lib/utils";

const filters = ["All", "Academic", "Sports", "Cultural", "Holiday", "Other"] as const;

export default function EventsPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const list = useMemo(() => (active === "All" ? events : events.filter((e) => e.category === active)), [active]);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={<>Moments Worth Celebrating Together</>}
        description="Upcoming happenings plus a peek at recent favourites. Filter by category to explore."
        crumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter events by category">
              {filters.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active === f}
                  onClick={() => setActive(f)}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-extrabold transition-all",
                    active === f ? "bg-ink text-white shadow-soft" : "border border-ink/10 bg-white text-ink/65 hover:border-ink/25"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          {list.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-[2rem] border border-dashed border-ink/15 bg-white px-6 py-16 text-center" role="status">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100"><CalendarX2 className="h-8 w-8 text-sky-500" aria-hidden /></span>
              <h2 className="font-display mt-4 text-2xl font-bold">No upcoming events right now.</h2>
              <p className="mt-2 text-muted">Please check back soon — new celebrations are always around the corner.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 70}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-card">
                    <div className="relative overflow-hidden">
                      <Image src={e.image} alt={e.title} width={700} height={420} className="aspect-[16/9.5] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute top-4 left-4 overflow-hidden rounded-2xl bg-white text-center shadow-soft">
                        <p className="font-display bg-ink px-4 pt-1.5 text-xl leading-none font-extrabold text-white">{e.day}</p>
                        <p className="bg-sunny px-4 py-1 text-[11px] font-black tracking-widest text-ink">{e.month}</p>
                      </div>
                      <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-[11.5px] font-extrabold">{e.category}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-display text-xl font-bold group-hover:text-sky-600">{e.title}</h2>
                      <p className="mt-2 flex-1 text-[14px] text-muted">{e.description}</p>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-bold text-ink/70">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sky-500" aria-hidden />{e.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-orange-500" aria-hidden />{e.time}</span>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-sky-600">
                        View Event <ArrowUpRight className="h-4 w-4" aria-hidden />
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
