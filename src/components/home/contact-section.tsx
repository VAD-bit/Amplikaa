import { Wallet } from "lucide-react";
import { CONTACT, PAYMENTS } from "@/lib/config";
import { WaIcon } from "@/components/icons/wa-icon";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";

export function ContactSection({ defaultServicio, defaultPresupuesto }: { defaultServicio?: string; defaultPresupuesto?: string }) {
  return (
    <section id="contacto" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="tit-contacto">
      <div className="aurora bottom-0 left-1/4 h-[500px] w-[500px] bg-elec/15" aria-hidden="true" />
      <div className="aurora -bottom-20 right-0 h-[420px] w-[420px] bg-viol/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead
              id="tit-contacto"
              no="10"
              kicker="Contacto"
              title={
                <>
                  Contrata<br />
                  <span className="text-gradient italic">desde aquí</span>
                </>
              }
              deck="Cuéntanos qué necesitas. Respondemos en menos de 24 horas con un plan de acción y presupuesto claro."
            />

            <Reveal>
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex cursor-pointer items-center gap-4 border border-ink/25 bg-paper-3/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_rgba(11,10,8,0.85)]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-ink/25 bg-elec/10">
                    <WaIcon className="h-5 w-5 text-ink" />
                  </span>
                  <span>
                    <span className="block font-semibold transition-colors group-hover:text-ink">WhatsApp directo</span>
                    <span className="block font-mono text-sm text-ink-mute">{CONTACT.whatsappDisplay}</span>
                  </span>
                </a>
                <div className="flex cursor-pointer items-center gap-4 border border-ink/25 bg-paper-3/70 p-5 backdrop-blur">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-ink/25 bg-viol/10">
                    <Wallet className="h-5 w-5 text-ink" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">Métodos de pago</span>
                    <span className="block font-mono text-sm text-ink-mute">{PAYMENTS.join(" · ")}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div id="formulario">
              <LeadForm
                id="contact-form"
                defaultValues={
                  defaultServicio
                    ? { servicio: defaultServicio, presupuesto: defaultPresupuesto ?? "" }
                    : undefined
                }
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
