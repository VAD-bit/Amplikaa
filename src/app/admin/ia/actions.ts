"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { answerWithBrain, loadBrain, trainBrain } from "@/lib/ai/brain";
import { chunkText, extractTextFromFile } from "@/lib/ai/ingest";

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const chatSchema = z.object({
  texto: z.string().trim().min(1, "Escribe un mensaje.").max(2000, "Máx. 2000 caracteres."),
});

const knowledgeSchema = z.object({
  titulo: z.string().trim().min(2, "Título muy corto.").max(80, "Máx. 80 caracteres."),
  contenido: z.string().trim().min(4, "Contenido muy corto.").max(12000, "Máx. 12000 caracteres."),
});

const qaPairSchema = z.object({
  pregunta: z.string().trim().min(2, "Pregunta muy corta.").max(300, "Máx. 300."),
  respuesta: z.string().trim().min(2, "Respuesta muy corta.").max(2000, "Máx. 2000."),
});

const trainSchema = z.object({
  epochs: z.coerce.number().int().min(1).max(60).default(12),
});

const uuidSchema = z.string().uuid();

async function requireSupabase() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function zodError(e: { issues: { path: (string | number)[]; message: string }[] }) {
  return e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ");
}

function dbHint(message: string) {
  return /does not exist/i.test(message)
    ? "Falta la tabla del cerebro: aplica supabase/migrations/0005_ai_brain.sql en Supabase → SQL Editor."
    : message;
}

/* ---------------- Chat (cerebro local) ---------------- */

export async function sendChat(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = chatSchema.safeParse({ texto: formData.get("texto") });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error: insErr } = await supabase
    .from("ai_messages")
    .insert({ role: "user", content: parsed.data.texto });
  if (insErr) return { status: "error", message: dbHint(insErr.message) };

  try {
    const { text } = await answerWithBrain(parsed.data.texto);
    const { error: replyErr } = await supabase
      .from("ai_messages")
      .insert({ role: "assistant", content: text });
    if (replyErr) return { status: "error", message: dbHint(replyErr.message) };
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  revalidatePath("/admin/ia");
  return { status: "success" };
}

export async function clearChat() {
  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("ai_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  revalidatePath("/admin/ia");
}

/* ---------------- Conocimiento (libros/textos) ---------------- */

export async function addKnowledge(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = knowledgeSchema.safeParse({
    titulo: formData.get("titulo"),
    contenido: formData.get("contenido"),
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("ai_knowledge").insert(parsed.data);
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/ia");
  return { status: "success", message: "Texto añadido. Entrena el cerebro para que lo aprenda." };
}

export async function deleteKnowledge(formData: FormData) {
  const id = formData.get("id");
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("ai_knowledge").delete().eq("id", parsed.data);
  revalidatePath("/admin/ia");
}

/* ---------------- Ingesta de archivos (PDF, libros, subtítulos de video) ---------------- */

export async function uploadDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const file = formData.get("archivo");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecciona un archivo (.pdf, .txt, .srt, .vtt)." };
  }

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  try {
    const { text, kind } = await extractTextFromFile(file);
    if (!text || text.length < 40) {
      return { status: "error", message: "No se pudo extraer texto del archivo (¿es un PDF escaneado sin OCR?)." };
    }

    const chunks = chunkText(text, 1200, 150);
    const rows = chunks.map((c, i) => ({
      titulo: `${file.name} · parte ${i + 1}/${chunks.length}`,
      contenido: c,
      tipo: kind,
      origen: file.name,
      chunk_idx: i,
    }));

    const { error } = await supabase.from("ai_knowledge").insert(rows);
    if (error) return { status: "error", message: dbHint(error.message) };

    revalidatePath("/admin/ia");
    return {
      status: "success",
      message: `"${file.name}" leído: ${chunks.length} fragmentos guardados (${kind}). Entrena el cerebro para aprenderlo.`,
    };
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }
}

/* ---------------- Bitácora de actividad (imitar cómo trabajas) ---------------- */

const activitySchema = z.object({
  titulo: z.string().trim().min(2, "Título muy corto.").max(120, "Máx. 120 caracteres."),
  detalle: z.string().trim().min(4, "Detalle muy corto.").max(8000, "Máx. 8000 caracteres."),
});

export async function addActivity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = activitySchema.safeParse({
    titulo: formData.get("titulo"),
    detalle: formData.get("detalle"),
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("ai_knowledge").insert({
    titulo: parsed.data.titulo,
    contenido: parsed.data.detalle,
    tipo: "actividad",
    origen: "bitácora",
  });
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/ia");
  return { status: "success", message: "Actividad registrada. Entra en Entrenar para que la aprenda." };
}

/* ---------------- Pares pregunta/respuesta (supervisado) ---------------- */

export async function addQaPair(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = qaPairSchema.safeParse({
    pregunta: formData.get("pregunta"),
    respuesta: formData.get("respuesta"),
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("ai_knowledge").insert({
    titulo: `Q: ${parsed.data.pregunta}`,
    contenido: parsed.data.respuesta,
  });
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/ia");
  return { status: "success", message: "Par guardado. Entrena el cerebro para reforzarlo." };
}

/* ---------------- Entrenar cerebro ---------------- */

export async function runTraining(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = trainSchema.safeParse({ epochs: formData.get("epochs") || 12 });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  // pares supervisados: cada entrada de ai_knowledge cuyo título empieza con "Q: " es un par
  const { data: items } = await supabase.from("ai_knowledge").select("titulo, contenido");
  const qaPairs: { pregunta: string; respuesta: string }[] = [];
  const texts: string[] = [];
  for (const it of (items ?? []) as { titulo: string; contenido: string }[]) {
    if (it.titulo.startsWith("Q: ")) {
      qaPairs.push({ pregunta: it.titulo.slice(3).trim(), respuesta: it.contenido });
    } else {
      texts.push(`${it.titulo}. ${it.contenido}`);
    }
  }

  if (texts.length === 0 && qaPairs.length === 0) {
    return { status: "error", message: "No hay nada que enseñar. Añade textos o pares en Conocimiento." };
  }

  try {
    const brain = await trainBrain(qaPairs, parsed.data.epochs);
    const lastLoss = brain.lossHistory[brain.lossHistory.length - 1] ?? 0;
    return {
      status: "success",
      message: `Cerebro entrenado en ${parsed.data.epochs} épocas. Loss final: ${lastLoss.toFixed(4)}. Vocabulario: ${brain.tokenizer.vocabSize} palabras.`,
    };
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }
}

/* ---------------- Estado del modelo ---------------- */

export async function getBrainStats() {
  const brain = await loadBrain();
  return {
    trained: brain.trained,
    vocabSize: brain.tokenizer.vocabSize,
    chunks: brain.chunks.length,
    lossHistory: brain.lossHistory,
    params:
      brain.embed.E.length * (brain.embed.E[0]?.length ?? 0) +
      brain.enc1.W.length * (brain.enc1.W[0]?.length ?? 0) +
      brain.enc2.W.length * (brain.enc2.W[0]?.length ?? 0) +
      brain.lm1.W.length * (brain.lm1.W[0]?.length ?? 0) +
      brain.lm2.W.length * (brain.lm2.W[0]?.length ?? 0),
  };
}

/* ---------------- Tareas (operativas, sin LLM externo) ---------------- */

const taskSchema = z.object({
  titulo: z.string().trim().min(2, "Título muy corto.").max(120, "Máx. 120 caracteres."),
  brief: z.string().trim().max(3000, "Máx. 3000 caracteres.").optional().default(""),
});

export async function createTask(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = taskSchema.safeParse({
    titulo: formData.get("titulo"),
    brief: formData.get("brief") || "",
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("ai_tasks").insert(parsed.data);
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/ia");
  return { status: "success", message: "Tarea creada." };
}

export async function runTask(formData: FormData) {
  const parsed = uuidSchema.safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  const { data: task } = await supabase
    .from("ai_tasks")
    .select("id, titulo, brief")
    .eq("id", parsed.data)
    .single();
  if (!task) return;

  const now = new Date().toISOString();
  await supabase.from("ai_tasks").update({ status: "ejecutando", updated_at: now }).eq("id", task.id);

  try {
    // El cerebro local busca en su conocimiento y genera una respuesta operativa.
    const query = `${task.titulo} ${task.brief}`.trim();
    const { text } = await answerWithBrain(query);
    const done = new Date().toISOString();
    await supabase
      .from("ai_tasks")
      .update({ status: "completada", result: text, ran_at: done, updated_at: done })
      .eq("id", task.id);
  } catch (e) {
    await supabase
      .from("ai_tasks")
      .update({
        status: "error",
        result: (e as Error).message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id);
  }

  revalidatePath("/admin/ia");
}

export async function deleteTask(formData: FormData) {
  const parsed = uuidSchema.safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("ai_tasks").delete().eq("id", parsed.data);
  revalidatePath("/admin/ia");
}
