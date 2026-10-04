import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, Clock, Heart, ArrowRight } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const schoolLinks = [
  { label: "About Our School", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Our Teachers", href: "/#teachers" },
  { label: "Activities", href: "/#activities" },
];

const quickLinks = [
  { label: "Admissions", href: "/admission" },
  { label: "Events", href: "/events" },
  { label: "Notices", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Staff Portal", href: "/admin/login" },
  { label: "Student Portal", href: "/student/login" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* playful top wave */}
      <svg viewBox="0 0 1440 56" className="block w-full text-cream" aria-hidden preserveAspectRatio="none" style={{ height: 44 }}>
        <path d="M0,0 L1440,0 L1440,12 C1080,52 360,52 0,12 Z" fill="currentColor" />
      </svg>

      <div className="mx-auto max-w-7xl px-5 pt-10 pb-8 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400 text-white">
                <GraduationCap className="h-6 w-6" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="font-display block text-lg font-extrabold">Sunshine Valley</span>
                <span className="block text-[11px] font-bold tracking-[0.22em] text-white/60 uppercase">School · Est. 2011</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/70">
              A joyful world for children and a trustworthy partner for parents — learning, playing and growing together since 2011.
            </p>
            <div className="mt-5 flex gap-2.5">
              {[
                { Icon: FacebookIcon, label: "Facebook" },
                { Icon: InstagramIcon, label: "Instagram" },
                { Icon: YoutubeIcon, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-sky-400"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="School">
            <h3 className="font-display text-base font-bold text-sunny">Our School</h3>
            <ul className="mt-4 space-y-2.5">
              {schoolLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white/75 hover:text-white">
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Quick links">
            <h3 className="font-display text-base font-bold text-sunny">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white/75 hover:text-white">
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-base font-bold text-sunny">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] font-semibold text-white/75">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden /> 12 Rainbow Road, Green Meadows, Springfield 40210</li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden /> (555) 123-4567</li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden /> hello@sunshinevalley.school</li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden /> Mon–Fri · 8:00 AM – 4:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13.5px] font-semibold text-white/60 sm:flex-row">
          <p>© 2026 Sunshine Valley School. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms &amp; Conditions</Link>
          </p>
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-white/40">
          Made with <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" aria-hidden /> for young learners
        </p>
      </div>
    </footer>
  );
}
