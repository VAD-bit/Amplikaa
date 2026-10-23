"use client";

import { useRouter } from "next/navigation";
import { Check, Clock } from "lucide-react";
import { PRICING_NOTE, type Plan, type SystemPlan } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pricing({ planes }: { planes: { marketing: Plan[]; sistemas: SystemPlan[] } }) {
  const router = useRouter();

  const hire = (servicio: string, presupuesto: string) => {
    const qs = new URLSearchParams({ servicio, presupuesto });
    router.push(`/contacto?${qs.toString()}#formulario`);
  };

  return (
    <section id="planes" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="tit-planes">
      <div className="aurora -top-24 left-1/4 h-[460px] w-[460px] bg-mark/30" aria-hidden="true" />
      <div className="aurora bottom-10 -right-32 h-[440px] w-[440px] bg-sky/25" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-planes"
          no="06"
          kicker="Tarifario"
          title={
            <>
              Precios de sistemas<br />
              <span className="text-gradient italic">y de campañas</span>
            </>
          }
          deck="Dos tarifas claras: proyectos únicos de web/sistemas y planes semanales de marketing. Precios en USD — en Venezuela abonas en Bs a tasa del día."
          meta="Contratación directa"
        />

        <Reveal>
          <div className="rule-double mb-6 flex flex-wrap items-baseline justify-between gap-3 pt-4">
            <p className="label-mono">A · Sistemas & webs — proyecto único</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
              Precio cerrado por alcance
            </p>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {planes.sistemas.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 0.08} className="h-full">
              <article
                className={cn(
                  "glass relative flex h-full flex-col p-7 transition-all duration-300",
                  plan.featured
                    ? "ring-2 ring-elec shadow-[6px_6px_0_rgba(11,10,8,0.85)] lg:-mt-3"
                    : "hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(11,10,8,0.85)]"
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-6 bg-elec px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                    Más elegido
                  </span>
                )}
                <p className="label-mono mb-3">{plan.planNo}</p>
                <h3 className="headline text-2xl uppercase">{plan.label}</h3>
                <p className="mt-4 mb-5">
                  <span className={cn("headline text-5xl", plan.featured && "text-gradient")}>${plan.price}</span>
                  <span className="font-mono text-sm text-ink-mute"> único</span>
                </p>
                <p className="mb-5 flex items-center gap-2 text-sm text-ink-soft">
                  <Clock className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                  Entrega: {plan.entrega}
                </p>
                <p className="mb-6 text-sm text-ink-soft">{plan.desc}</p>
                <ul className="mb-8 flex-1 space-y-2.5 text-sm text-ink-soft">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={2.5} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant={plan.featured ? "elec" : "outline"}
                  className="w-full"
                  onClick={() => hire(plan.servicio, plan.presupuesto)}
                >
                  Cotizar sistema
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rule-double mt-16 mb-6 flex flex-wrap items-baseline justify-between gap-3 pt-4">
            <p className="label-mono">B · Campañas de marketing — semanal</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
              Suscripción semanal
            </p>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {planes.marketing.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 0.08} className="h-full">
              <article
                className={cn(
                  "glass relative flex h-full flex-col p-7 transition-all duration-300",
                  plan.featured
                    ? "ring-2 ring-viol shadow-[6px_6px_0_rgba(11,10,8,0.85)] lg:-mt-3"
                    : "hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(11,10,8,0.85)]"
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-6 bg-viol px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                    Más elegido
                  </span>
                )}
                <p className="label-mono mb-3">{plan.planNo}</p>
                <h3 className="headline text-2xl uppercase">{plan.label}</h3>
                <p className="mt-4 mb-5">
                  <span className={cn("headline text-5xl", plan.featured && "text-gradient")}>${plan.price}</span>
                  <span className="font-mono text-sm text-ink-mute">/semana</span>
                </p>
                <p className="mb-6 text-sm text-ink-soft">{plan.desc}</p>
                <ul className="mb-8 flex-1 space-y-2.5 text-sm text-ink-soft">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={2.5} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant={plan.featured ? "viol" : "outline"}
                  className="w-full"
                  onClick={() => hire(plan.servicio, plan.presupuesto)}
                >
                  Contratar plan
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center font-mono text-xs tracking-wide text-ink-mute">
            {PRICING_NOTE}
          </p>
          <p className="mt-2 text-center font-mono text-xs tracking-wide text-ink-mute">
            ¿Proyecto único sin suscripción?{" "}
            <a href="/studio" className="cursor-pointer text-ink hover:underline">
              Diseña tu esquema y recibe un plan al instante →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
