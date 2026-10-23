"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS, EDITION } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Móvil: bloquear scroll del body y cerrar con Escape mientras el menú está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-60 transition-all duration-300",
        scrolled ? "glass-strong border-b border-ink/25" : "bg-paper/70 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex cursor-pointer items-center gap-3" aria-label="AMPLIKAA — Inicio">
          <span className="h-3 w-3 shrink-0 bg-elec transition-transform group-hover:rotate-45" aria-hidden="true" />
          <span className="font-syne text-xl font-bold uppercase tracking-tight">
            AMPLIK<span className="text-gradient">AA</span>
          </span>
          <span className="hidden font-mono text-[9px] uppercase leading-tight tracking-[0.2em] text-ink-mute xl:block">
            {EDITION.no}
            <br />
            {EDITION.date}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="hidden cursor-pointer items-center gap-2 border border-ink/40 bg-sky px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-elec sm:inline-flex"
          >
            Construir mi sitio
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center border border-ink/35 text-ink transition-colors hover:border-ink hover:bg-elec lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <motion.div
        className="h-[3px] origin-left bg-ink"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-ink/25 bg-paper-3/97 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-1 px-5 py-6" aria-label="Móvil">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer border-b border-dashed border-ink/20 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:bg-mark/40 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/studio"
              onClick={() => setOpen(false)}
              className="mt-4 cursor-pointer border border-ink/40 bg-sky px-4 py-3 text-center font-semibold text-ink"
            >
              Construye tu Website
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
