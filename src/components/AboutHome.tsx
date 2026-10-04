import Image from "next/image";
import { Sprout, Compass, TrendingUp, ArrowRight, Quote } from "lucide-react";
import { Container, Reveal, Eyebrow } from "./ui";

const features = [
  { icon: Sprout, title: "Learn", text: "Strong academic foundations built through joyful, hands-on lessons.", bg: "bg-sky-100", color: "text-sky-600" },
  { icon: Compass, title: "Explore", text: "Creativity, curiosity and new interests discovered every single day.", bg: "bg-violet-100", color: "text-violet-600" },
  { icon: TrendingUp, title: "Grow", text: "Confidence, friendship and leadership nurtured with care.", bg: "bg-emerald-100", color: "text-emerald-600" },
];

export function AboutHome() {
  return (
    <section id="about" className="relative scroll-mt-24 py-16 sm:py-24" aria-label="About our school">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="dot-grid absolute -top-8 -left-8 h-32 w-32 opacity-60" aria-hidden />
          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80"
                alt="Students learning together with their teacher in a sunny classroom"
                width={900}
                height={700}
                className="aspect-[4/3.4] w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute -right-3 -bottom-8 hidden w-56 overflow-hidden rounded-3xl border-8 border-white shadow-card sm:block">
              <Image
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80"
                alt="Children painting in art class"
                width={500}
                height={400}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="animate-float absolute -top-5 -right-4 rounded-2xl bg-ink px-4 py-3 text-white shadow-card">
              <p className="font-display text-2xl font-extrabold text-sunny">15+</p>
              <p className="text-xs font-bold text-white/80">Years of joyful<br />learning</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>About our school</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-bold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              A Place Where Every Child Can <span className="text-sky-500">Shine</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted sm:text-lg">
              Since 2011, Sunshine Valley has blended strong academics with play, art and
              exploration — so children love coming to school and parents trust what
              happens inside it. Small classes, caring teachers, safe spaces.
            </p>
          </Reveal>
          <div className="mt-7 space-y-3.5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group flex items-start gap-4 rounded-3xl border border-ink/8 bg-white p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${f.bg}`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{f.title}</h3>
                    <p className="text-[14.5px] leading-relaxed text-muted">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <a href="/about" className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3.5 font-extrabold text-white shadow-soft transition-all hover:-translate-y-0.5">
              Discover Our Story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function PrincipalHome() {
  return (
    <section className="relative py-8 sm:py-12" aria-label="Message from principal">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 via-sky-50 to-yellow-50 p-8 shadow-soft sm:p-12">
            <div className="dot-grid absolute top-6 right-8 h-24 w-40 opacity-50" aria-hidden />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/60 blur-2xl" aria-hidden />
            <div className="relative grid items-center gap-10 lg:grid-cols-[340px_1fr]">
              <div className="relative mx-auto w-full max-w-[320px]">
                <div className="absolute -inset-3 rounded-[2rem] bg-white/70 blur-md" aria-hidden />
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
                  alt="Portrait of Mrs. Elena Brooks, Principal of Sunshine Valley School"
                  width={600}
                  height={700}
                  className="relative aspect-[4/4.6] w-full rounded-[1.75rem] border-8 border-white object-cover shadow-card"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-sunny px-4 py-2 text-[13px] font-extrabold whitespace-nowrap text-ink shadow-soft">
                  <Quote className="h-3.5 w-3.5" aria-hidden /> 22 yrs in education
                </div>
              </div>
              <div>
                <Eyebrow color="bg-white text-violet-700">Message from our principal</Eyebrow>
                <h2 className="font-display mt-4 text-2xl font-bold text-balance sm:text-4xl">
                  “Every Child Has Something Wonderful to Discover.”
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink/70 sm:text-lg">
                  Dear families — childhood is short and precious. Here we protect its wonder
                  while building real skills: reading deeply, thinking kindly, trying bravely.
                  Come visit, meet our teachers, and see the joy for yourself.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-extrabold">Mrs. Elena Brooks</p>
                    <p className="text-sm font-bold text-muted">Principal, Sunshine Valley School</p>
                  </div>
                  <a href="/about" className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-6 py-3 font-extrabold text-ink shadow-soft transition-all hover:-translate-y-0.5">
                    Read Full Message <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
