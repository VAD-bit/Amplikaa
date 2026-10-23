"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/app/admin/actions";
import { CICLOS, ESTADOS_CLIENTE, SALUDES } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function NewClientForm() {
  const [state, action, pending] = useActionState(createClient, { status: "idle" as const });

  return (
    <form action={action} className="glass-dark rounded-2xl relative max-w-2xl p-7 sm:p-9">
      <Link
        href="/admin/clientes"
        className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Cartera
      </Link>

      <h2 className="headline mb-6 text-2xl uppercase">Nueva ficha de cliente</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-nombre">Nombre *</label>
          <Input id="nc-nombre" name="nombre" placeholder="Nombre del contacto" required />
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-empresa">Empresa</label>
          <Input id="nc-empresa" name="empresa" placeholder="Marca o empresa" />
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-whatsapp">WhatsApp</label>
          <Input id="nc-whatsapp" name="whatsapp" type="tel" placeholder="+58 4XX XXX XXXX" />
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-email">Email</label>
          <Input id="nc-email" name="email" type="email" placeholder="tu@cliente.com" />
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-plan">Plan *</label>
          <Input id="nc-plan" name="plan" placeholder="Impulso / Crecimiento / Landing…" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-mono mb-2 block" htmlFor="nc-ciclo">Ciclo</label>
            <Select id="nc-ciclo" name="ciclo" defaultValue="semanal">
              {CICLOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="label-mono mb-2 block" htmlFor="nc-precio">Precio (USD) *</label>
            <Input id="nc-precio" name="precio" type="number" min={0} step={1} defaultValue={65} required />
          </div>
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-inicio">Inicio</label>
          <Input id="nc-inicio" name="inicio" type="date" />
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-cobro">Próximo cobro</label>
          <Input id="nc-cobro" name="proxima_cobro" type="date" />
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-salud">Salud</label>
          <Select id="nc-salud" name="salud" defaultValue="verde">
            {SALUDES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="label-mono mb-2 block" htmlFor="nc-estado">Estado</label>
          <Select id="nc-estado" name="estado" defaultValue="activo">
            {ESTADOS_CLIENTE.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-5">
        <label className="label-mono mb-2 block" htmlFor="nc-notas">Nota de onboarding</label>
        <Textarea id="nc-notas" name="notas" rows={3} placeholder="Qué se acordó, accesos, expectativas…" />
      </div>

      {state.status === "error" && state.message && (
        <p className="mt-5 border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" className="mt-7 w-full sm:w-auto" disabled={pending}>
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Guardando…
          </span>
        ) : (
          "Crear ficha"
        )}
      </Button>
    </form>
  );
}
