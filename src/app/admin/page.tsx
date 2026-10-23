import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ETAPAS, ETAPA_LABELS, type Etapa, type LeadRow, type ClientRow, type TaskRow } from "@/lib/crm/types";
import { ETAPA_CHIP, ETAPA_TONE, ETAPA_ACCENT, SALUD_DOT } from "@/lib/crm/ui";
import { fmtDateTime, fmtMoney, daysFromToday } from "@/lib/crm/format";
import { requireUser } from "./_components/guard";
import { Kpi } from "./_components/kpi";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireUser();

  const supabase = (await getSupabaseServer())!;
  const [leadsRes, clientsRes, tasksRes] = await Promise.all([
    supabase.from("leads").select("id, created_at, etapa, nombre, empresa, servicio, presupuesto, source").order("created_at", { ascending: false }).limit(8),
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("tasks").select("*").is("completed_at", null),
  ]);

  const leads = (leadsRes.data ?? []) as Pick<LeadRow, "id" | "created_at" | "etapa" | "nombre" | "empresa" | "servicio" | "presupuesto" | "source">[];
  const clients = (clientsRes.data ?? []) as ClientRow[];
  const openTasks = (tasksRes.data ?? []) as TaskRow[];

  const weekAgo = Date.now() - 7 * 86_400_000;
  const leadsSemana = leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length;
  const porEtapa = Object.fromEntries(ETAPAS.map((e) => [e, leads.filter((l) => l.etapa === e).length])) as Record<Etapa, number>;
  const activos = clients.filter((c) => c.estado === "activo");
  const alerta = activos.filter((c) => c.salud !== "verde");
  const vencidas = openTasks.filter((t) => {
    const d = daysFromToday(t.vence);
    return d != null && d < 0;
  });
  const cobrosSoon = activos.filter((c) => {
    const d = daysFromToday(c.proxima_cobro);
    return d != null && d <= 7;
  });
  const mrr = activos.filter((c) => c.ciclo === "semanal").reduce((s, c) => s + Number(c.precio), 0);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Resumen</p>
          <h1 className="headline text-3xl uppercase">Panel de control</h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
          {new Date().toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Leads (7 días)" value={leadsSemana} labelTone="text-sky" sub={`${leads.length} en la bandeja`} />
        <Kpi
          label="Ingresos / semana"
          value={`$${mrr}`}
          labelTone="text-mint"
          tone="text-mint"
          sub={
            <>
              {activos.length} activos · <span className="text-mint">{cobrosSoon.length} cobros ≤7d</span>
            </>
          }
        />
        <Kpi
          label="Clientes activos"
          value={activos.length}
          labelTone="text-ink"
          sub={<span className={alerta.length > 0 ? "text-naranja" : undefined}>{alerta.length} en alerta</span>}
        />
        <Kpi
          label="Tareas vencidas"
          value={vencidas.length}
          labelTone="text-elec"
          tone={vencidas.length > 0 ? "text-elec" : undefined}
          sub={<span className="text-naranja">{openTasks.length} abiertas</span>}
        />
      </div>

      <section className="mt-8">
        <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Pipeline de leads</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ETAPAS.map((e) => (
            <div key={e} className={`glass-dark rounded-xl border-l-2 p-4 ${ETAPA_ACCENT[e]}`}>
              <p className={`font-mono text-[11px] uppercase tracking-widest ${ETAPA_TONE[e]}`}>{ETAPA_LABELS[e]}</p>
              <p className={`headline mt-1 text-3xl text-3d ${ETAPA_TONE[e]}`}>{porEtapa[e]}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Últimos leads</h2>
          <ul className="divide-y divide-ink/15 glass-dark rounded-xl">
            {leads.slice(0, 6).map((l) => (
              <li key={l.id}>
                <Link
                  href={`/admin/leads/${l.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-sky/10"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{l.nombre}</span>
                    <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                      {l.empresa || "—"} · {l.servicio}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span
                      className={`block border border-ink/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${ETAPA_CHIP[l.etapa]}`}
                    >
                      {ETAPA_LABELS[l.etapa]}
                    </span>
                    <span className="mt-1 block font-mono text-[9px] text-ink-mute">{fmtDateTime(l.created_at)}</span>
                  </span>
                </Link>
              </li>
            ))}
            {leads.length === 0 && (
              <li className="px-4 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                Sin leads todavía
              </li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="label-mono rule-double mb-4 pt-3 text-naranja!">Atención requerida</h2>
          <div className="space-y-3">
            {alerta.length > 0 && (
              <ul className="divide-y divide-ink/15 glass-dark rounded-xl">
                {alerta.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/admin/clientes/${c.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-sky/10"
                    >
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${SALUD_DOT[c.salud]}`} aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{c.nombre}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                          {c.plan} ·{" "}
                          <span className="text-mint">
                            {fmtMoney(c.precio)}
                            {c.ciclo === "semanal" ? "/sem" : c.ciclo === "mensual" ? "/mes" : "/único"}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {vencidas.length > 0 && (
              <div className="border border-elec/60 bg-elec/10 p-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink">
                  {vencidas.length} tarea(s) vencida(s)
                </p>
                <ul className="space-y-1 text-sm">
                  {vencidas.slice(0, 4).map((t) => (
                    <li key={t.id}>· {t.titulo}</li>
                  ))}
                </ul>
              </div>
            )}
            {alerta.length === 0 && vencidas.length === 0 && (
              <p className="glass-dark rounded-xl px-4 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-mint">
                Todo en verde
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
