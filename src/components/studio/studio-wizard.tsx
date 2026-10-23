"use client";

import { useMemo, useRef, useActionState, useEffect, useState } from "react";
import { Loader2, Mic, MicOff, Printer, Send, RotateCcw, ChevronUp, ChevronDown, X } from "lucide-react";
import {
  BLOCKS,
  BUDGET_LABELS,
  PLAZO_LABELS,
  EXTRA_LABELS,
  computeAnalysis,
  type StudioAnalysis,
} from "@/lib/studio/analysis";
import { submitStudio, type StudioState } from "@/app/actions/studio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STEP_NAMES = ["Tu rubro", "Esquema visual", "Tu explicación", "Presupuesto"];
const ANALYZING_MSGS = [
  "Procesando esquema visual…",
  "Ponderando factores de complejidad…",
  "Calculando horas y costo interno…",
  "Evaluando rentabilidad del encargo…",
  "Generando plan de desarrollo…",
];

const GOALS = [
  "Vender en línea",
  "Captar clientes (leads)",
  "Mostrar portafolio",
  "Reservas / Citas",
  "Agendar servicios",
  "Posicionamiento (SEO)",
];

const EXTRAS = Object.keys(EXTRA_LABELS);

interface BlockItem {
  uid: number;
  key: string;
  note: string;
}

const initial: StudioState = { status: "idle" };

/* Mini-vista wireframe por bloque */
function WfVisual({ k }: { k: string }) {
  const line = <i className="block h-1.5 rounded-sm bg-ink/20" />;
  const box = <i className="rounded-sm border border-ink/15 bg-white/65" />;
  switch (k) {
    case "nav":
      return <div className="flex h-5 items-center gap-1 rounded bg-ink/15 px-2"><span className="h-2 w-6 rounded bg-elec/50" /><span className="ml-auto flex gap-1">{line}{line}{line}</span></div>;
    case "hero":
      return <div className="grid h-20 place-items-center rounded bg-gradient-to-br from-elec/25 to-viol/25"><span className="font-mono text-[9px] tracking-widest text-ink">TITULAR + CTA</span></div>;
    case "tienda":
      return <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-12 rounded border border-ink/15 bg-white/70" />)}</div>;
    case "pagos":
      return <div className="grid h-10 place-items-center rounded border border-viol/40 bg-viol/10"><span className="font-mono text-[9px] text-ink">CHECKOUT · PAGO</span></div>;
    case "panel":
      return <div className="flex h-14 rounded border border-elec/30 bg-elec/5"><div className="w-1/4 border-r border-elec/20 p-1">{line}{line}</div><div className="flex-1 p-1.5">{box}</div></div>;
    default:
      return <div className="grid h-10 place-items-center rounded border-dashed border-ink/30 bg-white/65"><span className="font-syne text-[10px] font-bold uppercase tracking-wide text-ink">{BLOCKS[k]?.label ?? k}</span></div>;
  }
}

export function StudioWizard() {
  const [step, setStep] = useState(1);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [uid, setUid] = useState(1);
  const [dragUid, setDragUid] = useState<number | null>(null);
  const [nota, setNota] = useState("");
  const [notaCount, setNotaCount] = useState(0);
  const [listening, setListening] = useState(false);
  const [analysis, setAnalysis] = useState<StudioAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingMsg, setAnalyzingMsg] = useState(ANALYZING_MSGS[0]);
  const [form, setForm] = useState({
    nombre: "", email: "", whatsapp: "", empresa: "", rubro: "", publico: "",
    budget: "", budgetNote: "", plazo: "",
  });
  const [goals, setGoals] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);

  const [state, formAction, pending] = useActionState(submitStudio, initial);

  useEffect(() => {
    if (state.status === "success" && state.payload) {
      setAnalysis(state.payload.analysis);
      setAnalyzing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state]);

  /* Validación por paso */
  function validate(n: number): boolean {
    if (n === 1) {
      if (form.nombre.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email) || form.rubro.trim().length < 20) return false;
    }
    if (n === 2 && blocks.length < 3) return false;
    if (n === 3 && nota.trim().length < 40) return false;
    if (n === 4 && !form.budget) return false;
    return true;
  }

  function addBlock(key: string) {
    setBlocks((b) => [...b, { uid, key, note: "" }]);
    setUid((u) => u + 1);
  }
  function removeBlock(u: number) {
    setBlocks((b) => b.filter((x) => x.uid !== u));
  }
  function moveBlock(u: number, dir: number) {
    setBlocks((b) => {
      const i = b.findIndex((x) => x.uid === u);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.length) return b;
      const copy = [...b];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }
  function setNote(u: number, note: string) {
    setBlocks((b) => b.map((x) => (x.uid === u ? { ...x, note } : x)));
  }
  function onDrop(targetUid: number) {
    if (dragUid === null || dragUid === targetUid) return;
    setBlocks((b) => {
      const from = b.findIndex((x) => x.uid === dragUid);
      const to = b.findIndex((x) => x.uid === targetUid);
      if (from < 0 || to < 0) return b;
      const copy = [...b];
      const [m] = copy.splice(from, 1);
      copy.splice(to, 0, m);
      return copy;
    });
    setDragUid(null);
  }

  /* Dictado por voz */
  const recRef = useRef<SpeechRecognition | null>(null);

  function toggleVoice() {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    if (listening && recRef.current) {
      recRef.current.stop();
      return;
    }
    const rec = new SR();
    rec.lang = "es-VE";
    rec.continuous = true;
    rec.interimResults = true;
    let base = nota ? nota.replace(/\s*$/, " ") : "";
    rec.onstart = () => setListening(true);
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) base += t + " ";
        else interim += t;
      }
      const val = base + interim;
      setNota(val);
      setNotaCount(val.length);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
  }

  async function handleSubmit() {
    if (!validate(4)) return;
    setAnalyzing(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("nota", nota);
    goals.forEach((g) => fd.append("goals", g));
    extras.forEach((e) => fd.append("extras", e));
    fd.append("blocks", JSON.stringify(blocks));

    const local = computeAnalysis({ blocks, extras, budget: form.budget, plazo: form.plazo });
    for (const m of ANALYZING_MSGS) {
      setAnalyzingMsg(m);
      await new Promise((r) => setTimeout(r, 380));
    }
    formAction(fd);
    if (!analysis) setAnalysis(local);
  }

  const pct = useMemo(() => (analysis ? 100 : (step - 1) * 25), [step, analysis]);

  /* ============ REPORTE ============ */
  if (analysis) {
    return <Report analysis={analysis} form={form} blocks={blocks} goals={goals} extras={extras} nota={nota} onReset={() => { setAnalysis(null); setStep(1); }} />;
  }

  return (
    <div className="relative">
      {/* Progreso */}
      <div className="mb-10 mt-12" aria-hidden="true">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.2em] text-ink">
          <span>Paso {step} de 4 — {STEP_NAMES[step - 1]}</span>
          <span>{pct}%</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((d) => (
            <div key={d} className={cn("h-[3px] overflow-hidden rounded-full bg-ink/15", d < step && "bg-gradient-to-r from-elec to-viol", d === step && "bg-gradient-to-r from-elec to-viol")} />
          ))}
        </div>
      </div>

      {/* PASO 1 */}
      {step === 1 && (
        <section className="glass corners rounded-2xl p-7 sm:p-10" aria-labelledby="t1">
          <p className="label-mono mb-3">Paso 01</p>
          <h2 id="t1" className="font-syne text-2xl font-extrabold uppercase mb-2 sm:text-3xl">Tu rubro y contacto</h2>
          <p className="mb-8 text-ink">Esto define el análisis de industria y nos permite responderte.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="s-nombre" className="label-mono mb-2 block">Nombre *</label>
              <Input id="s-nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" />
            </div>
            <div>
              <label htmlFor="s-email" className="label-mono mb-2 block">Email *</label>
              <Input id="s-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
            </div>
            <div>
              <label htmlFor="s-wpp" className="label-mono mb-2 block">WhatsApp</label>
              <Input id="s-wpp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+58 4XX XXX XXXX" />
            </div>
            <div>
              <label htmlFor="s-emp" className="label-mono mb-2 block">Marca / Proyecto</label>
              <Input id="s-emp" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Nombre de tu marca" />
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="s-rubro" className="label-mono mb-2 block">¿Cuál es tu rubro, nicho o emprendimiento? *</label>
            <Textarea id="s-rubro" rows={4} value={form.rubro} onChange={(e) => setForm({ ...form, rubro: e.target.value })} placeholder="Ej: Soy pastelera artesanal en Caracas, vendo por Instagram y quiero un sitio para mostrar catálogo y tomar pedidos…" />
          </div>
          <div className="mt-5">
            <label htmlFor="s-pub" className="label-mono mb-2 block">¿A quién le vendes? (público objetivo)</label>
            <Input id="s-pub" value={form.publico} onChange={(e) => setForm({ ...form, publico: e.target.value })} placeholder="Ej: parejas 25-45 años en Caracas y Valencia" />
          </div>
        </section>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <section className="glass corners rounded-2xl p-7 sm:p-10" aria-labelledby="t2">
          <p className="label-mono mb-3">Paso 02</p>
          <h2 id="t2" className="font-syne text-2xl font-extrabold uppercase mb-2 sm:text-3xl">Esquema visual de tu website</h2>
          <p className="mb-8 text-ink">Agrega los bloques que quieres en tu sitio y ordénalos arrastrando.</p>
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="self-start lg:sticky lg:top-24">
              <p className="label-mono mb-3">Bloques disponibles</p>
              <div className="grid max-h-[480px] grid-cols-2 gap-2 overflow-y-auto pr-1 lg:grid-cols-1">
                {Object.entries(BLOCKS).map(([k, b]) => (
                  <button key={k} type="button" onClick={() => addBlock(k)} className="palette-item flex cursor-pointer items-center gap-3 rounded-xl border border-ink/15 bg-white/55 p-3 text-left">
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{b.label}</span>
                      <span className="block font-mono text-[9px] text-ink">peso {b.weight}</span>
                    </span>
                  </button>
                ))}
              </div>
            </aside>
            <div>
              <p className="label-mono mb-3">Tu esquema (de arriba a abajo)</p>
              <div className="min-h-[420px] space-y-3 rounded-2xl border border-dashed border-ink/20 bg-white/60 p-4">
                {blocks.length === 0 && (
                  <p className="py-20 text-center font-mono text-xs text-ink">← Agrega bloques desde la paleta</p>
                )}
                {blocks.map((b, i) => (
                  <div
                    key={b.uid}
                    draggable
                    onDragStart={() => setDragUid(b.uid)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(b.uid)}
                    className={cn("wf-block rounded-xl border bg-white/75 p-3.5", dragUid === b.uid ? "opacity-35" : "border-ink/18")}
                  >
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1 pt-1">
                        <button type="button" onClick={() => moveBlock(b.uid, -1)} disabled={i === 0} className="grid h-6 w-6 cursor-pointer place-items-center rounded border border-ink/15 text-xs text-ink hover:bg-mark disabled:opacity-30" aria-label="Subir"><ChevronUp className="h-3 w-3" /></button>
                        <button type="button" onClick={() => moveBlock(b.uid, 1)} disabled={i === blocks.length - 1} className="grid h-6 w-6 cursor-pointer place-items-center rounded border border-ink/15 text-xs text-ink hover:bg-mark disabled:opacity-30" aria-label="Bajar"><ChevronDown className="h-3 w-3" /></button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-ink">{String(i + 1).padStart(2, "0")}</span>
                          <button type="button" onClick={() => removeBlock(b.uid)} className="cursor-pointer text-ink hover:text-red-600" aria-label={`Eliminar ${BLOCKS[b.key]?.label}`}><X className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="mb-2 font-syne text-sm font-bold uppercase tracking-wide">{BLOCKS[b.key]?.label}</p>
                        <div className="mb-2.5 opacity-80"><WfVisual k={b.key} /></div>
                        <Input value={b.note} onChange={(e) => setNote(b.uid, e.target.value)} placeholder="Nota para AMPLIKAA (opcional)…" className="!py-1.5 !text-xs" aria-label="Nota sobre el bloque" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <section className="glass corners rounded-2xl p-7 sm:p-10" aria-labelledby="t3">
          <p className="label-mono mb-3">Paso 03</p>
          <h2 id="t3" className="font-syne text-2xl font-extrabold uppercase mb-2 sm:text-3xl">Explícanos cómo debe funcionar</h2>
          <p className="mb-8 text-ink">Escribe o dicta por voz cómo quieres que funcione tu website.</p>
          <button
            type="button"
            onClick={toggleVoice}
            className={cn(
              "mb-4 inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all",
              listening ? "border-red-600/70 text-red-700" : "border-ink/30 hover:border-red-600/70 hover:text-red-700"
            )}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? "Detener dictado" : "Dictar por voz"}
          </button>
          <p className="mb-4 font-mono text-[11px] text-ink">{listening ? "Escuchando… habla ahora" : "Requiere Chrome o Edge · idioma es-VE"}</p>
          <label htmlFor="s-nota" className="label-mono mb-2 block">Tu explicación *</label>
          <Textarea id="s-nota" rows={8} value={nota} onChange={(e) => { setNota(e.target.value); setNotaCount(e.target.value.length); }} placeholder="Ej: Cuando el cliente entra debe ver el catálogo del mes con fotos grandes. Al tocar un pastel quiero que abra un formulario para reservar fecha…" className="leading-relaxed" />
          <p className="mt-2 font-mono text-[10px] text-ink">{notaCount} caracteres · mínimo recomendado: 80</p>

          <div className="mt-6">
            <p className="label-mono mb-3">¿Qué debe lograr el sitio?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const on = goals.includes(g);
                return (
                  <label key={g} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors", on ? "border-elec/50 bg-elec/5" : "border-ink/15 hover:border-elec/40")}>
                    <input type="checkbox" checked={on} onChange={() => setGoals((v) => (on ? v.filter((x) => x !== g) : [...v, g]))} className="h-4 w-4 accent-[#00F0FF]" />
                    <span className="text-sm">{g}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PASO 4 */}
      {step === 4 && (
        <section className="glass corners rounded-2xl p-7 sm:p-10" aria-labelledby="t4">
          <p className="label-mono mb-3">Paso 04</p>
          <h2 id="t4" className="font-syne text-2xl font-extrabold uppercase mb-2 sm:text-3xl">Tu presupuesto</h2>
          <p className="mb-8 text-ink">Sé honesto: con eso ajustamos el alcance y te decimos con transparencia si es viable.</p>
          <label htmlFor="s-budget" className="label-mono mb-2 block">Rango de inversión disponible (USD) *</label>
          <Select id="s-budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
            <option value="">Selecciona un rango…</option>
            {Object.entries(BUDGET_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </Select>
          <div className="mt-5">
            <label htmlFor="s-bnote" className="label-mono mb-2 block">Contexto del presupuesto</label>
            <Textarea id="s-bnote" rows={3} value={form.budgetNote} onChange={(e) => setForm({ ...form, budgetNote: e.target.value })} placeholder="Ej: Puedo invertir $800 ahora y el resto en 2 meses…" />
          </div>
          <div className="mt-5">
            <label htmlFor="s-plazo" className="label-mono mb-2 block">¿Para cuándo lo necesitas?</label>
            <Select id="s-plazo" value={form.plazo} onChange={(e) => setForm({ ...form, plazo: e.target.value })}>
              <option value="">Sin fecha fija</option>
              {Object.entries(PLAZO_LABELS).filter(([k]) => k).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {EXTRAS.map((k) => {
              const on = extras.includes(k);
              return (
                <label key={k} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors", on ? "border-elec/50 bg-elec/5" : "border-ink/15 hover:border-elec/40")}>
                  <input type="checkbox" checked={on} onChange={() => setExtras((v) => (on ? v.filter((x) => x !== k) : [...v, k]))} className="h-4 w-4 accent-[#00F0FF]" />
                  <span className="text-sm">
                    {EXTRA_LABELS[k]}
                    <span className="block font-mono text-[10px] text-ink">+{k === "seo" ? 3 : k === "analytics" ? 2 : k === "custom" ? 6 : k === "anim" ? 5 : k === "hosting" ? 1 : 2} complejidad</span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Navegación */}
      <div className="mt-6 flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>← Atrás</Button>
        ) : <span />}
        {step < 4 ? (
          <Button onClick={() => validate(step) && setStep((s) => s + 1)}>Continuar →</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={pending || analyzing}>
            {pending || analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {analyzing ? analyzingMsg : "Enviando…"}
              </>
            ) : (
              <>
                Enviar solicitud
                <Send className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        )}
      </div>
      {step === 2 && blocks.length < 3 && (
        <p className="mt-2 text-right text-xs text-red-600">Agrega al menos 3 bloques para continuar.</p>
      )}
    </div>
  );
}

/* Declaración mínima para Web Speech API (no está en lib.dom por defecto) */
declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start(): void;
    stop(): void;
  }
  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
  }
}

/* ============ COMPONENTE REPORTE ============ */
function Report({
  analysis: a,
  form,
  blocks,
  goals,
  extras,
  nota,
  onReset,
}: {
  analysis: StudioAnalysis;
  form: { nombre: string; email: string; empresa: string; rubro: string; publico: string; budgetNote: string; plazo: string };
  blocks: BlockItem[];
  goals: string[];
  extras: string[];
  nota: string;
  onReset: () => void;
}) {
  const date = new Date();
  const dateStr = date.toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-10 pb-20">
      <header className="mb-4">
        <p className="label-mono mb-4">// Reporte generado · AMPLIKAA Studio</p>
        <h1 className="font-syne text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
          Informe de<br /><span className="text-gradient">viabilidad y plan</span>
        </h1>
        <p className="mt-4 font-mono text-xs text-ink">
          Solicitud #{date.getTime().toString().slice(-6)} · {dateStr} · {form.nombre}
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Button variant="elec" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden="true" />
          Imprimir / PDF
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Nueva solicitud
        </Button>
      </div>

      {/* Brief */}
      <section className="glass corners rounded-2xl p-7 sm:p-9">
        <p className="label-mono mb-3">01 — Brief del cliente</p>
        <h3 className="mb-5 font-syne text-xl font-extrabold uppercase">Ficha de solicitud</h3>
        <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div><dt className="label-mono mb-1">Cliente</dt><dd>{form.nombre}{form.empresa ? ` · ${form.empresa}` : ""}</dd></div>
          <div><dt className="label-mono mb-1">Contacto</dt><dd>{form.email}</dd></div>
          <div><dt className="label-mono mb-1">Rubro / Nicho</dt><dd className="leading-relaxed text-ink">{form.rubro}</dd></div>
          <div><dt className="label-mono mb-1">Público objetivo</dt><dd className="text-ink">{form.publico || "No especificado"}</dd></div>
          <div className="sm:col-span-2">
            <dt className="label-mono mb-2">Metas del sitio</dt>
            <dd className="flex flex-wrap gap-2">
              {goals.length
                ? goals.map((g) => <span key={g} className="rounded-md border border-viol/40 bg-viol/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">{g}</span>)
                : <span className="text-ink">Sin metas marcadas</span>}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="label-mono mb-2">Explicación del cliente</dt>
            <dd className="whitespace-pre-wrap rounded-xl border border-ink/15 bg-white/55 p-4 leading-relaxed text-ink">{nota}</dd>
          </div>
        </dl>
      </section>

      {/* Diagrama + esquema */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-7 sm:p-9">
          <p className="label-mono mb-3">02 — Diagrama de flujo</p>
          <h3 className="mb-5 font-syne text-xl font-extrabold uppercase">Recorrido del usuario</h3>
          <div className="flex flex-col items-center py-2">
            {blocks.map((b, i) => (
              <div key={b.uid} className="flex w-full flex-col items-center">
                <div className="w-full max-w-xs rounded-lg border border-elec/30 bg-elec/5 px-4 py-2.5 text-center">
                  <p className="font-mono text-[9px] text-ink">{String(i + 1).padStart(2, "0")}</p>
                  <p className="font-syne text-xs font-bold uppercase tracking-wide">{BLOCKS[b.key]?.label}</p>
                </div>
                {i < blocks.length - 1 && <div className="my-1 h-[22px] w-0.5 bg-gradient-to-b from-elec/40 to-viol/40" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-7 sm:p-9">
          <p className="label-mono mb-3">02b — Esquema visual</p>
          <h3 className="mb-5 font-syne text-xl font-extrabold uppercase">Estructura ({blocks.length} bloques)</h3>
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {blocks.map((b, i) => (
              <div key={b.uid} className="rounded-lg border border-ink/18 bg-white/65 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-syne text-[11px] font-bold uppercase tracking-wide">{BLOCKS[b.key]?.label}</span>
                  <span className="font-mono text-[9px] text-ink">w{BLOCKS[b.key]?.weight}</span>
                </div>
                <WfVisual k={b.key} />
                {b.note && <p className="mt-2 text-[11px] italic text-ink">“{b.note}”</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complejidad */}
      <section className="glass corners rounded-2xl p-7 sm:p-9">
        <p className="label-mono mb-3">03 — Diagnóstico interno</p>
        <h3 className="mb-6 font-syne text-xl font-extrabold uppercase">Reporte evaluativo de complejidad</h3>
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="metric-card p-5"><p className="label-mono mb-2">Nivel</p><p className="font-syne text-3xl font-extrabold" style={{ color: a.levelColor }}>{a.level}</p></div>
          <div className="metric-card p-5"><p className="label-mono mb-2">Score</p><p className="font-syne text-3xl font-extrabold">{a.score} <span className="font-mono text-base text-ink">pts</span></p></div>
          <div className="metric-card p-5"><p className="label-mono mb-2">Horas estimadas</p><p className="font-syne text-3xl font-extrabold">{a.hours}h</p></div>
        </div>
        <p className="mb-6 leading-relaxed text-ink">{a.levelNote}</p>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-ink/15 text-left"><th className="label-mono pb-2">Factor</th><th className="label-mono pb-2 text-right">Peso</th></tr></thead>
          <tbody>
            {a.factors.map((f, i) => (
              <tr key={i} className="border-b border-ink/12">
                <td className="py-2.5 text-ink">{f.label}{f.note && <span className="text-xs italic text-ink"> — “{f.note}”</span>}</td>
                <td className="py-2.5 text-right font-mono text-ink">{f.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-7">
          <p className="label-mono mb-3">Riesgos detectados</p>
          <ul className="space-y-2.5">
            {a.risks.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className={cn("mt-0.5 shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase", r.sev === "Alta" ? "bg-red-500/15 text-red-600" : r.sev === "Media" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400")}>{r.sev}</span>
                <span className="leading-relaxed text-ink">{r.txt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Financiero */}
      <section className="glass corners rounded-2xl p-7 sm:p-9">
        <p className="label-mono mb-3">04 — Viabilidad económica</p>
        <h3 className="mb-6 font-syne text-xl font-extrabold uppercase">Análisis financiero del encargo</h3>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="metric-card p-5"><p className="label-mono mb-2">Costo interno</p><p className="font-syne text-2xl font-extrabold">${a.cost.toLocaleString()}</p><p className="mt-1 font-mono text-[10px] text-ink">{a.hours}h × $25/h</p></div>
          <div className="metric-card p-5"><p className="label-mono mb-2">Precio sugerido</p><p className="font-syne text-2xl font-extrabold text-ink">${a.suggested.toLocaleString()}</p><p className="mt-1 font-mono text-[10px] text-ink">margen ×1.35</p></div>
          <div className="metric-card p-5"><p className="label-mono mb-2">Presupuesto cliente</p><p className="font-syne text-2xl font-extrabold">{a.budgetLabel}</p><p className="mt-1 font-mono text-[10px] text-ink">ref: ${a.budgetMid.toLocaleString()}</p></div>
          <div className="metric-card p-5"><p className="label-mono mb-2">Veredicto</p><p className="font-syne text-2xl font-extrabold" style={{ color: a.verdictColor }}>{a.verdict}</p><p className="mt-1 font-mono text-[10px] text-ink">ratio {(a.ratio * 100).toFixed(0)}%</p></div>
        </div>
        <p className="leading-relaxed text-ink">{a.verdictNote}</p>
        <div className="mt-6 rounded-xl border border-elec/25 bg-elec/5 p-5">
          <p className="label-mono mb-2">Recomendación comercial</p>
          <p className="text-sm leading-relaxed text-ink">{a.recommendation} Extras: {extras.length ? extras.map((e) => EXTRA_LABELS[e]).join(" · ") : "ninguno"}.</p>
        </div>
        {form.budgetNote && (
          <p className="mt-4 text-xs text-ink">Nota de presupuesto del cliente: “{form.budgetNote}”</p>
        )}
      </section>

      {/* Plan */}
      <section className="glass corners rounded-2xl p-7 sm:p-9">
        <p className="label-mono mb-3">05 — Roadmap</p>
        <h3 className="mb-2 font-syne text-xl font-extrabold uppercase">Plan de desarrollo detallado</h3>
        <p className="mb-8 text-sm text-ink">
          Duración total estimada: <strong className="text-ink">{a.totalWeeks} semanas</strong> · Plazo solicitado: {PLAZO_LABELS[form.plazo] || "Sin fecha fija"}
        </p>
        <ol className="space-y-5">
          {a.phases.map((p) => (
            <li key={p.n} className="relative border-l border-ink/15 pb-2 pl-8">
              <span className="absolute top-1 -left-[7px] h-3 w-3 rounded-full bg-elec" aria-hidden="true" />
              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-ink">{p.n}</span>
                <h4 className="text-base font-extrabold font-syne uppercase">{p.name}</h4>
                <span className="rounded border border-ink/15 bg-white/65 px-2 py-0.5 font-mono text-[10px] text-ink">{p.weeks} sem</span>
              </div>
              <ul className="mb-2 space-y-1.5">
                {p.tasks.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm text-ink"><span className="mt-0.5 text-ink">▸</span>{t}</li>
                ))}
              </ul>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink">Entregable: {p.deliver}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-xl border border-ink/15 bg-white/55 p-5">
          <p className="label-mono mb-2">Presupuesto por fase (sugerido)</p>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <p className="text-ink">Fase 1–2: <strong className="text-ink">{Math.round(a.suggested * 0.3)} USD</strong></p>
            <p className="text-ink">Fase 3–4: <strong className="text-ink">{Math.round(a.suggested * 0.5)} USD</strong></p>
            <p className="text-ink">Fase 5–6: <strong className="text-ink">{Math.round(a.suggested * 0.2)} USD</strong></p>
          </div>
        </div>
      </section>

      <p className="pt-4 text-center font-mono text-[10px] text-ink">
        Generado por AMPLIKAA Studio · Confidencial · {dateStr}
      </p>
    </div>
  );
}
