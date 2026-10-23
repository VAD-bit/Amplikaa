"use client";

import { Instagram, ArrowUpRight, Play, Lock } from "lucide-react";
import { CLIENTS, REELS, igProfile } from "@/lib/config";
import { reelPosterURI } from "@/lib/placeholders";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";

export function Clients() {
  return (
    <section id="clientes" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="tit-clientes">
      <div className="aurora -left-32 top-32 h-[480px] w-[480px] bg-viol/15" aria-hidden="true" />
      <div className="aurora -right-24 bottom-0 h-[440px] w-[440px] bg-elec/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-clientes"
          no="03"
          kicker="Repertorio de clientes"
          title={
            <>
              Marcas con las que<br />
              <span className="text-gradient italic">hacemos marketing</span>
            </>
          }
          deck="Marcas reales con identidad reservada: sector, servicio y estado de gestión sin exponer nombres hasta autorización."
          meta="Clientes bajo confidencialidad"
        />

        <Reveal>
          <div className="rule-double mb-5 flex flex-wrap items-baseline justify-between gap-3 pt-4">
            <p className="label-mono">Reels destacados · Instagram</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
              5 piezas seleccionadas por la redacción
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {REELS.map((reel, i) => (
            <Reveal key={reel.id} delay={i * 0.06}>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full border border-ink/25 bg-paper-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(11,10,8,0.85)]"
                aria-label={`Ver reel de ${reel.client} en Instagram`}
              >
                <div className="relative aspect-9/16 overflow-hidden border-b border-ink/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reelPosterURI(reel.client, reel.tag)}
                    alt={`Reel para ${reel.client}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-paper/90 text-ink transition-colors group-hover:bg-elec">
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="absolute top-2 right-2 z-10 flex items-center gap-1 border border-ink bg-paper/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink backdrop-blur">
                    <Instagram className="h-3 w-3" aria-hidden="true" />
                    IG
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="label-mono mb-1 text-[9px]">{reel.tag}</p>
                  <p className="text-[13px] leading-snug text-ink-soft">{reel.caption}</p>
                  <p className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                    @{reel.handle}
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rule-double mt-16 mb-5 flex flex-wrap items-baseline justify-between gap-3 pt-4">
            <p className="label-mono">Fichero de clientes</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
              Identidad reservada hasta autorización
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <article className="glass relative flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1">
                <span className="tape -top-3 right-6 w-20 rotate-3" aria-hidden="true" />
                <div className="flex items-start justify-between gap-3 border-b border-ink/20 pb-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">{c.sector}</p>
                    <h3 className="headline mt-1 text-xl uppercase">{c.name}</h3>
                  </div>
                  <span className="sticker shrink-0 rotate-2 bg-mark px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-ink">
                    Desde {c.since}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">{c.service}.</span>{" "}
                  Resultado: <span className="bg-mark/70 px-1 font-medium text-ink">{c.result}</span>.
                </p>
                {c.handle ? (
                  <a
                    href={igProfile(c.handle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex cursor-pointer items-center justify-between gap-2 border-t border-ink/20 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:underline hover:underline-offset-4"
                  >
                    <span className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" aria-hidden="true" /> @{c.handle}
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="mt-auto flex items-center gap-2 border-t border-ink/20 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
                    <Lock className="h-4 w-4" aria-hidden="true" /> Identidad reservada
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
