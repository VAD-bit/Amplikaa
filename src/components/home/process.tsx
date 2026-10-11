import { PROCESS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Process() {
  return (
    <section id="proceso" className="relative py-28 sm:py-36" aria-labelledby="tit-proceso">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-16 max-w-3xl">
          <p className="label-mono mb-4">// 03 — Proceso</p>
          <h2 id="tit-proceso" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            De la idea<br /><span className="text-gradient">al sistema vivo</span>
          </h2>
        </Reveal>

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08}>
              <li className="corners glass relative h-full rounded-2xl p-8">
                <span
                  className={cn(
                    "font-mono text-4xl font-bold",
                    p.accent === "elec" ? "text-elec/30" : "text-viol/40"
                  )}
                  aria-hidden="true"
                >
                  {p.n}
                </span>
                <h3 className="mt-4 mb-3 font-syne text-lg font-bold uppercase tracking-wide">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{p.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
