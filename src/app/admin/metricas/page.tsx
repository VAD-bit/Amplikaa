import { getSupabaseServer } from "@/lib/supabase/server";
import { ETAPAS, ETAPA_LABELS, type Etapa } from "@/lib/crm/types";
import { ETAPA_TONE } from "@/lib/crm/ui";
import { requireUser } from "../_components/guard";
import { Kpi } from "../_components/kpi";

export const dynamic = "force-dynamic";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function isMissing(err: { message: string } | null) {
  return !!err && /does not exist/i.test(err.message);
}

function Bar({ pct, tone }: { pct: number; tone: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8" aria-hidden="true">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(pct, 0)}%` }} />
    </div>
  );
}

export default async function AdminMetricasPage() {
  await requireUser();
  const supabase = (await getSupabaseServer())!;

  const [finRes, nomRes, empRes, leadRes, clientRes, taskRes] = await Promise.all([
    supabase.from("finanzas").select("fecha, tipo, monto").order("fecha", { ascending: true }).limit(500),
    supabase.from("nomina_pagos").select("fecha, monto").order("fecha", { ascending: true }).limit(500),
    supabase.from("empleados").select("id, estado, salario_base"),
    supabase.from("leads").select("id, etapa, created_at"),
    supabase.from("clients").select("id, estado, salud, ciclo, precio"),
    supabase.from("tasks").select("id, completed_at, vence"),
  ]);

  const missing =
    isMissing(finRes.error) || isMissing(nomRes.error) || isMissing(empRes.error);

  // Últimos 6 meses (incluye actual)
  const now = new Date();
  const meses: { key: string; label: string; ingresos: number; egresos: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    meses.push({ key: monthKey(d), label: MESES[d.getMonth()], ingresos: 0, egresos: 0 });
  }

  for (const m of (finRes.data ?? []) as { fecha: string; tipo: string; monto: number }[]) {
    const slot = meses.find((x) => x.key === m.fecha.slice(0, 7));
    if (!slot) continue;
    if (m.tipo === "ingreso") slot.ingresos += Number(m.monto);
    else slot.egresos += Number(m.monto);
  }

  const maxMes = Math.max(...meses.map((m) => Math.max(m.ingresos, m.egresos)), 1);
  const mesActual = meses[meses.length - 1];
  const balanceMes = mesActual.ingresos - mesActual.egresos;

  const pagosMes = ((nomRes.data ?? []) as { fecha: string; monto: number }[])
    .filter((p) => p.fecha.slice(0, 7) === mesActual.key)
    .reduce((s, p) => s + Number(p.monto), 0);

  const empleados = (empRes.data ?? []) as { id: string; estado: string; salario_base: number }[];
  const activosEmp = empleados.filter((e) => e.estado === "activo");

  // CRM (defensivo: tablas pueden faltar)
  const leads = (leadRes.data ?? []) as { id: string; etapa: Etapa; created_at: string }[];
  const porEtapa = Object.fromEntries(ETAPAS.map((e) => [e, leads.filter((l) => l.etapa === e).length])) as Record<Etapa, number>;
  const conversion = leads.length > 0 ? Math.round((porEtapa.ganado / leads.length) * 100) : 0;

  const clients = (clientRes.data ?? []) as { id: string; estado: string; salud: string; ciclo: string; precio: number }[];
  const activos = clients.filter((c) => c.estado === "activo");
  const salud = {
    verde: activos.filter((c) => c.salud === "verde").length,
    amarillo: activos.filter((c) => c.salud === "amarillo").length,
    rojo: activos.filter((c) => c.salud === "rojo").length,
  };

  const tasks = (taskRes.data ?? []) as { id: string; completed_at: string | null; vence: string | null }[];
  const hoyISO = now.toISOString().slice(0, 10);
  const vencidas = tasks.filter((t) => !t.completed_at && t.vence && t.vence < hoyISO).length;
  const abiertas = tasks.filter((t) => !t.completed_at).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Métricas</p>
          <h1 className="headline text-3xl uppercase">Números del negocio</h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
          {now.toLocaleDateString("es-VE", { month: "long", year: "numeric" })}
        </p>
      </header>

      {missing && (
        <p className="mb-5 border border-naranja/60 bg-naranja/10 p-3 text-sm leading-relaxed text-ink" role="alert">
          Faltan tablas financieras: aplica{" "}
          <span className="font-mono text-xs">supabase/migrations/0004_planes_rrhh_finanzas.sql</span> en Supabase → SQL
          Editor.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Ingresos del mes" value={`$${mesActual.ingresos.toFixed(0)}`} labelTone="text-mint" tone="text-mint" />
        <Kpi label="Egresos del mes" value={`$${mesActual.egresos.toFixed(0)}`} labelTone="text-elec" tone="text-elec" />
        <Kpi
          label="Balance del mes"
          value={`${balanceMes < 0 ? "−$" : "$"}${Math.abs(balanceMes).toFixed(0)}`}
          labelTone="text-sky"
          tone={balanceMes < 0 ? "text-elec" : "text-mint"}
        />
        <Kpi label="Nómina del mes" value={`$${pagosMes.toFixed(0)}`} labelTone="text-naranja" tone="text-naranja" sub={`${activosEmp.length} activos`} />
      </div>

      <section className="mt-8">
        <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Ingresos vs egresos · 6 meses</h2>
        <div className="glass-dark rounded-xl p-5">
          <div className="flex h-48 items-end gap-3">
            {meses.map((m) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1.5">
                  <div
                    className="w-4 rounded-t-sm bg-mint/80"
                    style={{ height: `${(m.ingresos / maxMes) * 100}%` }}
                    title={`Ingresos $${m.ingresos.toFixed(0)}`}
                  />
                  <div
                    className="w-4 rounded-t-sm bg-elec/80"
                    style={{ height: `${(m.egresos / maxMes) * 100}%` }}
                    title={`Egresos $${m.egresos.toFixed(0)}`}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink-mute">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-mint/80" /> Ingresos</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-elec/80" /> Egresos</span>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Pipeline de leads</h2>
          <div className="glass-dark space-y-4 rounded-xl p-5">
            {ETAPAS.map((e) => {
              const n = porEtapa[e];
              const pct = leads.length > 0 ? (n / leads.length) * 100 : 0;
              return (
                <div key={e}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${ETAPA_TONE[e]}`}>
                      {ETAPA_LABELS[e]}
                    </span>
                    <span className="font-mono text-sm text-ink">{n}</span>
                  </div>
                  <Bar pct={pct} tone={ETAPA_TONE[e].replace("text-", "bg-")} />
                </div>
              );
            })}
            <p className="pt-1 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              Conversión a ganado: <span className="text-mint">{conversion}%</span> · {leads.length} leads totales
            </p>
          </div>
        </section>

        <section>
          <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Cartera y equipo</h2>
          <div className="glass-dark space-y-5 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Clientes activos</p>
                <p className="headline text-3xl text-mint text-3d">{activos.length}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Tareas</p>
                <p className="headline text-3xl text-3d">
                  <span className={vencidas > 0 ? "text-elec" : "text-ink"}>{vencidas}</span>
                  <span className="text-lg text-ink-mute"> vencidas</span>
                </p>
                <p className="font-mono text-[10px] text-ink-mute">{abiertas} abiertas</p>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Salud de la cartera</p>
              <div className="grid grid-cols-3 gap-3">
                {(["verde", "amarillo", "rojo"] as const).map((s) => (
                  <div key={s} className="rounded-lg border border-white/10 bg-white/4 p-3 text-center">
                    <p className={`headline text-2xl text-3d ${s === "verde" ? "text-mint" : s === "amarillo" ? "text-naranja" : "text-elec"}`}>
                      {salud[s]}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ink-mute">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              Empleados: <span className="text-sky">{activosEmp.length}</span> activos ·{" "}
              <span className="text-naranja">
                ${activosEmp.reduce((s, e) => s + Number(e.salario_base), 0).toFixed(0)}
              </span>{" "}
              en salarios base
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
