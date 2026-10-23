"use client";

import { useEffect, useState, useActionState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteEmpleado, saveEmpleado, type ActionState } from "../negocio/actions";

export type EmpleadoUI = {
  id: string;
  nombre: string;
  cargo: string;
  email: string | null;
  telefono: string | null;
  salario_base: number;
  ingreso: string | null;
  estado: string;
  notas: string;
};

const IDLE: ActionState = { status: "idle" };

const ESTADO_CHIP: Record<string, string> = {
  activo: "border-mint/60 text-mint",
  inactivo: "border-elec/60 text-elec",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function EmpleadoForm({ emp, onDone }: { emp?: EmpleadoUI; onDone?: () => void }) {
  const [state, action, pending] = useActionState(saveEmpleado, IDLE);

  useEffect(() => {
    if (state.status === "success") onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="space-y-3">
      {emp && <input type="hidden" name="id" value={emp.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre">
          <Input name="nombre" defaultValue={emp?.nombre ?? ""} required maxLength={80} />
        </Field>
        <Field label="Cargo">
          <Input name="cargo" defaultValue={emp?.cargo ?? ""} placeholder="Dev, Diseño…" maxLength={80} />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" defaultValue={emp?.email ?? ""} maxLength={120} />
        </Field>
        <Field label="Teléfono">
          <Input name="telefono" defaultValue={emp?.telefono ?? ""} maxLength={40} />
        </Field>
        <Field label="Salario base (USD)">
          <Input name="salario_base" type="number" min={0} step="1" defaultValue={emp?.salario_base ?? 0} />
        </Field>
        <Field label="Fecha de ingreso">
          <Input name="ingreso" type="date" defaultValue={emp?.ingreso ?? ""} />
        </Field>
        <Field label="Estado">
          <select
            name="estado"
            defaultValue={emp?.estado ?? "activo"}
            className="field w-full border border-ink/30 bg-white/6 px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </Field>
      </div>
      <Field label="Notas">
        <Textarea name="notas" rows={2} defaultValue={emp?.notas ?? ""} maxLength={2000} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="elec" size="sm" disabled={pending}>
          {pending ? "Guardando…" : emp ? "Guardar cambios" : "Agregar empleado"}
        </Button>
        {state.status === "error" && state.message && (
          <span className="text-xs text-elec" role="alert">{state.message}</span>
        )}
        {state.status === "success" && <span className="text-xs text-mint">{state.message}</span>}
      </div>
    </form>
  );
}

function EmpleadoCard({ emp }: { emp: EmpleadoUI }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="glass-dark rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block truncate font-syne text-base font-bold uppercase">{emp.nombre}</span>
          <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-mute">
            {emp.cargo || "sin cargo"}
            {emp.email ? ` · ${emp.email}` : ""}
          </span>
        </span>
        <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${ESTADO_CHIP[emp.estado] ?? "border-white/15 text-ink-mute"}`}>
          {emp.estado}
        </span>
        <span className="font-mono text-sm text-mint">${Number(emp.salario_base)}/sem</span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ink transition-colors hover:bg-sky/10"
          >
            <Pencil className="h-3 w-3" aria-hidden="true" />
            {open ? "Cerrar" : "Editar"}
          </button>
          <form action={deleteEmpleado}>
            <input type="hidden" name="id" value={emp.id} />
            <button
              type="submit"
              aria-label={`Eliminar ${emp.nombre}`}
              className="border border-white/15 p-1.5 text-ink-mute transition-colors hover:text-elec"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>
        </span>
      </div>
      {open && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <EmpleadoForm emp={emp} onDone={() => setOpen(false)} />
        </div>
      )}
    </li>
  );
}

export function EmpleadosManager({
  empleados,
  needsSetup,
}: {
  empleados: EmpleadoUI[];
  needsSetup: boolean;
}) {
  const [creating, setCreating] = useState(false);
  const activos = empleados.filter((e) => e.estado === "activo").length;
  const nominaSem = empleados
    .filter((e) => e.estado === "activo")
    .reduce((s, e) => s + Number(e.salario_base), 0);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Control de empleados</p>
          <h1 className="headline text-3xl uppercase">Empleados</h1>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          <span className="text-mint">{activos}</span> activos ·{" "}
          <span className="text-mint">${nominaSem}/sem</span> nómina
        </p>
      </header>

      {needsSetup && (
        <p className="mb-5 border border-naranja/60 bg-naranja/10 p-3 text-sm leading-relaxed text-ink" role="alert">
          Falta la tabla de empleados: aplica{" "}
          <span className="font-mono text-xs">supabase/migrations/0004_planes_rrhh_finanzas.sql</span> en Supabase → SQL
          Editor.
        </p>
      )}

      <div className="mb-5">
        <Button type="button" variant="elec" size="sm" onClick={() => setCreating((v) => !v)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo empleado
        </Button>
      </div>

      {creating && (
        <div className="glass-dark mb-5 rounded-xl p-4">
          <EmpleadoForm onDone={() => setCreating(false)} />
        </div>
      )}

      <ul className="space-y-3">
        {empleados.map((e) => (
          <EmpleadoCard key={e.id} emp={e} />
        ))}
        {empleados.length === 0 && !needsSetup && (
          <li className="glass-dark rounded-xl px-4 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
            Sin empleados todavía
          </li>
        )}
      </ul>
    </div>
  );
}
