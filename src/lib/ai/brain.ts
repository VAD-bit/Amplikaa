import { getSupabaseServer } from "@/lib/supabase/server";
import { Brain } from "./neural/model";

// Singleton en memoria para la sesión del servidor (se reentrena o recarga desde DB)
let cached: Brain | null = null;

export type KnowledgeItem = { id: string; titulo: string; contenido: string };

/** Carga (o reutiliza) el cerebro desde la tabla ai_brain (una sola fila id='default'). */
export async function loadBrain(): Promise<Brain> {
  if (cached) return cached;
  const supabase = await getSupabaseServer();
  if (!supabase) return new Brain();

  const { data } = await supabase.from("ai_brain").select("payload").eq("id", "default").single();
  if (data?.payload) {
    try {
      cached = Brain.fromJSON(data.payload);
      return cached;
    } catch {
      // payload corrupto, arrancamos de cero
    }
  }
  cached = new Brain();
  return cached;
}

/** Guarda el cerebro entrenado en la tabla ai_brain (upsert id='default'). */
export async function saveBrain(brain: Brain) {
  const supabase = await getSupabaseServer();
  if (!supabase) return;
  await supabase
    .from("ai_brain")
    .upsert({ id: "default", payload: brain.toJSON(), updated_at: new Date().toISOString() }, { onConflict: "id" });
  cached = brain;
}

export async function loadKnowledgeItems(): Promise<KnowledgeItem[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return [];
  const { data } = await supabase.from("ai_knowledge").select("id, titulo, contenido");
  return (data ?? []) as KnowledgeItem[];
}

/**
 * Entrena el cerebro con todo el conocimiento almacenado (libros/textos en ai_knowledge)
 * y los pares pregunta/respuesta que se pasen explícitamente.
 */
export async function trainBrain(
  qaPairs: { pregunta: string; respuesta: string }[] = [],
  epochs = 12,
  onEpoch?: (epoch: number, loss: number) => void
): Promise<Brain> {
  const brain = await loadBrain();
  const items = await loadKnowledgeItems();
  const texts = items.map((k) => `${k.titulo}. ${k.contenido}`);
  brain.chunks = items.map((k) => ({ id: k.id, titulo: k.titulo, contenido: k.contenido, vec: [] }));
  brain.train(texts, qaPairs, epochs, onEpoch);
  await saveBrain(brain);
  return brain;
}

/** Responde a una consulta usando el cerebro cargado (recuperación + generación). */
export async function answerWithBrain(query: string) {
  const brain = await loadBrain();
  // si el cerebro no tiene chunks indexados pero hay knowledge en DB, hidrátalos
  if (brain.chunks.length === 0) {
    const items = await loadKnowledgeItems();
    if (items.length > 0) {
      brain.chunks = items.map((k) => ({ id: k.id, titulo: k.titulo, contenido: k.contenido, vec: [] }));
      if (brain.trained) brain.reindexChunks();
    }
  }
  return brain.answer(query);
}

export function resetBrainCache() {
  cached = null;
}
