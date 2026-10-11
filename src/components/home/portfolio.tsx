"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, ExternalLink } from "lucide-react";
import { WORKS, WORK_CATS, WORK_CAT_LABELS, type Work, type WorkCat } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

function thumbURI(w: Work) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${w.c1}" stop-opacity=".85"/>
        <stop offset="100%" stop-color="${w.c2}" stop-opacity=".9"/>
      </linearGradient>
      <radialGradient id="v" cx=".3" cy=".2" r="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity=".14"/>
        <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="900" height="640" fill="#0A0A0A"/>
    <rect width="900" height="640" fill="url(#g)" opacity=".22"/>
    <circle cx="720" cy="120" r="260" fill="url(#g)" opacity=".3"/>
    <circle cx="140" cy="540" r="200" fill="url(#g)" opacity=".2"/>
    <rect width="900" height="640" fill="url(#v)"/>
    <g opacity=".25" stroke="#ffffff" stroke-width="1">
      <path d="M0 160h900M0 320h900M0 480h900M225 0v640M450 0v640M675 0v640"/>
    </g>
    <text x="60" y="560" font-family="Arial Black, Arial, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">${w.title.split("—")[0].trim().toUpperCase()}</text>
    <text x="62" y="596" font-family="Courier New, monospace" font-size="16" fill="${w.c1}" letter-spacing="4">AMPLIKAA // ${WORK_CAT_LABELS[w.cat].toUpperCase()}</text>
    <rect x="24" y="24" width="16" height="16" fill="none" stroke="#ffffff" stroke-opacity=".4"/>
    <rect x="860" y="600" width="16" height="16" fill="none" stroke="#ffffff" stroke-opacity=".4"/>
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
    <section id="trabajos" className="relative border-y border-white/10 bg-obsidian/40 py-28 sm:py-36" aria-labelledby="tit-trabajos">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-mono mb-4">// 02 — Portafolio</p>
            <h2 id="tit-trabajos" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              El trabajo<br /><span className="text-gradient">habla solo</span>
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-gray-400">
            Sitios en vivo, identidades y producciones reales. Toca una pieza para verla o visita el sitio publicado.
          </p>
        </Reveal>

        <Reveal className="mb-10">
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
                    "cursor-pointer rounded-lg border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all",
                    isActive
                      ? "border-elec/50 bg-elec/10 text-elec"
                      : "border-white/15 text-gray-400 hover:border-white/40 hover:text-white"
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
                className="work-card group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-obsidian"
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
                    "absolute left-4 top-4 z-10 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md",
                    w.type === "video"
                      ? "border-viol bg-viol/80 text-white"
                      : "border-elec/40 bg-black/60 text-elec"
                  )}
                >
                  {w.type === "video" ? "Video" : "Caso"}
                </span>
                <div className="relative aspect-4/3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.thumb || thumbURI(w)}
                    alt={w.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  {w.type === "video" && (
                    <span className="absolute inset-0 z-10 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur transition-colors group-hover:bg-elec group-hover:text-black">
                        <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
                  <p className="label-mono mb-1.5 text-[10px]">{WORK_CAT_LABELS[w.cat]}</p>
                  <h3 className="font-syne text-lg font-bold uppercase leading-tight tracking-wide">{w.title}</h3>
                  {w.url && (
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-elec transition-colors hover:text-white"
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
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de proyecto"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button type="button" onClick={close} className="absolute top-5 right-5 grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-white/20 text-white transition-colors hover:border-elec hover:text-elec" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => step(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg border border-white/20 text-white transition-colors hover:border-elec hover:text-elec sm:left-6" aria-label="Anterior">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => step(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg border border-white/20 text-white transition-colors hover:border-elec hover:text-elec sm:right-6" aria-label="Siguiente">
            <ChevronRight className="h-4 w-4" />
          </button>
          <figure className="w-full max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-obsidian">
              {active.type === "video" ? (
                <video
                  key={active.id}
                  className="max-h-[62vh] w-full bg-black"
                  controls
                  playsInline
                  preload="none"
                  poster={active.thumb || thumbURI(active)}
                >
                  <source src={active.video} type="video/mp4" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.thumb || thumbURI(active)} alt={active.title} className="max-h-[62vh] w-full object-contain bg-obsidian" />
              )}
            </div>
            <figcaption className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-syne text-lg font-bold uppercase tracking-wide">{active.title}</p>
                <p className="label-mono mt-1">{WORK_CAT_LABELS[active.cat]} // AMPLIKAA</p>
              </div>
              {active.url && (
                <a href={active.url} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg bg-elec px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white">
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
