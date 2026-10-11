import { FAQS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <section id="faq" className="relative border-t border-white/10 py-28 sm:py-36" aria-labelledby="tit-faq">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="mb-12 text-center">
          <p className="label-mono mb-4">// 06 — Preguntas frecuentes</p>
          <h2 id="tit-faq" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            Resolvemos<br /><span className="text-gradient">tus dudas</span>
          </h2>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible defaultValue="item-0">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
