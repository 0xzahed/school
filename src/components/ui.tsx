"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------- Container ------------------------------- */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>;
}

/* ------------------------------- Section label ----------------------------- */
export function Eyebrow({ children, color = "bg-sky-100 text-sky-700" }: { children: ReactNode; color?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-[0.14em] uppercase",
        color
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowColor,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  eyebrowColor?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "font-display mt-4 text-3xl font-bold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-white/80" : "text-muted")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------- Buttons -------------------------------- */
export function PrimaryButton({
  href,
  children,
  color = "bg-ink",
  className,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-extrabold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0",
    color,
    className
  );
  const inner = (
    <>
      {children}
      <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </>
  );
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

export function GhostButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink/10 bg-white px-6 py-3.5 text-[15px] font-extrabold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-soft",
        className
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------- Reveal on scroll -------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/* --------------------------------- Counter -------------------------------- */
export function Counter({ value, suffix = "", duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
