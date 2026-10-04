"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Expand, X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Container, Reveal } from "@/components/ui";
import { gallery } from "@/data/school";
import { cn } from "@/lib/utils";

const filters = ["All", "Campus", "Classroom", "Sports", "Events", "Activities"] as const;

export default function GalleryPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const list = useMemo(() => (active === "All" ? gallery : gallery.filter((g) => g.category === active)), [active]);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback((dir: 1 | -1) => setLightbox((v) => (v === null ? v : (v + dir + list.length) % list.length)), [list.length]);

  const selectFilter = (f: (typeof filters)[number]) => {
    setActive(f);
    setLightbox(null);
  };

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
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>Happy Moments, Happy Memories</>}
        description="Classrooms, playgrounds, stages and smiles — click any photo to view it up close."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter gallery">
              {filters.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active === f}
                  onClick={() => selectFilter(f)}
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
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100"><ImageOff className="h-8 w-8 text-violet-500" aria-hidden /></span>
              <h2 className="font-display mt-4 text-2xl font-bold">No photos in this album yet.</h2>
              <p className="mt-2 text-muted">Try another category — new memories are added every term.</p>
            </div>
          ) : (
            <div className="mt-8 columns-2 gap-4 space-y-4 lg:columns-3 [&>*]:mb-4">
              {list.map((g, i) => (
                <Reveal key={g.src} delay={(i % 3) * 60}>
                  <button
                    onClick={() => setLightbox(i)}
                    className="group relative block w-full overflow-hidden rounded-[1.4rem] shadow-soft"
                    aria-label={`Open photo: ${g.alt}`}
                  >
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={700}
                      height={g.tall ? 950 : 520}
                      className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-105", g.tall ? "aspect-[3/4]" : "aspect-[4/3]")}
                      loading="lazy"
                    />
                    <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex w-full items-center justify-between text-left">
                        <span className="text-[13px] font-extrabold text-white">{g.alt}</span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink"><Expand className="h-4 w-4" aria-hidden /></span>
                      </span>
                    </span>
                    <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold">{g.category}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      {lightbox !== null && list[lightbox] && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <button className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={close} aria-label="Close photo viewer">
            <X className="h-5 w-5" aria-hidden />
          </button>
          <button className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={list[lightbox].src} alt={list[lightbox].alt} width={1100} height={800} className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-card" />
            <figcaption className="mt-3 text-center text-sm font-bold text-white/80">{list[lightbox].alt} · {lightbox + 1} / {list.length}</figcaption>
          </figure>
          <button className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </>
  );
}
