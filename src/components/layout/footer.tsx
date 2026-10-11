import Link from "next/link";
import { Instagram, Youtube, Linkedin } from "lucide-react";
import { BRAND, CONTACT, NAV_LINKS } from "@/lib/config";
import { WaIcon } from "@/components/icons/wa-icon";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 flex w-fit cursor-pointer items-center gap-3" aria-label="AMPLIKAA — Inicio">
              <span className="h-2.5 w-2.5 rounded-full bg-elec" aria-hidden="true" />
              <span className="font-syne text-2xl font-extrabold uppercase tracking-tight">
                AMPLIK<span className="text-gradient">AA</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">
              {BRAND.claim}. Digital ecosystems, production y development desde Venezuela para el mundo.
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://instagram.com/", label: "Instagram", Icon: Instagram },
                { href: "https://tiktok.com/", label: "TikTok", Icon: null },
                { href: "https://youtube.com/", label: "YouTube", Icon: Youtube },
                { href: "https://linkedin.com/", label: "LinkedIn", Icon: Linkedin },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-elec/50 hover:text-elec"
                >
                  {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Servicios">
            <p className="label-mono mb-5">Servicios</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#servicios" className="cursor-pointer transition-colors hover:text-elec">Ecosistemas Digitales</a></li>
              <li><a href="#servicios" className="cursor-pointer transition-colors hover:text-elec">Producción Audiovisual</a></li>
              <li><a href="#servicios" className="cursor-pointer transition-colors hover:text-elec">Desarrollo a Medida</a></li>
              <li><a href="#servicios" className="cursor-pointer transition-colors hover:text-elec">Branding & Diseño</a></li>
              <li><a href="#planes" className="cursor-pointer transition-colors hover:text-elec">Planes mensuales</a></li>
            </ul>
          </nav>

          <nav aria-label="Contacto">
            <p className="label-mono mb-5">Contacto</p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-elec"
                >
                  <WaIcon className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
              <li><a href={`mailto:${CONTACT.email}`} className="cursor-pointer transition-colors hover:text-elec">{CONTACT.email}</a></li>
              <li className="text-gray-600">{BRAND.location}</li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-600">
            AMPLIKAA Executive Identity — {BRAND.year}
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] text-gray-600">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-white/30 bg-obsidian" />#0A0A0A</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-elec" />#00F0FF</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-viol" />#7B2CBF</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
