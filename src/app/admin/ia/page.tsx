import { requireUser } from "../_components/guard";
import { getBrainStats } from "./actions";
import { IaConsole, type AiKnow, type AiMsg, type AiTask } from "./console";

export const dynamic = "force-dynamic";

export default async function AdminIaPage() {
  const { supabase } = await requireUser();

  const [msgRes, knowRes, taskRes, stats] = await Promise.all([
    supabase
      .from("ai_messages")
      .select("id, role, content, created_at")
      .order("created_at", { ascending: true })
      .limit(100),
    supabase
      .from("ai_knowledge")
      .select("id, titulo, contenido, created_at, tipo, origen, chunk_idx")
      .order("created_at", { ascending: false }),
    supabase
      .from("ai_tasks")
      .select("id, titulo, brief, status, result, created_at")
      .order("created_at", { ascending: false }),
    getBrainStats(),
  ]);

  const missing = [msgRes, knowRes, taskRes].some(
    (r) => !!r.error && /does not exist/i.test(r.error.message)
  );

  return (
    <IaConsole
      messages={(msgRes.data ?? []) as AiMsg[]}
      knowledge={(knowRes.data ?? []) as AiKnow[]}
      tasks={(taskRes.data ?? []) as AiTask[]}
      stats={stats}
      needsSetup={missing}
    />
  );
}
