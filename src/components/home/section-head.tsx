import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  no: string;
  kicker: string;
  title: ReactNode;
  deck?: string;
  meta?: string;
  align?: "left" | "center";
  id?: string;
}

export function SectionHead({ no, kicker, title, deck, meta, align = "left", id }: SectionHeadProps) {
  const centered = align === "center";
  return (
    <header className={cn("mb-12", centered && "mx-auto max-w-3xl text-center")}>
      <Reveal>
        <div
          className={cn(
            "rule-double flex flex-wrap items-baseline gap-x-5 gap-y-1 pt-4",
            centered && "justify-center"
          )}
        >
          <span className="font-mono text-[11px] tracking-[0.25em] text-ink-mute">{no}</span>
          <p className="label-mono">{kicker}</p>
          {meta && <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">{meta}</p>}
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className="headline mt-5 text-[clamp(2rem,4.4vw,3.4rem)] uppercase">{title}</h2>
      </Reveal>
      {deck && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-4 max-w-2xl font-syne text-base italic leading-snug text-ink-soft sm:text-lg",
              centered && "mx-auto"
            )}
          >
            {deck}
          </p>
        </Reveal>
      )}
    </header>
  );
}
