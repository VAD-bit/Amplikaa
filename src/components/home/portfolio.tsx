"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, ExternalLink } from "lucide-react";
import { WORKS, WORK_CATS, WORK_CAT_LABELS, type Work, type WorkCat } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
import { cn } from "@/lib/utils";

function thumbURI(w: Work) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${w.c1}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${w.c2}" stop-opacity="0.95"/>
      </linearGradient>
      <pattern id="d" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2.2" cy="2.2" r="1.8" fill="#0b0a08" fill-opacity="0.32"/>
      </pattern>
    </defs>
    <rect width="900" height="640" fill="#f2ece0"/>
    <rect width="900" height="640" fill="url(#g)" opacity="0.75"/>
    <circle cx="700" cy="130" r="250" fill="#ffffff" fill-opacity="0.35"/>
    <rect width="900" height="640" fill="url(#d)" opacity="0.55"/>
    <g opacity=".25" stroke="#0b0a08" stroke-width="1">
      <path d="M0 160h900M0 320h900M0 480h900M225 0v640M450 0v640M675 0v640"/>
    </g>
    <rect x="0" y="516" width="900" height="124" fill="#f6f1e7"/>
    <rect x="0" y="512" width="900" height="4" fill="#0b0a08"/>
    <text x="56" y="586" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700" fill="#0b0a08">${w.title.split("—")[0].trim().toUpperCase()}</text>
    <text x="58" y="618" font-family="'Courier New', monospace" font-size="15" fill="#0b0a08" fill-opacity="0.65" letter-spacing="4">AMPLIKAA // ${WORK_CAT_LABELS[w.cat].toUpperCase()}</text>
    <rect x="30" y="30" width="16" height="8" fill="#0b0a08"/>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export function Portfolio() {
  const [filter, setFilter] = useState<WorkCat | "all">("all");
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const items = useMemo(
    () => WORKS.filter((w) => filter === "all" || w.cat === filter),
    [filter]
  );

  const open = useCallback((id: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setLbIndex(items.findIndex((w) => w.id === id));
  }, [items]);

  const close = useCallback(() => {
    setLbIndex(null);
    lastFocus.current?.focus();
  }, []);

  const step = useCallback(
    (dir: number) => {
      setLbIndex((i) => (i === null ? null : (i + dir + items.length) % items.length));
    },
    [items.length]
  );

  useEffect(() => {
    if (lbIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [lbIndex, close, step]);

  const active = lbIndex !== null ? items[lbIndex] : null;

  return (
    <section
      id="trabajos"
      className="relative border-y-2 border-ink bg-paper-2 py-24 sm:py-32"
      aria-labelledby="tit-trabajos"
    >
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-trabajos"
          no="02"
          kicker="Catálogo"
          title={
            <>
              El trabajo<br />
              <span className="text-gradient italic">habla solo</span>
            </>
          }
          deck="Sitios en vivo, sistemas lanzados, identidades y producciones reales. Toca una pieza para verla o visita el sitio publicado."
          meta="Suplemento tecnológico"
        />

        <Reveal className="mb-9">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar portafolio">
            {WORK_CATS.map((c) => {
              const isActive = filter === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setFilter(c.key)}
                  aria-pressed={isActive}
                  className={cn(
                    "cursor-pointer border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all",
                    isActive
                      ? "border-ink bg-sky text-ink shadow-[3px_3px_0_rgba(11,10,8,0.85)]"
                      : "border-ink/30 bg-paper-3/50 text-ink-soft hover:border-ink hover:text-ink"
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.05}>
              <article
                className="work-card group relative h-full cursor-pointer border border-ink/25 bg-paper-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(23,20,15,0.85)]"
                data-id={w.id}
                tabIndex={0}
                role="button"
                aria-label={`Ver proyecto ${w.title}`}
                onClick={() => open(w.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(w.id);
                  }
                }}
              >
                <span
                  className={cn(
                    "absolute left-3 top-3 z-10 border border-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
                    w.type === "video" ? "bg-elec text-ink" : "bg-mark text-ink"
                  )}
                >
                  {w.type === "video" ? "Video" : "Caso"}
                </span>
                <div className="relative aspect-4/3 overflow-hidden border-b border-ink/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.thumb || thumbURI(w)}
                    alt={w.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  {w.type === "video" && (
                    <span className="absolute inset-0 z-10 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center border-2 border-ink bg-paper/90 text-ink transition-colors group-hover:bg-elec">
                        <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="label-mono mb-1.5 text-[10px]">{WORK_CAT_LABELS[w.cat]}</p>
                  <h3 className="headline text-lg uppercase">{w.title}</h3>
                  {w.url && (
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:underline hover:underline-offset-4"
                    >
                      Visitar sitio
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-paper/96 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de proyecto"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 grid h-11 w-11 cursor-pointer place-items-center border border-ink bg-paper-3 text-ink transition-colors hover:bg-mark"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center border border-ink bg-paper-3 text-ink transition-colors hover:bg-mark sm:left-6"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center border border-ink bg-paper-3 text-ink transition-colors hover:bg-mark sm:right-6"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <figure className="w-full max-w-4xl">
            <div className="overflow-hidden border-2 border-ink bg-paper-3">
              {active.type === "video" ? (
                <video
                  key={active.id}
                  className="max-h-[62vh] w-full bg-paper-3"
                  controls
                  playsInline
                  preload="none"
                  poster={active.thumb || thumbURI(active)}
                >
                  <source src={active.video} type="video/mp4" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.thumb || thumbURI(active)}
                  alt={active.title}
                  className="max-h-[62vh] w-full bg-paper-3 object-contain"
                />
              )}
            </div>
            <figcaption className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-syne text-lg font-bold uppercase tracking-wide text-ink">{active.title}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
                  {WORK_CAT_LABELS[active.cat]} // AMPLIKAA
                </p>
              </div>
              {active.url && (
                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 self-start border border-ink bg-mark px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-elec"
                >
                  Visitar sitio en vivo
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
