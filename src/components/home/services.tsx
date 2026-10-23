"use client";

import { Globe, Video, Code2, Palette, TrendingUp, MessageSquare } from "lucide-react";
import { SERVICES, type ServiceIcon } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
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
    <section id="servicios" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="tit-servicios">
      <div className="aurora -top-20 right-0 h-[420px] w-[420px] bg-sky/25" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-servicios"
          no="01"
          kicker="Los oficios"
          title={
            <>
              Un ecosistema,<br />
              <span className="text-gradient italic">no piezas sueltas</span>
            </>
          }
          deck="Cada servicio se conecta con el siguiente: de la identidad al contenido, del contenido al sitio, del sitio al cliente."
          meta="Seis redacciones"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            const viol = s.accent === "viol";
            return (
              <Reveal key={s.index} delay={i * 0.06}>
                <article
                  className={cn(
                    "group glass relative h-full cursor-default p-7 transition-all duration-300",
                    viol ? "hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(11,10,8,0.85)]" : "hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(11,10,8,0.85)]"
                  )}
                >
                  <div className="mb-6 flex items-start justify-between border-b border-ink/20 pb-4">
                    <span
                      className={cn(
                        "grid h-11 w-11 place-items-center border border-ink/25 bg-paper-3/70",
                        viol ? "text-ink" : "text-ink"
                      )}
                    >
                      <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-ink-mute">{s.index}</span>
                  </div>
                  <h3 className="headline mb-3 text-xl uppercase">{s.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                  <ul className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="border border-ink/25 bg-paper-3/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft"
                      >
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
