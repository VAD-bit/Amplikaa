import Link from "next/link";
import { Instagram, Youtube, Linkedin } from "lucide-react";
import { BRAND, CONTACT, NAV_LINKS, EDITION } from "@/lib/config";
import { WaIcon } from "@/components/icons/wa-icon";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper-2 text-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 flex w-fit cursor-pointer items-center gap-3" aria-label="AMPLIKAA — Inicio">
              <span className="h-3 w-3 bg-elec" aria-hidden="true" />
              <span className="font-syne text-2xl font-bold uppercase tracking-tight text-ink">
                AMPLIK<span className="italic">AA</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-ink">
              {BRAND.claim}. Digital ecosystems, production y development desde {BRAND.location} para el mundo.
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
                  className="grid h-10 w-10 cursor-pointer place-items-center border border-ink/40 bg-paper-3 text-ink transition-colors hover:bg-sky"
                >
                  {Icon ? (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Secciones">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">Secciones</p>
            <ul className="space-y-3 text-sm text-ink">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="cursor-pointer transition-colors hover:underline hover:underline-offset-4">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Contacto">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">Contacto</p>
            <ul className="space-y-3 text-sm text-ink">
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:underline hover:underline-offset-4"
                >
                  <WaIcon className="h-4 w-4" aria-hidden="true" />
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li>{BRAND.location}</li>
              <li className="font-mono text-[12px]">Pagos: Pago Móvil · USDT · Efectivo</li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/30 pt-8 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink">
            {EDITION.no} · {EDITION.volume} · Impreso en {BRAND.location} — {BRAND.year}
          </p>
        </div>
      </div>
    </footer>
  );
}
