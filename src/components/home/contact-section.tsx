import { Mail } from "lucide-react";
import { CONTACT } from "@/lib/config";
import { WaIcon } from "@/components/icons/wa-icon";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";

export function ContactSection({ defaultServicio, defaultPresupuesto }: { defaultServicio?: string; defaultPresupuesto?: string }) {
  return (
    <section id="contacto" className="relative overflow-hidden py-28 sm:py-36" aria-labelledby="tit-contacto">
      <div className="aurora bottom-0 left-1/4 h-[500px] w-[500px] bg-elec/10" aria-hidden="true" />
      <div className="aurora -bottom-20 right-0 h-[420px] w-[420px] bg-viol/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="label-mono mb-4">// 07 — Contacto</p>
            <h2 id="tit-contacto" className="font-syne text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Contrata<br /><span className="text-gradient">desde aquí</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Cuéntanos qué necesitas. Respondemos en menos de 24 horas con un plan de acción y presupuesto claro.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-pointer items-center gap-4 rounded-xl glass p-5 transition-colors hover:border-elec/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-elec/10">
                  <WaIcon className="h-5 w-5 text-elec" />
                </span>
                <span>
                  <span className="block font-semibold transition-colors group-hover:text-elec">WhatsApp directo</span>
                  <span className="block font-mono text-sm text-gray-500">{CONTACT.whatsappDisplay}</span>
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="group flex cursor-pointer items-center gap-4 rounded-xl glass p-5 transition-colors hover:border-viol/60"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-viol/10">
                  <Mail className="h-5 w-5 text-viol" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold transition-colors group-hover:text-viol">Correo</span>
                  <span className="block font-mono text-sm text-gray-500">{CONTACT.email}</span>
                </span>
              </a>
            </div>
          </Reveal>

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
