"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, ArrowRight, Phone, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/school";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      {/* top strip */}
      <div className="hidden bg-ink text-white/90 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2 text-[13px] font-semibold">
          <p className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sunny text-[11px] font-black text-ink">★</span>
            Admissions open for 2027–28 · Nursery to Grade 8
          </p>
          <div className="flex items-center gap-4">
            <a href="tel:+15551234567" className="flex items-center gap-1.5 hover:text-sunny">
              <Phone className="h-3.5 w-3.5" aria-hidden /> (555) 123-4567
            </a>
            <Link href="/admin/login" className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 hover:text-white">
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden /> Staff Portal
            </Link>
            <Link href="/student/login" className="flex items-center gap-1.5 rounded-full bg-sunny/15 px-3 py-1 text-sunny hover:bg-sunny/25 hover:text-white">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden /> Student Portal
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-cream/90 shadow-soft backdrop-blur-xl" : "bg-cream"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8",
            scrolled ? "py-2.5" : "py-4"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label="Sunshine Valley School home">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400 text-white shadow-pop">
              <GraduationCap className="h-6 w-6" aria-hidden />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-cream bg-sunny" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-[17px] font-extrabold text-ink">Sunshine Valley</span>
              <span className="block text-[11px] font-extrabold tracking-[0.22em] text-muted uppercase">School · Est. 2011</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navLinks.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-[14.5px] font-bold transition-colors",
                    active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/admission"
              className="group inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-[14.5px] font-extrabold text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-sky-500"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white text-ink lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* mobile drawer */}
        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden",
            open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="nice-scroll mx-4 mb-4 max-h-[60vh] overflow-y-auto rounded-3xl border border-ink/8 bg-white p-3 shadow-card" aria-label="Mobile">
            {navLinks.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={closeMenu}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-bold",
                  pathname === l.href ? "bg-sky-100 text-sky-800" : "text-ink/75 hover:bg-cream"
                )}
              >
                {l.label}
                <span className="text-xs text-muted">0{i + 1}</span>
              </Link>
            ))}
            <Link
              href="/admission"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-4 py-3.5 font-extrabold text-white"
            >
              Apply for Admission <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/admin/login"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-ink/10 px-4 py-3 font-extrabold text-ink/70"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden /> Staff Portal Login
            </Link>
            <Link
              href="/student/login"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-sunny/60 px-4 py-3 font-extrabold text-ink"
            >
              <GraduationCap className="h-4 w-4" aria-hidden /> Student Portal Login
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
