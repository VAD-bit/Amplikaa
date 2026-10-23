"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { METRICS, SECTORS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    const el = ref.current;
    const dur = 1400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = `${prefix}${Math.round(target * (1 - Math.pow(1 - p, 3)))}${suffix}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, prefix, suffix, reduce]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function MetricsMarquee() {
  return (
    <>
      <section className="relative border-y-2 border-ink bg-elec" aria-label="Sectores que atendemos">
        <div className="flex items-stretch">
          <span className="z-10 flex shrink-0 items-center gap-2 border-r-2 border-ink bg-mark px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink sm:px-6">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" />
            Última hora
          </span>
          <div className="overflow-hidden py-2.5">
            <div className="animate-marquee flex w-max gap-10 whitespace-nowrap" aria-hidden="true">
              {[...SECTORS, ...SECTORS].map((s, i) => (
                <span key={`${s}-${i}`} className="flex items-center gap-10">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">{s}</span>
                  <span className="text-ink">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8" aria-label="Métricas">
        <Reveal>
          <div className="rule-double flex items-baseline justify-between gap-4 pt-4">
            <p className="label-mono">La agencia en cifras</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">Datos de esta edición</p>
          </div>
        </Reveal>
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06}>
              <div className="metric-card h-full px-5 py-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-mute">{m.label}</dt>
                <dd className="headline mt-2 text-3xl sm:text-4xl">
                  <Counter target={m.target} prefix={"prefix" in m ? m.prefix : ""} suffix={m.suffix} />
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
