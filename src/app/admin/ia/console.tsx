"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import {
  Brain,
  ChartLine,
  Eraser,
  FileUp,
  Loader2,
  MessageSquare,
  NotebookPen,
  Play,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addActivity,
  addKnowledge,
  addQaPair,
  clearChat,
  createTask,
  deleteKnowledge,
  deleteTask,
  runTask,
  runTraining,
  sendChat,
  uploadDocument,
  type ActionState,
} from "./actions";

export type AiMsg = { id: string; role: string; content: string; created_at: string };
export type AiKnow = {
  id: string;
  titulo: string;
  contenido: string;
  created_at: string;
  tipo?: string | null;
  origen?: string | null;
  chunk_idx?: number | null;
};
export type AiTask = { id: string; titulo: string; brief: string; status: string; result: string | null; created_at: string };

export type BrainStats = {
  trained: boolean;
  vocabSize: number;
  chunks: number;
  lossHistory: number[];
  params: number;
};

const IDLE: ActionState = { status: "idle" };

const TASK_CHIP: Record<string, string> = {
  pendiente: "border-naranja/60 text-naranja",
  ejecutando: "border-sky/60 text-sky",
  completada: "border-mint/60 text-mint",
  error: "border-elec/60 text-elec",
};

const TIPO_CHIP: Record<string, string> = {
  texto: "border-white/20 text-ink-mute",
  pdf: "border-viol/60 text-viol",
  transcripcion: "border-sky/60 text-sky",
  actividad: "border-naranja/60 text-naranja",
  qa: "border-mint/60 text-mint",
};

function time(iso: string) {
  return new Date(iso).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });
}

function dateShort(iso: string) {
  return new Date(iso).toLocaleDateString("es-VE", { day: "2-digit", month: "short" });
}

/* ---------------- Gráfica de loss (SVG puro) ---------------- */

function LossChart({ history }: { history: number[] }) {
  if (history.length === 0) {
    return (
      <p className="grid h-32 place-items-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        Sin entrenamiento todavía
      </p>
    );
  }
  const w = 320;
  const h = 120;
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;
  const pts = history
    .map((v, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" aria-label="Loss por época">
        <polyline points={pts} fill="none" stroke="#5eead4" strokeWidth="2" strokeLinejoin="round" />
        <polyline points={`0,${h} ${pts} ${w},${h}`} fill="rgba(94,234,212,0.15)" stroke="none" />
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-ink-mute">
        <span>época 1</span>
        <span>
          loss: {history[history.length - 1].toFixed(4)} (min {min.toFixed(4)})
        </span>
        <span>época {history.length}</span>
      </div>
    </div>
  );
}

/* ---------------- Consola principal ---------------- */

type Props = {
  messages: AiMsg[];
  knowledge: AiKnow[];
  tasks: AiTask[];
  stats: BrainStats;
  needsSetup: boolean;
};

type Tab = "entrenar" | "conocimiento" | "archivos" | "chat" | "modelo";

export function IaConsole({ messages, knowledge, tasks, stats, needsSetup }: Props) {
  const [tab, setTab] = useState<Tab>(stats.trained ? "chat" : "entrenar");
  const [chatState, chatAction, chatPending] = useActionState(sendChat, IDLE);
  const [knowState, knowAction, knowPending] = useActionState(addKnowledge, IDLE);
  const [qaState, qaAction, qaPending] = useActionState(addQaPair, IDLE);
  const [trainState, trainAction, trainPending] = useActionState(runTraining, IDLE);
  const [taskState, taskAction, taskPending] = useActionState(createTask, IDLE);
  const [uploadState, uploadAction, uploadPending] = useActionState(uploadDocument, IDLE);
  const [actState, actAction, actPending] = useActionState(addActivity, IDLE);
  const [texto, setTexto] = useState("");
  const [liveLoss, setLiveLoss] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatState.status === "success") setTexto("");
  }, [chatState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // Reinicia loss en vivo cuando empieza un entrenamiento
  useEffect(() => {
    if (trainPending) setLiveLoss([]);
  }, [trainPending]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "entrenar", label: "Entrenar", icon: <Brain className="h-3.5 w-3.5" aria-hidden="true" /> },
    { key: "conocimiento", label: "Conocimiento", icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> },
    { key: "archivos", label: "Archivos", icon: <FileUp className="h-3.5 w-3.5" aria-hidden="true" /> },
    { key: "chat", label: "Chat", icon: <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" /> },
    { key: "modelo", label: "Modelo", icon: <ChartLine className="h-3.5 w-3.5" aria-hidden="true" /> },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Asistente interno · red neuronal local</p>
          <h1 className="headline text-3xl uppercase">Amplikaa IA</h1>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          <span className={`h-1.5 w-1.5 rounded-full ${stats.trained ? "pulse-dot bg-mint" : "bg-naranja"}`} aria-hidden="true" />
          {stats.trained ? `Entrenado · ${stats.vocabSize} palabras` : "Sin entrenar"}
        </span>
      </header>

      {needsSetup && (
        <p className="mb-4 border border-naranja/60 bg-naranja/10 p-3 text-sm leading-relaxed text-ink" role="alert">
          Faltan tablas del asistente: aplica{" "}
          <span className="font-mono text-xs">supabase/migrations/0003_ai_assistant.sql</span> y{" "}
          <span className="font-mono text-xs">0005_ai_brain.sql</span> en Supabase → SQL Editor.
        </p>
      )}

      {/* Pestañas */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              tab === t.key
                ? "border-sky bg-sky/15 text-sky"
                : "border-white/15 text-ink-mute hover:text-ink"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- ENTRENAR ---------- */}
      {tab === "entrenar" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="glass-dark rounded-xl p-5">
            <h2 className="label-mono rule-double mb-4 pt-3 text-viol!">Entrenar el cerebro</h2>
            <p className="mb-4 text-sm leading-relaxed text-ink-soft">
              La red neuronal se entrena <strong className="text-ink">aquí mismo, en tu navegador/servidor</strong>, sin
              APIs externas. Aprende el vocabulario de tus textos, ajusta pesos con backprop + Adam y reduce el loss
              época a época. Después responde con lo que leyó.
            </p>
            <form action={trainAction} className="space-y-3">
              <label className="block">
                <span className="label-mono mb-1.5 block">Épocas (más = mejor, más lento)</span>
                <Input name="epochs" type="number" min={1} max={60} defaultValue={12} required />
              </label>
              <Button type="submit" variant="elec" size="sm" disabled={trainPending}>
                {trainPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Entrenando…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" aria-hidden="true" /> Entrenar cerebro
                  </>
                )}
              </Button>
              {trainState.status === "error" && trainState.message && (
                <p className="text-xs text-elec" role="alert">
                  {trainState.message}
                </p>
              )}
              {trainState.status === "success" && trainState.message && (
                <p className="text-xs text-mint" role="status">
                  {trainState.message}
                </p>
              )}
            </form>
          </section>

          <section className="glass-dark rounded-xl p-5">
            <h2 className="label-mono rule-double mb-4 pt-3 text-sky!">Loss por época</h2>
            <LossChart history={liveLoss.length > 0 ? liveLoss : stats.lossHistory} />
            {trainPending && (
              <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-sky">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Entrenando… la gráfica se actualiza al
                terminar
              </p>
            )}
          </section>
        </div>
      )}

      {/* ---------- CONOCIMIENTO ---------- */}
      {tab === "conocimiento" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section>
            <h2 className="label-mono rule-double mb-3 pt-3 text-viol!">
              Textos / libros <span className="text-ink-mute">({knowledge.filter((k) => !k.titulo.startsWith("Q: ")).length})</span>
            </h2>
            <form action={knowAction} className="glass-dark space-y-2 rounded-xl p-3">
              <Input name="titulo" maxLength={80} placeholder="Título (p. ej. Capítulo 1 — Marketing)" required />
              <Textarea
                name="contenido"
                rows={4}
                maxLength={12000}
                placeholder="Pega aquí el texto, capítulo o libro completo que quieras que aprenda…"
                required
              />
              <Button type="submit" variant="elec" size="sm" className="w-full" disabled={knowPending}>
                {knowPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Añadir texto
              </Button>
              {knowState.status === "error" && knowState.message && (
                <p className="text-xs text-elec" role="alert">
                  {knowState.message}
                </p>
              )}
              {knowState.status === "success" && <p className="text-xs text-mint">{knowState.message}</p>}
            </form>

            <h2 className="label-mono rule-double mb-3 mt-6 pt-3 text-naranja!">Par pregunta → respuesta</h2>
            <form action={qaAction} className="glass-dark space-y-2 rounded-xl p-3">
              <Input name="pregunta" maxLength={300} placeholder="Pregunta (p. ej. ¿Cuánto cuesta un reel?)" required />
              <Textarea name="respuesta" rows={2} maxLength={2000} placeholder="Respuesta exacta que debe dar…" required />
              <Button type="submit" variant="elec" size="sm" className="w-full" disabled={qaPending}>
                {qaPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Guardar par
              </Button>
              {qaState.status === "error" && qaState.message && (
                <p className="text-xs text-elec" role="alert">
                  {qaState.message}
                </p>
              )}
              {qaState.status === "success" && <p className="text-xs text-mint">{qaState.message}</p>}
            </form>
          </section>

          <section>
            <h2 className="label-mono rule-double mb-3 pt-3 text-sky!">
              Lo que sabe <span className="text-ink-mute">({knowledge.length})</span>
            </h2>
            <ul className="space-y-2">
              {knowledge.map((k) => (
                <li key={k.id} className="glass-dark flex items-start gap-3 rounded-xl px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-syne text-sm font-bold uppercase">{k.titulo}</p>
                      {k.tipo && (
                        <span className={`border px-1.5 py-px font-mono text-[8px] uppercase tracking-widest ${TIPO_CHIP[k.tipo] ?? TIPO_CHIP.texto}`}>
                          {k.tipo}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-soft">{k.contenido}</p>
                  </div>
                  <form action={deleteKnowledge}>
                    <input type="hidden" name="id" value={k.id} />
                    <button
                      type="submit"
                      aria-label={`Olvidar "${k.titulo}"`}
                      className="p-1 text-ink-mute transition-colors hover:text-elec"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </form>
                </li>
              ))}
              {knowledge.length === 0 && (
                <li className="glass-dark rounded-xl px-4 py-5 text-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  Aún no le has enseñado nada
                </li>
              )}
            </ul>
          </section>
        </div>
      )}

      {/* ---------- ARCHIVOS (PDF / videos / bitácora) ---------- */}
      {tab === "archivos" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section>
            <h2 className="label-mono rule-double mb-3 pt-3 text-viol!">Subir libro o PDF</h2>
            <form action={uploadAction} className="glass-dark space-y-2 rounded-xl p-3">
              <Input
                type="file"
                name="archivo"
                accept=".pdf,.txt,.md,.srt,.vtt"
                required
                className="cursor-pointer file:mr-3 file:border file:border-white/20 file:bg-transparent file:px-2 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-widest"
              />
              <p className="font-mono text-[9px] uppercase leading-relaxed tracking-widest text-ink-mute">
                Acepta PDF (libros), .txt/.md (texto plano) y .srt/.vtt (subtítulos de video exportados).
                Se trocea automáticamente en fragmentos para la memoria.
              </p>
              <Button type="submit" variant="elec" size="sm" className="w-full" disabled={uploadPending}>
                {uploadPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Leyendo archivo…
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4" aria-hidden="true" /> Subir y trocear
                  </>
                )}
              </Button>
              {uploadState.status === "error" && uploadState.message && (
                <p className="text-xs text-elec" role="alert">
                  {uploadState.message}
                </p>
              )}
              {uploadState.status === "success" && uploadState.message && (
                <p className="text-xs text-mint" role="status">
                  {uploadState.message}
                </p>
              )}
            </form>

            <h2 className="label-mono rule-double mb-3 mt-6 pt-3 text-naranja!">Bitácora: cómo trabajas</h2>
            <p className="mb-3 text-sm leading-relaxed text-ink-soft">
              Registra lo que haces al editar, diseñar, programar o grabar. La IA aprende tus patrones y
              puede repetir tu forma de hacer las cosas.
            </p>
            <form action={actAction} className="glass-dark space-y-2 rounded-xl p-3">
              <Input name="titulo" maxLength={120} placeholder="Título (p. ej. Flujo de edición de reel)" required />
              <Textarea
                name="detalle"
                rows={4}
                maxLength={8000}
                placeholder="Pasos, herramientas, atajos, orden, decisiones… lo más detallado posible."
                required
              />
              <Button type="submit" variant="elec" size="sm" className="w-full" disabled={actPending}>
                {actPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <NotebookPen className="h-4 w-4" aria-hidden="true" />}
                Registrar actividad
              </Button>
              {actState.status === "error" && actState.message && (
                <p className="text-xs text-elec" role="alert">
                  {actState.message}
                </p>
              )}
              {actState.status === "success" && actState.message && (
                <p className="text-xs text-mint" role="status">
                  {actState.message}
                </p>
              )}
            </form>
          </section>

          <section>
            <h2 className="label-mono rule-double mb-3 pt-3 text-sky!">Ingestas por tipo</h2>
            <ul className="space-y-2">
              {(["pdf", "transcripcion", "actividad", "texto", "qa"] as const).map((tipo) => {
                const n = knowledge.filter((k) => k.tipo === tipo).length;
                return (
                  <li key={tipo} className="glass-dark flex items-center justify-between rounded-xl px-4 py-3">
                    <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${TIPO_CHIP[tipo]}`}>
                      {tipo}
                    </span>
                    <span className="headline text-xl text-3d">{n}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-widest text-ink-mute">
              Tras subir o registrar, ve a <strong className="text-ink">Entrenar</strong> para que la red
              absorba el nuevo conocimiento.
            </p>
          </section>
        </div>
      )}

      {/* ---------- CHAT ---------- */}
      {tab === "chat" && (
        <div className="grid gap-5 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <h2 className="label-mono rule-double mb-3 flex items-center justify-between pt-3 text-sky!">
              <span>Chat con el cerebro</span>
              {messages.length > 0 && (
                <form action={clearChat}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-ink-mute transition-colors hover:text-elec"
                  >
                    <Eraser className="h-3 w-3" aria-hidden="true" /> Vaciar
                  </button>
                </form>
              )}
            </h2>

            <div ref={scrollRef} className="glass-dark h-[26rem] space-y-3 overflow-y-auto rounded-xl p-4">
              {messages.length === 0 && (
                <p className="grid h-full place-items-center px-6 text-center font-mono text-[11px] uppercase leading-relaxed tracking-widest text-ink-mute">
                  Sin conversación todavía.
                  <br />
                  Enséñale textos en Conocimiento, entrénalo, y pregunta aquí.
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] border border-sky/40 bg-sky/15 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-ink"
                      : "max-w-[90%] border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-ink"
                  }
                >
                  {m.role !== "user" && (
                    <p className="mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-sky">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Amplikaa IA (local)
                    </p>
                  )}
                  {m.content}
                  <span className="mt-1.5 block text-right font-mono text-[8px] text-ink-mute">{time(m.created_at)}</span>
                </div>
              ))}
            </div>

            {chatState.status === "error" && chatState.message && (
              <p className="mt-3 border border-elec/50 bg-elec/10 p-3 text-sm text-ink" role="alert">
                {chatState.message}
              </p>
            )}

            <form action={chatAction} className="mt-3 flex items-end gap-2">
              <Textarea
                name="texto"
                rows={2}
                maxLength={2000}
                placeholder="Pregúntale algo sobre lo que aprendió…"
                className="flex-1"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button type="submit" variant="elec" size="icon" disabled={chatPending} aria-label="Enviar mensaje">
                {chatPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </form>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-mute">Ctrl/⌘ + Enter para enviar</p>
          </section>

          <aside className="lg:col-span-4">
            <h2 className="label-mono rule-double mb-3 pt-3 text-mint!">Tareas</h2>
            <form action={taskAction} className="glass-dark space-y-2 rounded-xl p-3">
              <Input name="titulo" maxLength={120} placeholder="Título de la tarea" required />
              <Textarea name="brief" rows={2} maxLength={3000} placeholder="Detalles…" />
              <Button type="submit" variant="elec" size="sm" className="w-full" disabled={taskPending}>
                {taskPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Crear tarea
              </Button>
              {taskState.status === "error" && taskState.message && (
                <p className="text-xs text-elec" role="alert">
                  {taskState.message}
                </p>
              )}
              {taskState.status === "success" && <p className="text-xs text-mint">{taskState.message}</p>}
            </form>

            <ul className="mt-3 space-y-2">
              {tasks.map((t) => (
                <li key={t.id} className="glass-dark rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${TASK_CHIP[t.status] ?? "border-white/20 text-ink-mute"}`}>
                      {t.status}
                    </span>
                    <span className="font-mono text-[9px] text-ink-mute">{dateShort(t.created_at)}</span>
                  </div>
                  <p className="mt-2 font-syne text-base font-bold uppercase leading-tight">{t.titulo}</p>
                  {t.brief && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.brief}</p>}
                  {t.result && (
                    <div className="mt-2 max-h-48 overflow-y-auto border-t border-white/10 pt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink">
                      {t.result}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <form action={runTask}>
                      <input type="hidden" name="id" value={t.id} />
                      <Button type="submit" variant="outline" size="sm">
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        {t.status === "completada" ? "Re-ejecutar" : "Ejecutar"}
                      </Button>
                    </form>
                    <form action={deleteTask}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        aria-label="Eliminar tarea"
                        className="p-2 text-ink-mute transition-colors hover:text-elec"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </form>
                  </div>
                </li>
              ))}
              {tasks.length === 0 && (
                <li className="glass-dark rounded-xl px-4 py-5 text-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  Sin tareas todavía
                </li>
              )}
            </ul>
          </aside>
        </div>
      )}

      {/* ---------- MODELO ---------- */}
      {tab === "modelo" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-dark rounded-xl p-5">
            <p className="label-mono">Estado</p>
            <p className={`headline mt-1 text-2xl ${stats.trained ? "text-mint" : "text-naranja"}`}>
              {stats.trained ? "ENTRENADO" : "SIN ENTRENAR"}
            </p>
          </div>
          <div className="glass-dark rounded-xl p-5">
            <p className="label-mono">Vocabulario</p>
            <p className="headline mt-1 text-3xl text-3d">{stats.vocabSize}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-mute">palabras</p>
          </div>
          <div className="glass-dark rounded-xl p-5">
            <p className="label-mono">Parámetros</p>
            <p className="headline mt-1 text-3xl text-3d">{stats.params.toLocaleString("es-VE")}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-mute">pesos entrenables</p>
          </div>
          <div className="glass-dark rounded-xl p-5">
            <p className="label-mono">Fragmentos indexados</p>
            <p className="headline mt-1 text-3xl text-3d">{stats.chunks}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-mute">chunks de conocimiento</p>
          </div>
          {stats.lossHistory.length > 0 && (
            <div className="glass-dark rounded-xl p-5 sm:col-span-2 lg:col-span-4">
              <h2 className="label-mono rule-double mb-4 pt-3 text-mint!">Último entrenamiento — loss</h2>
              <LossChart history={stats.lossHistory} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
