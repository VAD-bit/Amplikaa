"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pricing() {
  const router = useRouter();

  const hire = (servicio: string, presupuesto: string) => {
    const qs = new URLSearchParams({ servicio, presupuesto });
    router.push(`/contacto?${qs.toString()}#formulario`);
  };

  return (
    <section id="planes" className="relative border-y border-white/10 bg-obsidian/40 py-28 sm:py-36" aria-labelledby="tit-planes">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="label-mono mb-4">// 04 — Contratación</p>
          <h2 id="tit-planes" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Planes que<br /><span className="text-gradient">escalan contigo</span>
          </h2>
          <p className="mt-6 leading-relaxed text-gray-400">Precios en USD. Contratación directa desde esta web — sin intermediarios.</p>
        </Reveal>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 0.08} className="h-full">
              <article
                className={cn(
                  "corners glass relative flex h-full flex-col rounded-2xl p-8 transition-colors",
                  plan.featured ? "border-elec/40 glow-elec lg:-mt-4 lg:mb-[-1rem]" : "hover:border-white/25"
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-elec px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                    Más elegido
                  </span>
                )}
                <p className="label-mono mb-4">{plan.planNo}</p>
                <h3 className="font-syne text-2xl font-extrabold uppercase">{plan.label}</h3>
                <p className="mt-4 mb-6">
                  <span className={cn("font-syne text-5xl font-extrabold", plan.featured && "text-gradient")}>
                    ${plan.price}
                  </span>
                  <span className="font-mono text-sm text-gray-500">/mes</span>
                </p>
                <p className="mb-8 text-sm text-gray-400">{plan.desc}</p>
                <ul className="mb-10 flex-1 space-y-3 text-sm text-gray-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-elec" strokeWidth={2.5} aria-hidden="true" />
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
                  Contratar plan
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="reveal mt-10 text-center font-mono text-xs tracking-wide text-gray-500">
          ¿Proyecto único sin suscripción?{" "}
          <a href="/studio" className="cursor-pointer text-elec hover:underline">
            Diseña tu esquema y recibe un plan al instante →
          </a>
        </p>
      </div>
    </section>
  );
}
