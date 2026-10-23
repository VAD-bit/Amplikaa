"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { BRAND, EDITION } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";

const INDEX_ANCHORS = [
  { href: "#trabajos", label: "Portafolio: webs y sistemas" },
  { href: "#clientes", label: "Clientes & reels de Instagram" },
  { href: "#equipo", label: "Quiénes somos" },
  { href: "#planes", label: "Planes y precios" },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="portada" className="relative overflow-hidden pt-28 pb-14 sm:pt-32" aria-label="Portada">
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden="true" />
      <motion.div
        className="aurora -top-40 -left-32 h-[560px] w-[560px] bg-elec/20"
        aria-hidden="true"
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora top-32 -right-40 h-[620px] w-[620px] bg-viol/20"
        aria-hidden="true"
        animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="aurora bottom-24 left-1/3 h-[420px] w-[420px] bg-mark/30" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-ink/30 pb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-soft sm:text-[11px]">
            <span>{EDITION.no} · {EDITION.volume}</span>
            <span className="hidden sm:inline">{EDITION.city}</span>
            <span>{EDITION.date} · {EDITION.price}</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="relative py-6 sm:py-8">
            <span className="tape -top-1 right-4 -rotate-6 sm:right-16" aria-hidden="true" />
            <h1 className="headline text-center text-[clamp(2.9rem,13vw,10rem)] font-bold uppercase leading-[0.86] tracking-[-0.03em]">
              AMPLIK<span className="text-gradient">AA</span>
            </h1>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-y border-ink/30 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft sm:text-xs">
            <span>{BRAND.tagline[0]}</span>
            <span className="text-ink" aria-hidden="true">◆</span>
            <span>{BRAND.tagline[1]}</span>
            <span className="text-ink" aria-hidden="true">◆</span>
            <span>{BRAND.tagline[2]}</span>
          </div>
        </Reveal>

        <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <Reveal delay={0.12}>
              <p className="label-mono mb-4">{EDITION.kicker}</p>
            </Reveal>

            <Reveal delay={0.16}>
              <h2 className="headline text-[clamp(2rem,4.6vw,3.4rem)] uppercase">
                Convertimos atención en <span className="text-gradient italic">crecimiento medible</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-5 max-w-3xl font-syne text-lg italic leading-snug text-ink-soft sm:text-xl">
                Marca, contenido, sitios y producto trabajando como un solo sistema — no como piezas sueltas
                que discuten entre ellas.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="paper-cols mt-7 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
                <p className="drop-cap mb-4">
                  Somos una agencia de marketing digital en {BRAND.location}. Diseñamos ecosistemas digitales de
                  alto impacto: identidad, producción audiovisual, sitios web y sistemas a medida que
                  convierten la atención en crecimiento medible.
                </p>
                <p className="mb-4">
                  Detrás hay un equipo propio de estrategia, creatividad y desarrollo — y una inteligencia
                  artificial que construimos nosotros mismos para operar campañas con más velocidad y menos
                  humo. Trabajamos con presupuesto cerrado, entregas por fases y reportes que se entienden.
                </p>
                <p>
                  Esta edición reúne todo lo que hacemos: el catálogo de webs y sistemas ya lanzados, los
                  clientes que llevamos en marketing, nuestros planes y la tecnología interna que nos da
                  ventaja.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/studio"
                  className="glow-elec group inline-flex cursor-pointer items-center gap-2.5 rounded-none bg-sky px-7 py-4 font-semibold text-ink transition-all duration-200 hover:bg-elec"
                >
                  Construye tu website
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <a
                  href="#trabajos"
                  className="inline-flex cursor-pointer items-center gap-2.5 rounded-none border border-ink/40 bg-paper-3/60 px-7 py-4 font-semibold text-ink backdrop-blur transition-all duration-200 hover:border-ink hover:bg-paper-3"
                >
                  Ver la edición
                </a>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
                Sin compromiso · Respuesta &lt; 24 h · Propuesta con alcance y precio
              </p>
            </Reveal>
          </div>

          <aside className="lg:col-span-4" aria-label="En esta edición">
            <Reveal delay={0.2}>
              <div className="glass relative p-6">
                <span className="tape -top-3 left-8 -rotate-3" aria-hidden="true" />
                <p className="label-mono mb-4 border-b border-ink/25 pb-3">En esta edición</p>
                <ol className="space-y-0">
                  {INDEX_ANCHORS.map((item, i) => (
                    <li key={item.href} className="border-b border-dashed border-ink/20 last:border-0">
                      <a
                        href={item.href}
                        className="group flex cursor-pointer items-baseline gap-3 py-3 transition-colors hover:underline hover:underline-offset-4"
                      >
                        <span className="font-mono text-[11px] text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-syne text-[15px] font-semibold leading-tight">{item.label}</span>
                        <span className="ml-auto font-mono text-xs text-ink-mute transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                      </a>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-center gap-3 border-t border-ink/25 pt-4">
                  <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-elec" aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Disponible para nuevos proyectos · {BRAND.year}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="sticker mt-8 inline-block rotate-[-3deg] bg-mark px-5 py-3 text-center">
                <p className="font-syne text-lg font-bold uppercase leading-none">Precio cerrado</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  Sin intermediarios
                </p>
              </div>
            </Reveal>
          </aside>
        </div>

        <Reveal delay={0.3}>
          <a
            href="#servicios"
            className="mt-12 flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-mute transition-colors hover:text-ink hover:underline hover:underline-offset-4 mx-auto"
          >
            Desliza para leer
            <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
