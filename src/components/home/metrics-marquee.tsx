"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { METRICS, SECTORS } from "@/lib/config";

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
      <section className="border-y border-white/10 bg-obsidian/60 py-5" aria-label="Sectores que atendemos">
        <div className="marquee overflow-hidden">
          <div className="animate-marquee flex w-max gap-12 whitespace-nowrap" aria-hidden="true">
            {[...SECTORS, ...SECTORS].map((s, i) => (
              <span key={`${s}-${i}`} className="flex items-center gap-12">
                <span className="label-mono text-gray-500">{s}</span>
                <span className={i % 2 ? "text-viol" : "text-elec"}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-16 max-w-7xl px-5 sm:px-8" aria-label="Métricas">
        <dl className="grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-ink/80 px-5 py-6 backdrop-blur">
              <dt className="label-mono mb-2">{m.label}</dt>
              <dd className="font-syne text-3xl font-extrabold">
                <Counter target={m.target} prefix={"prefix" in m ? m.prefix : ""} suffix={m.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
