"use client";

import { useActionState, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kpi } from "../_components/kpi";
import { addMov, deleteMov, type ActionState } from "../negocio/actions";

export type MovUI = {
  id: string;
  fecha: string;
  tipo: string;
  concepto: string;
  monto: number;
  categoria: string;
  notas: string;
};

const IDLE: ActionState = { status: "idle" };

const CATEGORIAS = ["cliente", "pauta", "herramientas", "nomina", "operacion", "otros"] as const;

function fmtFecha(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-VE", { day: "2-digit", month: "short" });
}

export function FinanzasManager({
  movs,
  needsSetup,
}: {
  movs: MovUI[];
  needsSetup: boolean;
}) {
  const [state, action, pending] = useActionState(addMov, IDLE);
  const [filtro, setFiltro] = useState<"todos" | "ingreso" | "egreso">("todos");
  const hoy = new Date().toISOString().slice(0, 10);
  const mesActual = hoy.slice(0, 7);

  const ingresosMes = movs
    .filter((m) => m.tipo === "ingreso" && m.fecha.slice(0, 7) === mesActual)
    .reduce((s, m) => s + Number(m.monto), 0);
  const egresosMes = movs
    .filter((m) => m.tipo === "egreso" && m.fecha.slice(0, 7) === mesActual)
    .reduce((s, m) => s + Number(m.monto), 0);
  const balance = ingresosMes - egresosMes;

  const vista = filtro === "todos" ? movs : movs.filter((m) => m.tipo === filtro);

  const filtros: { key: typeof filtro; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "ingreso", label: "Ingresos" },
    { key: "egreso", label: "Egresos" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <p className="label-mono">Finanzas</p>
        <h1 className="headline text-3xl uppercase">Ingresos y egresos</h1>
      </header>

      {needsSetup && (
        <p className="mb-5 border border-naranja/60 bg-naranja/10 p-3 text-sm leading-relaxed text-ink" role="alert">
          Falta la tabla de finanzas: aplica{" "}
          <span className="font-mono text-xs">supabase/migrations/0004_planes_rrhh_finanzas.sql</span> en Supabase → SQL
          Editor.
        </p>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Kpi label="Ingresos del mes" value={`$${ingresosMes.toFixed(0)}`} labelTone="text-mint" tone="text-mint" />
        <Kpi label="Egresos del mes" value={`$${egresosMes.toFixed(0)}`} labelTone="text-elec" tone="text-elec" />
        <Kpi
          label="Balance del mes"
          value={`${balance < 0 ? "−$" : "$"}${Math.abs(balance).toFixed(0)}`}
          labelTone="text-sky"
          tone={balance < 0 ? "text-elec" : "text-mint"}
        />
      </div>

      <div className="glass-dark mb-6 rounded-xl p-4">
        <p className="label-mono mb-3">Registrar movimiento</p>
        <form action={action} className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label-mono mb-1.5 block">Tipo</span>
            <select
              name="tipo"
              defaultValue="ingreso"
              className="field w-full border border-ink/30 bg-white/6 px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none"
            >
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Concepto</span>
            <Input name="concepto" placeholder="Plan Crecimiento · Finora" required maxLength={140} />
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Monto (USD)</span>
            <Input name="monto" type="number" min={0.01} step="0.01" placeholder="150" required />
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Categoría</span>
            <select
              name="categoria"
              defaultValue="cliente"
              className="field w-full border border-ink/30 bg-white/6 px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Fecha</span>
            <Input name="fecha" type="date" defaultValue={hoy} required />
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Notas</span>
            <Input name="notas" placeholder="Opcional" maxLength={1000} />
          </label>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Button type="submit" variant="elec" size="sm" disabled={pending}>
              {pending ? "Guardando…" : <><Plus className="h-4 w-4" aria-hidden="true" /> Registrar</>}
            </Button>
            {state.status === "error" && state.message && (
              <span className="text-xs text-elec" role="alert">{state.message}</span>
            )}
            {state.status === "success" && <span className="text-xs text-mint">{state.message}</span>}
          </div>
        </form>
      </div>

      <div className="mb-3 flex gap-2">
        {filtros.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFiltro(f.key)}
            className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              filtro === f.key ? "border-sky bg-sky/15 text-sky" : "border-white/15 text-ink-mute hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-ink/15 glass-dark rounded-xl">
        {vista.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                m.tipo === "ingreso" ? "border-mint/60 text-mint" : "border-elec/60 text-elec"
              }`}
              aria-hidden="true"
            >
              {m.tipo === "ingreso" ? (
                <ArrowDownRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="w-16 shrink-0 font-mono text-[10px] uppercase text-ink-mute">{fmtFecha(m.fecha)}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{m.concepto}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute">{m.categoria}</span>
            </span>
            <span className={`w-24 text-right font-mono text-sm ${m.tipo === "ingreso" ? "text-mint" : "text-elec"}`}>
              {m.tipo === "ingreso" ? "+" : "−"}${Number(m.monto).toFixed(2)}
            </span>
            <form action={deleteMov}>
              <input type="hidden" name="id" value={m.id} />
              <button type="submit" aria-label="Eliminar movimiento" className="p-1 text-ink-mute transition-colors hover:text-elec">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </li>
        ))}
        {vista.length === 0 && (
          <li className="px-4 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
            Sin movimientos
          </li>
        )}
      </ul>
    </div>
  );
}
