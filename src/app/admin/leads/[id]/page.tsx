import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ETAPA_LABELS, type LeadRow, type NoteRow } from "@/lib/crm/types";
import { ETAPA_CHIP } from "@/lib/crm/ui";
import { fmtDateTime } from "@/lib/crm/format";
import { requireUser } from "../../_components/guard";
import { EtapaForm } from "../../_components/etapa-form";
import { NoteForm } from "../../_components/note-form";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const supabase = (await getSupabaseServer())!;

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle<LeadRow>();
  if (!lead) notFound();

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .returns<NoteRow[]>();

  const wa = lead.whatsapp ? `https://wa.me/${lead.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/leads"
        className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Bandeja
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-mono flex flex-wrap items-center gap-2">
            Lead
            <span className={`${ETAPA_CHIP[lead.etapa]} px-1.5 py-0.5`}>{ETAPA_LABELS[lead.etapa]}</span>
            {lead.source || "sin origen"}
          </p>
          <h1 className="headline text-3xl uppercase">{lead.nombre}</h1>
          <p className="mt-1 font-mono text-[12px] text-ink-mute">
            {lead.empresa || "Sin empresa"} · {fmtDateTime(lead.created_at)}
          </p>
        </div>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-sky px-4 py-2.5 text-sm font-semibold hover:bg-viol"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </a>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="glass-dark rounded-xl p-5">
            <h2 className="label-mono mb-3 text-sky!">Mensaje</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{lead.mensaje}</p>
          </section>

          <section>
            <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Notas ({notes?.length ?? 0})</h2>
            <div className="mb-4">
              <NoteForm leadId={lead.id} />
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

        <aside className="space-y-6">
          <section className="glass-dark rounded-xl p-5">
            <h2 className="label-mono mb-3 text-sky!">Mover etapa</h2>
            <EtapaForm leadId={lead.id} etapa={lead.etapa} />
          </section>

          <section className="glass-dark rounded-xl p-5">
            <h2 className="label-mono mb-3 text-sky!">Contacto</h2>
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Email</dt>
                <dd className="break-all">{lead.email}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">WhatsApp</dt>
                <dd>{lead.whatsapp || "—"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Servicio</dt>
                <dd>{lead.servicio}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Presupuesto</dt>
                <dd>{lead.presupuesto || "—"}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
