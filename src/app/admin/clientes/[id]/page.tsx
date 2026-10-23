import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { type ClientRow, type NoteRow, type TaskRow } from "@/lib/crm/types";
import { ESTADO_CHIP, SALUD_DOT } from "@/lib/crm/ui";
import { daysFromToday, fmtDate, fmtDateTime, fmtMoney } from "@/lib/crm/format";
import { toggleTask } from "../../actions";
import { requireUser } from "../../_components/guard";
import { NoteForm } from "../../_components/note-form";
import { PatchClientForm, TaskForm } from "../_components/client-forms";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const supabase = (await getSupabaseServer())!;

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).maybeSingle<ClientRow>();
  if (!client) notFound();

  const [{ data: tasks }, { data: notes }] = await Promise.all([
    supabase.from("tasks").select("*").eq("client_id", id).order("completed_at", { ascending: true }).order("vence", { ascending: true }).returns<TaskRow[]>(),
    supabase.from("notes").select("*").eq("client_id", id).order("created_at", { ascending: false }).returns<NoteRow[]>(),
  ]);

  const open = (tasks ?? []).filter((t) => !t.completed_at);
  const done = (tasks ?? []).filter((t) => t.completed_at);
  const wa = client.whatsapp ? `https://wa.me/${client.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/clientes"
        className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Cartera
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-mono flex flex-wrap items-center gap-2">
            CSM
            <span className={`${ESTADO_CHIP[client.estado]} px-1.5 py-0.5`}>{client.estado}</span>
            <span className={`h-2 w-2 rounded-full ${SALUD_DOT[client.salud]}`} aria-hidden="true" />
            salud {client.salud}
          </p>
          <h1 className="headline text-3xl uppercase">{client.nombre}</h1>
          <p className="mt-1 font-mono text-[12px] text-ink-mute">
            {client.empresa || "Sin empresa"} · {client.plan} · {fmtMoney(client.precio)}
            {client.ciclo === "semanal" ? "/sem" : client.ciclo === "mensual" ? "/mes" : " único"}
          </p>
        </div>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-sky px-4 py-2.5 text-sm font-semibold hover:bg-viol"
          >
            WhatsApp
          </a>
        )}
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-dark rounded-xl p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink">Inicio</p>
          <p className="mt-1 text-lg font-semibold text-3d">{fmtDate(client.inicio)}</p>
        </div>
        <div className="glass-dark rounded-xl p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mint">Próximo cobro</p>
          <p className="mt-1 text-lg font-semibold text-mint text-3d">{fmtDate(client.proxima_cobro)}</p>
        </div>
        <div className="glass-dark rounded-xl p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-naranja">Tareas abiertas</p>
          <p className="mt-1 text-lg font-semibold text-naranja text-3d">{open.length}</p>
        </div>
      </div>

      <section className="mb-8 glass-dark rounded-xl p-5">
        <h2 className="label-mono mb-4 text-sky!">Ficha rápida</h2>
        <PatchClientForm id={client.id} salud={client.salud} estado={client.estado} proxima_cobro={client.proxima_cobro} />
      </section>

      <section className="mb-8">
        <h2 className="label-mono rule-double mb-4 pt-3 text-naranja!">Tareas</h2>
        <div className="mb-4">
          <TaskForm clientId={client.id} />
        </div>
        <ul className="space-y-2">
          {open.map((t) => {
            const late = daysFromToday(t.vence) != null && daysFromToday(t.vence)! < 0;
            return (
              <li key={t.id}>
                <form
                  action={toggleTask}
                  className={`flex items-center gap-3 glass-dark rounded-xl border-l-2 px-4 py-3 ${late ? "border-l-elec" : "border-l-naranja"}`}
                >
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center border border-ink/50 hover:bg-sky"
                    aria-label={`Completar ${t.titulo}`}
                  >
                    <Check className="h-3 w-3 opacity-0" aria-hidden="true" />
                  </button>
                  <span className="min-w-0 flex-1 text-sm">{t.titulo}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                    {t.tipo}
                  </span>
                  {t.vence && (
                    <span className={cn("shrink-0 font-mono text-[10px] uppercase", late ? "bg-elec px-1.5" : "text-naranja")}>
                      {t.vence.slice(5).replaceAll("-", "/")}
                    </span>
                  )}
                </form>
              </li>
            );
          })}
          {done.map((t) => (
            <li key={t.id}>
              <form action={toggleTask} className="flex items-center gap-3 glass-dark rounded-xl px-4 py-2.5 opacity-70">
                <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center border border-ink bg-sky"
                    aria-label={`Reabrir ${t.titulo}`}
                  >
                  <Check className="h-3 w-3" aria-hidden="true" />
                </button>
                <span className="min-w-0 flex-1 text-sm line-through">{t.titulo}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  {fmtDateTime(t.completed_at!)}
                </span>
              </form>
            </li>
          ))}
          {open.length === 0 && done.length === 0 && (
            <li className="glass-dark rounded-xl px-4 py-5 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
              Sin tareas
            </li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Notas ({notes?.length ?? 0})</h2>
        <div className="mb-4">
          <NoteForm clientId={client.id} />
        </div>
        <ul className="space-y-3">
          {(notes ?? []).map((n) => (
            <li key={n.id} className="glass-dark rounded-xl p-4">
              <p className="whitespace-pre-wrap text-sm">{n.texto}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                {fmtDateTime(n.created_at)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
