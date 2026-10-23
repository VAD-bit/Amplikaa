import { FAQS } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <section id="faq" className="relative border-t-2 border-ink py-24 sm:py-32" aria-labelledby="tit-faq">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHead
          id="tit-faq"
          no="09"
          kicker="Cartas al director"
          title={
            <>
              Resolvemos<br />
              <span className="text-gradient italic">tus dudas</span>
            </>
          }
          deck="Las preguntas que más llegan a la redacción, respondidas sin vueltas."
          align="center"
        />

        <Reveal>
          <div className="glass p-5 sm:p-7">
            <Accordion type="single" collapsible defaultValue="item-0">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
