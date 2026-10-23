"use client";

import { useActionState } from "react";
import { patchClient, addTask } from "@/app/admin/actions";
import { PRIORIDADES, SALUDES, ESTADOS_CLIENTE, TIPOS_TAREA } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function PatchClientForm({
  id,
  salud,
  estado,
  proxima_cobro,
}: {
  id: string;
  salud: string;
  estado: string;
  proxima_cobro: string | null;
}) {
  const [state, action, pending] = useActionState(patchClient, { status: "idle" as const });

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label className="label-mono mb-2 block" htmlFor="pc-salud">Salud</label>
        <Select id="pc-salud" name="salud" defaultValue={salud}>
          {SALUDES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="label-mono mb-2 block" htmlFor="pc-estado">Estado</label>
        <Select id="pc-estado" name="estado" defaultValue={estado}>
          {ESTADOS_CLIENTE.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="label-mono mb-2 block" htmlFor="pc-cobro">Próximo cobro</label>
        <Input id="pc-cobro" name="proxima_cobro" type="date" defaultValue={proxima_cobro?.slice(0, 10) ?? ""} />
      </div>
      <div className="sm:col-span-3 flex items-center gap-3">
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
        {state.status === "success" && (
          <span className="font-mono text-[10px] uppercase tracking-widest">✓ Actualizado</span>
        )}
        {state.status === "error" && state.message && (
          <span className="text-xs text-red-300">{state.message}</span>
        )}
      </div>
    </form>
  );
}

export function TaskForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(addTask, { status: "idle" as const });

  return (
    <form action={action} className="grid gap-3 glass-dark rounded-xl p-4 sm:grid-cols-2">
      <input type="hidden" name="client_id" value={clientId} />
      <div className="sm:col-span-2">
        <label className="label-mono mb-2 block" htmlFor="tf-titulo">Nueva tarea</label>
        <Input id="tf-titulo" name="titulo" placeholder="Ej: enviar reporte quincenal" required />
      </div>
      <div>
        <label className="label-mono mb-2 block" htmlFor="tf-tipo">Tipo</label>
        <Select id="tf-tipo" name="tipo" defaultValue="general">
          {TIPOS_TAREA.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="label-mono mb-2 block" htmlFor="tf-prioridad">Prioridad</label>
        <Select id="tf-prioridad" name="prioridad" defaultValue="media">
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="label-mono mb-2 block" htmlFor="tf-vence">Vence</label>
        <Input id="tf-vence" name="vence" type="date" />
      </div>
      <div className="flex items-end">
        <Button type="submit" variant="outline" size="sm" className="w-full" disabled={pending}>
          {pending ? "Agregando…" : "Agregar tarea"}
        </Button>
      </div>
      {state.status === "error" && state.message && (
        <p className="text-xs text-red-300 sm:col-span-2">{state.message}</p>
      )}
    </form>
  );
}
