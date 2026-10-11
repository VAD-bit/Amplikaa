"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20" aria-label="Presentación">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
      <motion.div
        className="aurora -top-40 -left-32 h-[560px] w-[560px] bg-elec/15"
        aria-hidden="true"
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora top-24 -right-40 h-[620px] w-[620px] bg-viol/20"
        aria-hidden="true"
        animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-10 inline-flex items-center gap-3 rounded-full glass px-4 py-2">
            <span className="pulse-dot h-2 w-2 rounded-full bg-elec" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[.25em] text-gray-300">
              Disponible para nuevos proyectos · {BRAND.year}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="font-syne text-[clamp(3.4rem,12vw,9.5rem)] font-extrabold uppercase leading-[.92] tracking-[-0.04em]">
            AMPLIK<span className="text-gradient">AA</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[.3em] text-gray-400 sm:text-sm">
            <span>{BRAND.tagline[0]}</span>
            <span className="text-elec" aria-hidden="true">•</span>
            <span>{BRAND.tagline[1]}</span>
            <span className="text-viol" aria-hidden="true">•</span>
            <span>{BRAND.tagline[2]}</span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            Agencia de marketing digital en <strong className="font-semibold text-white">Venezuela</strong>.
            Diseñamos ecosistemas digitales de alto impacto: marca, contenido, sitios y producto —
            para convertir atención en crecimiento medible.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/studio"
              className="glow-elec group inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-elec px-7 py-4 font-semibold text-black transition-all duration-200 hover:bg-white"
            >
              Construye tu website
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#trabajos"
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/20 px-7 py-4 font-semibold text-white transition-all duration-200 hover:border-elec/70 hover:bg-white/5"
            >
              Ver portafolio
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-4 font-mono text-[11px] tracking-widest text-gray-500 uppercase">
            Sin compromiso · Respuesta &lt; 24 h · Propuesta con alcance y precio
          </p>
        </Reveal>
      </div>
    </section>
  );
}
