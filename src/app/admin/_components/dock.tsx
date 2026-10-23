"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Sparkles,
  LayoutGrid,
  LogOut,
  CreditCard,
  CircleDollarSign,
  Banknote,
  UserRound,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../actions";
import { cn } from "@/lib/utils";

type Item = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  exact?: boolean;
  action?: boolean;
  toggle?: boolean;
};

const ITEMS: Item[] = [
  { key: "panel", label: "Panel", icon: <LayoutDashboard className="h-5 w-5" aria-hidden="true" />, href: "/admin", exact: true },
  { key: "leads", label: "Leads", icon: <Inbox className="h-5 w-5" aria-hidden="true" />, href: "/admin/leads" },
  { key: "clientes", label: "Clientes", icon: <Users className="h-5 w-5" aria-hidden="true" />, href: "/admin/clientes" },
  { key: "ia", label: "IA", icon: <Sparkles className="h-5 w-5" aria-hidden="true" />, href: "/admin/ia" },
  { key: "mas", label: "Más", icon: <LayoutGrid className="h-5 w-5" aria-hidden="true" />, toggle: true },
  { key: "salir", label: "Salir", icon: <LogOut className="h-5 w-5" aria-hidden="true" />, action: true },
];

const MENU: Item[] = [
  { key: "planes", label: "Planes", icon: <CreditCard className="h-5 w-5" aria-hidden="true" />, href: "/admin/planes" },
  { key: "finanzas", label: "Finanzas", icon: <CircleDollarSign className="h-5 w-5" aria-hidden="true" />, href: "/admin/finanzas" },
  { key: "nomina", label: "Nómina", icon: <Banknote className="h-5 w-5" aria-hidden="true" />, href: "/admin/nomina" },
  { key: "empleados", label: "Empleados", icon: <UserRound className="h-5 w-5" aria-hidden="true" />, href: "/admin/empleados" },
  { key: "metricas", label: "Métricas", icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />, href: "/admin/metricas" },
];

/** Todas las secciones en una lista (para el menú móvil con hamburguesa). */
const ALL_LINKS: Item[] = [
  ...ITEMS.filter((i) => i.href),
  ...MENU,
];

export function PanelDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const edge = useRef(false);
  const over = useRef(false);

  const update = () => setOpen(edge.current || over.current);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      edge.current = true;
      update();
      return;
    }
    const onMove = (e: PointerEvent) => {
      if (e.clientY <= 100) edge.current = true;
      else if (e.clientY > 140) edge.current = false;
      update();
    };
    const onLeave = () => {
      edge.current = false;
      over.current = false;
      update();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("visibilitychange", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cerrar menú móvil al cambiar de ruta o con Escape
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const n = ITEMS.length;

  return (
    <>
      {/* ---------- Móvil (<640px): hamburguesa + panel desplegable con scroll ---------- */}
      <div className="fixed top-3 right-3 z-50 sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Cerrar menú del panel" : "Abrir menú del panel"}
          className="glass-dark grid h-12 w-12 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors hover:text-ink"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>

        {mobileOpen && (
          <div
            className="glass-dark absolute top-14 right-0 w-64 origin-top-right overflow-y-auto overscroll-contain rounded-xl p-2"
            style={{ maxHeight: "calc(100dvh - 5.5rem)" }}
          >
            <nav className="flex flex-col gap-1" aria-label="Secciones del panel">
              {ALL_LINKS.map((it) => {
                const isActive = pathname === it.href || pathname.startsWith(`${it.href}/`);
                return (
                  <Link
                    key={it.key}
                    href={it.href!}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors",
                      isActive ? "bg-sky/20 text-sky" : "text-ink-soft hover:bg-white/8 hover:text-ink"
                    )}
                  >
                    {it.icon}
                    {it.label}
                  </Link>
                );
              })}
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-[11px] tracking-widest text-ink-soft uppercase transition-colors hover:bg-white/8 hover:text-elec"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  Salir
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>

      {/* ---------- Escritorio (≥640px): dock en arco ---------- */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden justify-center pt-3 transition-transform duration-150 ease-out sm:flex",
          open ? "translate-y-0" : "pointer-events-none -translate-y-[160%]"
        )}
        onMouseEnter={() => {
          over.current = true;
          update();
        }}
        onMouseLeave={() => {
          over.current = false;
          update();
        }}
        onFocus={() => {
          edge.current = true;
          update();
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <nav className="flex items-start gap-2" aria-label="Navegación del panel" aria-hidden={!open}>
            {ITEMS.map((it, i) => {
              const d = active === null ? Infinity : Math.abs(i - active);
              const t = n === 1 ? 0 : (2 * i) / (n - 1) - 1;
              const arcY = 12 * t * t;
              const scale = 1 + 0.45 * Math.max(0, 1 - d / 1.7);
              const drop = 8 * Math.max(0, 1 - d / 1.9);
              const style: CSSProperties = {
                transform: `translateY(${arcY + drop}px) scale(${scale})`,
                transformOrigin: "top center",
              };
              const isActive = it.toggle ? menu : !!it.href && (it.exact ? pathname === it.href : pathname.startsWith(it.href));
              const circleCls = cn(
                "glass-dark relative grid h-12 w-12 cursor-pointer place-items-center rounded-full transition-[background-color,color,box-shadow] duration-150",
                isActive
                  ? "bg-sky text-paper shadow-[0_10px_24px_-14px_rgba(196,233,241,0.7)]"
                  : "text-ink-soft hover:bg-white/10 hover:text-ink"
              );
              const label =
                active === i && open ? (
                  <span className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-md border border-white/15 bg-paper-3 px-2 py-1 font-mono text-[10px] tracking-widest whitespace-nowrap text-ink uppercase shadow-lg">
                    {it.label}
                  </span>
                ) : null;
              const handlers = {
                onMouseEnter: () => setActive(i),
                onMouseLeave: () => setActive(null),
              };

              if (it.toggle) {
                return (
                  <button
                    key={it.key}
                    type="button"
                    style={style}
                    className="transition-transform duration-150 ease-out"
                    aria-expanded={menu}
                    aria-label="Más secciones"
                    onClick={() => setMenu((v) => !v)}
                    {...handlers}
                  >
                    <span className={circleCls}>
                      {it.icon}
                      {label}
                    </span>
                  </button>
                );
              }

              if (it.action) {
                return (
                  <form key={it.key} action={logout} style={style} className="transition-transform duration-150 ease-out" {...handlers}>
                    <button type="submit" className={circleCls} aria-label={it.label}>
                      {it.icon}
                      {label}
                    </button>
                  </form>
                );
              }

              return (
                <Link
                  key={it.key}
                  href={it.href!}
                  style={style}
                  className="transition-transform duration-150 ease-out"
                  aria-current={isActive ? "page" : undefined}
                  {...handlers}
                >
                  <span className={circleCls}>
                    {it.icon}
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <nav
            className={cn(
              "flex items-start gap-2 transition-all duration-150 ease-out",
              menu && open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            )}
            aria-label="Más secciones del panel"
          >
            {MENU.map((it) => {
              const isActive = pathname.startsWith(it.href!);
              return (
                <Link
                  key={it.key}
                  href={it.href!}
                  title={it.label}
                  aria-label={it.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenu(false)}
                  className="transition-transform duration-150 hover:scale-110"
                >
                  <span
                    className={cn(
                      "glass-dark grid h-12 w-12 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-150",
                      isActive
                        ? "bg-sky text-paper shadow-[0_10px_24px_-14px_rgba(196,233,241,0.7)]"
                        : "text-ink-soft hover:bg-white/10 hover:text-ink"
                    )}
                  >
                    {it.icon}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
