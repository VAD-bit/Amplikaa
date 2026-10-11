import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";

export function Testimonials() {
  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="tit-testi">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-16 max-w-3xl">
          <p className="label-mono mb-4">// 05 — Testimonios</p>
          <h2 id="tit-testi" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Marcas que ya<br /><span className="text-gradient">crecieron con nosotros</span>
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="corners glass relative h-full rounded-2xl p-8">
                <div className="mb-5 flex gap-1" aria-label={`${t.rating} de 5 estrellas`}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-elec text-elec" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mb-6 text-sm leading-relaxed text-gray-300">“{t.quote}”</blockquote>
                <figcaption>
                  <p className="font-syne font-bold uppercase tracking-wide">{t.name}</p>
                  <p className="label-mono mt-1">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
