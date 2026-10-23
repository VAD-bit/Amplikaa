"use client";

import { useActionState } from "react";
import { updateLeadEtapa } from "@/app/admin/actions";
import { ETAPAS, ETAPA_LABELS, type Etapa } from "@/lib/crm/types";
import { Select } from "@/components/ui/select";

export function EtapaForm({ leadId, etapa }: { leadId: string; etapa: Etapa }) {
  const [state, action, pending] = useActionState(updateLeadEtapa, { status: "idle" as const });

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={leadId} />
      <Select name="etapa" defaultValue={etapa} disabled={pending} aria-label="Etapa del lead">
        {ETAPAS.map((e) => (
          <option key={e} value={e}>
            {ETAPA_LABELS[e]}
          </option>
        ))}
      </Select>
      {state.status === "success" && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink">✓ Etapa actualizada</p>
      )}
      {state.status === "error" && state.message && (
        <p className="text-xs text-red-300">{state.message}</p>
      )}
    </form>
  );
}
