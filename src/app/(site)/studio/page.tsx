import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudioWizard } from "@/components/studio/studio-wizard";

export const metadata: Metadata = {
  title: "Construye tu Website — AMPLIKAA Studio",
  description:
    "Diseña el esquema de tu website, explica tu idea y recibe un plan de desarrollo, análisis de complejidad y presupuesto estimado al instante.",
};

export default function StudioPage() {
  return (
    <main className="relative overflow-hidden pt-14 pb-24">
      <div className="aurora -top-40 -left-32 h-[520px] w-[520px] bg-elec/12" aria-hidden="true" />
      <div className="aurora top-40 -right-40 h-[560px] w-[560px] bg-viol/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="label-mono mb-4">// Construye tu Website</p>
          <h1 className="font-syne text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-6xl">
            Diseña tu sitio.<br /><span className="text-gradient">Nosotros lo construimos.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            En 4 pasos armas el esquema visual de tu website, explicas tu idea (por escrito o por voz)
            y defines tu presupuesto. Al enviar, generamos un <strong className="text-ink">plan de desarrollo</strong>,
            un <strong className="text-ink">diagnóstico de complejidad</strong> y un <strong className="text-ink">análisis financiero</strong> al instante.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a la landing
          </Link>
        </div>

        <StudioWizard />
      </div>
    </main>
  );
}
