import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function CtaBanner() {
  return (
    <section className="relative border-y-2 border-ink bg-sky py-20" aria-label="Llamada final">
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ink">
            Última página · Cierra la edición
          </p>
          <p className="headline text-[clamp(2rem,5vw,3.4rem)] uppercase text-ink">
            Tu marca merece un<br />
            <span className="italic">ecosistema a su altura</span>
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/studio"
            className="group inline-flex cursor-pointer items-center gap-2.5 border-2 border-ink bg-paper px-8 py-4 font-bold text-ink shadow-[5px_5px_0_rgba(11,10,8,0.85)] transition-colors duration-200 hover:bg-mark"
          >
            Construye tu website
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <a
            href="#contacto"
            className="inline-flex cursor-pointer items-center gap-2.5 border-2 border-ink px-8 py-4 font-bold text-ink transition-colors duration-200 hover:bg-elec"
          >
            Hablar con la redacción
          </a>
        </Reveal>
      </div>
    </section>
  );
}
