"use client";

import { useState, useActionState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kpi } from "../_components/kpi";
import { addPago, deletePago, type ActionState } from "../negocio/actions";
import type { EmpleadoUI } from "../empleados/empleados-manager";

export type PagoUI = {
  id: string;
  empleado_id: string;
  monto: number;
  fecha: string;
  periodo: string | null;
  metodo: string | null;
  notas: string | null;
  empleado_nombre?: string | null;
};

const IDLE: ActionState = { status: "idle" };

const METODO_CHIP: Record<string, string> = {
  transferencia: "border-sky/60 text-sky",
  efectivo: "border-mint/60 text-mint",
  zelle: "border-viol/60 text-viol",
  otro: "border-white/15 text-ink-mute",
};

function fmtFecha(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-VE", { day: "2-digit", month: "short" });
}

export function NominaManager({
  pagos,
  empleados,
  needsSetup,
  hoy,
}: {
  pagos: PagoUI[];
  empleados: EmpleadoUI[];
  needsSetup: boolean;
  hoy: string;
}) {
  const [state, action, pending] = useActionState(addPago, IDLE);
  const [filtro, setFiltro] = useState<string>("todos");

  const activos = empleados.filter((e) => e.estado === "activo");
  const mesActual = hoy.slice(0, 7);
  const pagadoMes = pagos.filter((p) => p.fecha.slice(0, 7) === mesActual).reduce((s, p) => s + Number(p.monto), 0);
  const vista = filtro === "todos" ? pagos : pagos.filter((p) => p.empleado_nombre === filtro);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Nómina</p>
          <h1 className="headline text-3xl uppercase">Pagos a equipo</h1>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          <span className="text-mint">{activos.length}</span> activos
        </p>
      </header>

      {needsSetup && (
        <p className="mb-5 border border-naranja/60 bg-naranja/10 p-3 text-sm leading-relaxed text-ink" role="alert">
          Falta la tabla de nómina: aplica{" "}
          <span className="font-mono text-xs">supabase/migrations/0004_planes_rrhh_finanzas.sql</span> en Supabase → SQL
          Editor.
        </p>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Kpi label="Pagado este mes" value={`$${pagadoMes.toFixed(0)}`} labelTone="text-elec" tone="text-elec" />
        <Kpi label="Pagos registrados" value={pagos.length} labelTone="text-ink" />
        <Kpi label="Empleados activos" value={activos.length} labelTone="text-sky" />
      </div>

      <div className="glass-dark mb-6 rounded-xl p-4">
        <p className="label-mono mb-3">Registrar pago</p>
        <form action={action} className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="label-mono mb-1.5 block">Empleado</span>
            <select
              name="empleado_id"
              required
              defaultValue=""
              className="field w-full border border-ink/30 bg-white/6 px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none"
            >
              <option value="" disabled>
                Selecciona…
              </option>
              {activos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} ({e.cargo || "sin cargo"})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Monto (USD)</span>
            <Input name="monto" type="number" min={0.01} step="0.01" placeholder="120" required />
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Fecha</span>
            <Input name="fecha" type="date" defaultValue={hoy} required />
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Método</span>
            <select
              name="metodo"
              defaultValue="transferencia"
              className="field w-full border border-ink/30 bg-white/6 px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none"
            >
              <option value="transferencia">Transferencia</option>
              <option value="efectivo">Efectivo</option>
              <option value="zelle">Zelle</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Periodo</span>
            <Input name="periodo" placeholder="Semana / Quincena" maxLength={40} />
          </label>
          <label className="block">
            <span className="label-mono mb-1.5 block">Notas</span>
            <Input name="notas" maxLength={1000} placeholder="Opcional" />
          </label>
          <div className="sm:col-span-3 flex items-center gap-3">
            <Button type="submit" variant="elec" size="sm" disabled={pending}>
              {pending ? "Guardando…" : <><Plus className="h-4 w-4" aria-hidden="true" /> Registrar pago</>}
            </Button>
            {state.status === "error" && state.message && (
              <span className="text-xs text-elec" role="alert">{state.message}</span>
            )}
            {state.status === "success" && <span className="text-xs text-mint">{state.message}</span>}
          </div>
        </form>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro("todos")}
          className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            filtro === "todos" ? "border-sky bg-sky/15 text-sky" : "border-white/15 text-ink-mute hover:text-ink"
          }`}
        >
          Todos
        </button>
        {empleados
          .filter((e) => e.estado === "activo")
          .map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setFiltro(filtro === e.nombre ? "todos" : e.nombre)}
              className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                filtro === e.nombre ? "border-mint bg-mint/15 text-mint" : "border-white/15 text-ink-mute hover:text-ink"
              }`}
            >
              {e.nombre}
            </button>
          ))}
      </div>

      <ul className="divide-y divide-ink/15 glass-dark rounded-xl">
        {vista.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span className="w-16 shrink-0 font-mono text-[10px] uppercase text-ink-mute">{fmtFecha(p.fecha)}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{p.empleado_nombre ?? "—"}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                {p.periodo ?? "pago único"}
              </span>
            </span>
            <span
              className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${METODO_CHIP[p.metodo ?? ""] ?? "border-white/15 text-ink-mute"}`}
            >
              {p.metodo ?? "—"}
            </span>
            <span className="w-24 text-right font-mono text-sm text-elec">−${Number(p.monto).toFixed(2)}</span>
            <form action={deletePago}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" aria-label="Eliminar pago" className="p-1 text-ink-mute transition-colors hover:text-elec">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </li>
        ))}
        {vista.length === 0 && (
          <li className="px-4 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
            Sin pagos
          </li>
        )}
      </ul>
    </div>
  );
}
