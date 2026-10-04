import { ArrowUpRight, ShieldCheck, Cpu, Palette, Trophy, Building2, GraduationCap } from "lucide-react";
import { Container, SectionHeading, Reveal } from "./ui";
import { subjects } from "@/data/school";

export function AcademicsHome() {
  return (
    <section id="academics" className="scroll-mt-24 py-16 sm:py-24" aria-label="Academics">
      <Container>
        <SectionHeading
          eyebrow="Academics"
          eyebrowColor="bg-sky-100 text-sky-700"
          title={<>Learn Something Amazing <span className="text-sky-500">Every Day</span></>}
          description="Six joyful learning tracks blend strong fundamentals with creativity, movement and technology."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <a
                href="/academics"
                className={`group flex h-full flex-col rounded-[1.5rem] border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card ${s.bg}`}
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconBg} shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                  <s.icon className={`h-7 w-7 ${s.iconColor}`} aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink/65">{s.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-ink">
                  Explore subject
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const why = [
  { icon: GraduationCap, title: "Experienced Teachers", text: "Certified, caring educators with an average of 10+ years in classrooms.", bg: "bg-sky-400", soft: "bg-sky-50" },
  { icon: ShieldCheck, title: "Safe & Caring Environment", text: "Secure campus, verified staff, anti-bullying culture and on-site nurse.", bg: "bg-emerald-400", soft: "bg-emerald-50" },
  { icon: Cpu, title: "Smart Learning", text: "Interactive boards, coding lab and reading apps that make lessons click.", bg: "bg-violet-400", soft: "bg-violet-50" },
  { icon: Palette, title: "Creative Activities", text: "20+ clubs from art to robotics — every child finds their spark.", bg: "bg-pink-400", soft: "bg-pink-50" },
  { icon: Trophy, title: "Sports & Recreation", text: "Daily movement, swimming, athletics and joyful team spirit.", bg: "bg-orange-400", soft: "bg-orange-50" },
  { icon: Building2, title: "Modern Facilities", text: "Bright classrooms, library, science lab, garden and play village.", bg: "bg-yellow-400", soft: "bg-yellow-50" },
];

export function WhyChooseHome() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-24" aria-label="Why choose our school">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="dot-grid-light absolute top-10 left-10 h-28 w-44 opacity-30" />
      </div>
      <Container className="relative">
        <SectionHeading
          dark
          eyebrow="Why families choose us"
          eyebrowColor="bg-white/10 text-sunny"
          title={<>More Than Just <span className="text-sunny">a Classroom</span></>}
          description="The details parents care about — safety, teachers, learning — wrapped in the joy kids remember."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <div className="group h-full rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.1]">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${f.bg} p-3.5 shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <f.icon className="h-7 w-7 text-white" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
