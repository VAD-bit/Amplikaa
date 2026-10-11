"use client";

import { Globe, Video, Code2, Palette, TrendingUp, MessageSquare } from "lucide-react";
import { SERVICES, type ServiceIcon } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const ICONS: Record<ServiceIcon, typeof Globe> = {
  globe: Globe,
  video: Video,
  code: Code2,
  palette: Palette,
  trending: TrendingUp,
  message: MessageSquare,
};

export function Services() {
  return (
    <section id="servicios" className="relative py-28 sm:py-36" aria-labelledby="tit-servicios">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-16 max-w-3xl">
          <p className="label-mono mb-4">// 01 — Servicios</p>
          <h2 id="tit-servicios" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Un ecosistema,<br /><span className="text-gradient">no piezas sueltas</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-400">
            Cada servicio se conecta con el siguiente: de la identidad al contenido, del contenido al sitio, del sitio al cliente.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            const viol = s.accent === "viol";
            return (
              <Reveal key={s.index} delay={i * 0.06}>
                <article
                  className={cn(
                    "group corners glass relative h-full rounded-2xl p-8 transition-all duration-300 cursor-default",
                    viol ? "hover:border-viol/50" : "hover:border-elec/40"
                  )}
                >
                  <div className="mb-8 flex items-start justify-between">
                    <Icon className={viol ? "text-viol" : "text-elec"} size={30} strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-mono text-xs text-gray-600">{s.index}</span>
                  </div>
                  <h3 className="mb-3 font-syne text-xl font-bold uppercase tracking-wide">{s.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-400">{s.desc}</p>
                  <ul className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li key={t} className="rounded border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
