"use client";

import { useEffect, useState, useActionState } from "react";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deletePlan, savePlan, type ActionState } from "../negocio/actions";

export type PlanRowUI = {
  id: string;
  key: string;
  seccion: string;
  plan_no: string;
  label: string;
  price: number;
  descripcion: string;
  features: unknown;
  entrega: string;
  featured: boolean;
  servicio: string;
  presupuesto: string;
  posicion: number;
  visible: boolean;
};

const IDLE: ActionState = { status: "idle" };

function featText(v: unknown) {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").join("\n") : "";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function PlanForm({ plan, onDone }: { plan?: PlanRowUI; onDone?: () => void }) {
  const [state, action, pending] = useActionState(savePlan, IDLE);

  useEffect(() => {
    if (state.status === "success") onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="space-y-3">
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Sección">
          <select
            name="seccion"
            defaultValue={plan?.seccion ?? "marketing"}
            className="field w-full border border-ink/30 bg-white/6 px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none"
          >
            <option value="marketing">Marketing (semanal)</option>
            <option value="sistemas">Sistemas (proyecto)</option>
          </select>
        </Field>
        <Field label="Clave (slug)">
          <Input name="key" defaultValue={plan?.key ?? ""} placeholder="mi-plan" maxLength={40} required />
        </Field>
        <Field label="Nombre">
          <Input name="label" defaultValue={plan?.label ?? ""} maxLength={60} required />
        </Field>
        <Field label="Nº / rótulo">
          <Input name="plan_no" defaultValue={plan?.plan_no ?? ""} placeholder="Plan 01" maxLength={30} />
        </Field>
        <Field label="Precio (USD)">
          <Input name="price" type="number" min={0} step="1" defaultValue={plan?.price ?? 0} required />
        </Field>
        <Field label="Posición">
          <Input name="posicion" type="number" min={0} max={99} defaultValue={plan?.posicion ?? 0} />
        </Field>
      </div>
      <Field label="Descripción">
        <Textarea name="descripcion" rows={2} maxLength={400} defaultValue={plan?.descripcion ?? ""} />
      </Field>
      <Field label="Características (una por línea)">
        <Textarea name="features" rows={4} maxLength={4000} defaultValue={featText(plan?.features)} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Entrega (sistemas)">
          <Input name="entrega" defaultValue={plan?.entrega ?? ""} placeholder="1–2 semanas" maxLength={60} />
        </Field>
        <Field label="Servicio (contacto)">
          <Input name="servicio" defaultValue={plan?.servicio ?? ""} maxLength={80} />
        </Field>
        <Field label="Presupuesto (contacto)">
          <Input name="presupuesto" defaultValue={plan?.presupuesto ?? ""} placeholder="$100 – $300" maxLength={40} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink">
          <input type="checkbox" name="featured" defaultChecked={plan?.featured ?? false} className="accent-sky" />
          Destacado
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink">
          <input type="checkbox" name="visible" defaultChecked={plan?.visible ?? true} className="accent-sky" />
          Visible en la landing
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="elec" size="sm" disabled={pending}>
          {pending ? "Guardando…" : plan ? "Guardar cambios" : "Crear plan"}
        </Button>
        {state.status === "error" && state.message && (
          <span className="text-xs text-elec" role="alert">{state.message}</span>
        )}
        {state.status === "success" && <span className="text-xs text-mint">{state.message}</span>}
      </div>
    </form>
  );
}

function PlanCard({ plan }: { plan: PlanRowUI }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="glass-dark rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
            plan.seccion === "sistemas" ? "border-sky/60 text-sky" : "border-viol/60 text-viol"
          }`}
        >
          {plan.seccion}
        </span>
        <span className="font-syne text-base font-bold uppercase">{plan.label}</span>
        <span className="font-mono text-sm text-mint">${Number(plan.price)}</span>
        {plan.featured && <Star className="h-3.5 w-3.5 text-naranja" aria-label="Destacado" />}
        {!plan.visible && (
          <span className="flex items-center gap-1 font-mono text-[9px] uppercase text-naranja">
            <EyeOff className="h-3 w-3" aria-hidden="true" /> oculto
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ink transition-colors hover:bg-sky/10"
          >
            {open ? <Eye className="h-3 w-3" aria-hidden="true" /> : <Pencil className="h-3 w-3" aria-hidden="true" />}
            {open ? "Cerrar" : "Editar"}
          </button>
          <form action={deletePlan}>
            <input type="hidden" name="id" value={plan.id} />
            <button
              type="submit"
              aria-label={`Eliminar ${plan.label}`}
              className="border border-white/15 p-1.5 text-ink-mute transition-colors hover:text-elec"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>
        </span>
      </div>
      {open && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <PlanForm plan={plan} onDone={() => setOpen(false)} />
        </div>
      )}
    </li>
  );
}

export function PlanesManager({ planes, needsSetup }: { planes: PlanRowUI[]; needsSetup: boolean }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Tarifario de la landing</p>
          <h1 className="headline text-3xl uppercase">Control de planes</h1>
        </div>
        <Button type="button" variant="elec" size="sm" onClick={() => setCreating((v) => !v)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo plan
        </Button>
      </header>

      <p className="mb-5 border border-sky/50 bg-sky/10 p-3 text-sm leading-relaxed text-ink-soft">
        Lo que guardes aquí es lo que muestra la landing en <span className="font-mono text-xs">/</span> en menos de 60
        segundos. Si un plan no está visible, la web usa el valor por defecto de la configuración.
      </p>

      {needsSetup && (
        <p className="mb-5 border border-naranja/60 bg-naranja/10 p-3 text-sm text-ink" role="alert">
          Falta la tabla de planes: aplica{" "}
          <span className="font-mono text-xs">supabase/migrations/0004_planes_rrhh_finanzas.sql</span> en Supabase → SQL
          Editor.
        </p>
      )}

      {creating && (
        <div className="glass-dark mb-5 rounded-xl p-4">
          <PlanForm onDone={() => setCreating(false)} />
        </div>
      )}

      <ul className="space-y-3">
        {planes.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
        {planes.length === 0 && !needsSetup && (
          <li className="glass-dark rounded-xl px-4 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
            Sin planes todavía
          </li>
        )}
      </ul>
    </div>
  );
}
