import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function CtaBanner() {
  return (
    <section className="relative border-t border-white/10 py-24" aria-label="Llamada final">
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <p className="font-syne text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
            Tu marca merece un<br /><span className="text-gradient">ecosistema a su altura</span>
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/studio"
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-8 py-4 font-bold text-black transition-colors duration-200 hover:bg-elec"
          >
            Construye tu website
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#contacto"
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/20 px-8 py-4 font-bold transition-colors duration-200 hover:border-elec hover:text-elec"
          >
            Hablar por WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
