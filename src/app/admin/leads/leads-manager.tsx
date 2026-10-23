"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { updateLeadEtapa } from "@/app/admin/actions";
import { ETAPAS, ETAPA_LABELS, type Etapa, type LeadRow } from "@/lib/crm/types";
import { ETAPA_CHIP } from "@/lib/crm/ui";
import { fmtDateTime } from "@/lib/crm/format";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function LeadsManager({ leads }: { leads: LeadRow[] }) {
  const [filter, setFilter] = useState<Etapa | "todos">("todos");
  const [q, setQ] = useState("");
  const [state, action] = useActionState(updateLeadEtapa, { status: "idle" as const });

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "todos" && l.etapa !== filter) return false;
      if (!needle) return true;
      return [l.nombre, l.empresa, l.email, l.servicio, l.mensaje]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle));
    });
  }, [leads, filter, q]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["todos", ...ETAPAS] as const).map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setFilter(e)}
            className={cn(
              "cursor-pointer border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
              filter === e
                ? cn("border-ink font-bold", e === "todos" ? "bg-sky" : ETAPA_CHIP[e])
                : "border-ink/30 bg-paper hover:bg-sky/10"
            )}
          >
            {e === "todos" ? "Todos" : ETAPA_LABELS[e]}
            <span className={cn("ml-1.5", filter === e ? "opacity-70" : "text-ink-mute")}>
              {e === "todos" ? leads.length : leads.filter((l) => l.etapa === e).length}
            </span>
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nombre, empresa…"
            className="w-full border border-ink/30 bg-paper py-2.5 pr-3 pl-9 text-sm focus:border-sky focus:outline-none"
            aria-label="Buscar leads"
          />
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p className="mb-3 border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">{state.message}</p>
      )}

      <div className="overflow-x-auto glass-dark rounded-xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/25 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Presupuesto</th>
              <th className="px-4 py-3">Origen</th>
              <th className="px-4 py-3">Etapa</th>
              <th className="px-4 py-3" aria-label="Abrir" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/12">
            {rows.map((l) => (
              <tr key={l.id} className="transition-colors hover:bg-sky/10">
                <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-ink-mute">{fmtDateTime(l.created_at)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold underline-offset-4 hover:underline">
                    {l.nombre}
                  </Link>
                  {l.empresa && <span className="block font-mono text-[10px] text-ink-mute">{l.empresa}</span>}
                </td>
                <td className="px-4 py-3 text-[13px]">{l.servicio}</td>
                <td className="px-4 py-3 font-mono text-[12px] whitespace-nowrap">{l.presupuesto || "—"}</td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-mute">{l.source || "—"}</td>
                <td className="px-4 py-3">
                  <form action={action} className="min-w-[130px]">
                    <input type="hidden" name="id" value={l.id} />
                    <Select
                      name="etapa"
                      defaultValue={l.etapa}
                      aria-label={`Etapa de ${l.nombre}`}
                      className="border-ink/30 bg-paper-3/60 py-1.5 pr-8 text-xs"
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    >
                      {ETAPAS.map((e) => (
                        <option key={e} value={e}>
                          {ETAPA_LABELS[e]}
                        </option>
                      ))}
                    </Select>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="font-mono text-[10px] uppercase tracking-widest underline-offset-4 hover:underline"
                  >
                    Abrir →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
