import { PROCESS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
import { cn } from "@/lib/utils";

export function Process() {
  return (
    <section id="proceso" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="tit-proceso">
      <div className="aurora -left-24 bottom-0 h-[420px] w-[420px] bg-elec/15" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-proceso"
          no="05"
          kicker="Método"
          title={
            <>
              De la idea<br />
              <span className="text-gradient italic">al sistema vivo</span>
            </>
          }
          deck="Cuatro entregas por fases, con revisión en cada una. Sin cajas negras ni sorpresas al final."
          meta="Trabajo por fases"
        />

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08}>
              <li className="glass relative h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(23,20,15,0.85)]">
                <div className="flex items-start justify-between border-b border-ink/20 pb-4">
                  <span
                    className={cn(
                      "headline text-5xl leading-none",
                      "text-ink"
                    )}
                    aria-hidden="true"
                  >
                    {p.n}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
                    Entrega {i + 1}/4
                  </span>
                </div>
                <h3 className="headline mt-4 mb-2.5 text-lg uppercase">{p.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{p.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
