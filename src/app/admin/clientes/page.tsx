import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { type ClientRow, type TaskRow } from "@/lib/crm/types";
import { ESTADO_CHIP, SALUD_DOT } from "@/lib/crm/ui";
import { daysFromToday, fmtMoney } from "@/lib/crm/format";
import { requireUser } from "../_components/guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clientes · Panel AMPLIKAA" };

const ESTADO_LABEL: Record<string, string> = { activo: "Activo", pausado: "Pausado", cerrado: "Cerrado" };

export default async function ClientesPage() {
  await requireUser();
  const supabase = (await getSupabaseServer())!;

  const [{ data: clients }, { data: openTasks }] = await Promise.all([
    supabase.from("clients").select("*").order("estado", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("tasks").select("*").is("completed_at", null),
  ]);

  const rows = (clients ?? []) as ClientRow[];
  const tasks = (openTasks ?? []) as TaskRow[];
  const taskCount = (clientId: string) => tasks.filter((t) => t.client_id === clientId).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">CSM</p>
          <h1 className="headline text-3xl uppercase">Cartera de clientes</h1>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-sky px-4 py-2.5 text-sm font-semibold hover:bg-viol"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nueva ficha
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((c) => {
          const cobroDays = daysFromToday(c.proxima_cobro);
          const cobroSoon = cobroDays != null && cobroDays <= 3;
          return (
            <Link
              key={c.id}
              href={`/admin/clientes/${c.id}`}
              className="group flex flex-col glass-dark rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-ink/20 pb-3">
                <div className="min-w-0">
                  <p className="truncate font-syne text-lg font-bold uppercase">{c.nombre}</p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                    {c.empresa || "Sin empresa"}
                  </p>
                </div>
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${SALUD_DOT[c.salud]}`}
                  title={`Salud: ${c.salud}`}
                  aria-label={`Salud ${c.salud}`}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold">{c.plan}</span>
                <span className="font-mono text-[12px] text-mint">
                  {fmtMoney(c.precio)}
                  {c.ciclo === "semanal" ? "/sem" : c.ciclo === "mensual" ? "/mes" : " único"}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4 font-mono text-[10px] uppercase tracking-widest">
                <span className={cobroSoon ? "bg-mint px-1.5 py-0.5" : "text-ink-mute"}>
                  Cobro: {c.proxima_cobro ? c.proxima_cobro.slice(0, 10).replaceAll("-", "/") : "—"}
                </span>
                <span className="flex items-center gap-2 text-ink-mute">
                  {taskCount(c.id)} tarea(s)
                  <span className={`${ESTADO_CHIP[c.estado]} px-1.5 py-0.5`}>{ESTADO_LABEL[c.estado]}</span>
                </span>
              </div>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <p className="col-span-full glass-dark rounded-xl px-4 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
            Sin clientes todavía — crea la primera ficha
          </p>
        )}
      </div>
    </div>
  );
}
