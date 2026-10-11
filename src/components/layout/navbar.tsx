"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-60 transition-all duration-300",
        scrolled && "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex cursor-pointer items-center gap-3" aria-label="AMPLIKAA — Inicio">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-elec" aria-hidden="true" />
          <span className="font-syne text-xl font-extrabold uppercase tracking-tight">
            AMPLIK<span className="text-gradient">AA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link cursor-pointer text-sm text-gray-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/studio"
            className="cursor-pointer text-sm text-elec transition-colors hover:text-white"
          >
            Construye tu Website
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="hidden cursor-pointer items-center gap-2 rounded-lg bg-elec px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white sm:inline-flex"
          >
            Construir mi sitio
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-white/15 text-white transition-colors hover:border-elec/60 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1 px-5 py-6" aria-label="Móvil">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-lg px-4 py-3 text-gray-200 transition-colors hover:bg-white/5 hover:text-elec"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/studio"
              onClick={() => setOpen(false)}
              className="mt-3 cursor-pointer rounded-lg bg-elec px-4 py-3 text-center font-semibold text-black"
            >
              Construye tu Website
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
