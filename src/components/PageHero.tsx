import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Reveal } from "./ui";

export default function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  crumbs: Array<{ label: string; href?: string }>;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-violet-100 to-yellow-50" aria-label={eyebrow}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="dot-grid absolute top-8 right-10 h-24 w-44 opacity-50" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
        <span className="animate-float absolute top-10 left-[8%] text-2xl">☁️</span>
        <span className="animate-float-slow absolute right-[10%] bottom-8 text-2xl">⭐</span>
      </div>
      <Container className="relative py-14 sm:py-20">
        <Reveal>
          <nav className="flex items-center gap-1.5 text-[13px] font-bold text-ink/60" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
                {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
              </span>
            ))}
          </nav>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-black tracking-[0.14em] text-sky-700 uppercase shadow-soft">
            {eyebrow}
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold text-balance sm:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/65">{description}</p>}
        </Reveal>
      </Container>
      <svg viewBox="0 0 1440 48" className="block w-full text-cream" aria-hidden preserveAspectRatio="none" style={{ height: 36 }}>
        <path d="M0,48 L1440,48 L1440,20 C1080,48 360,48 0,20 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
