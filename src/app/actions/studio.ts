"use server";

import { studioSchema, type StudioInput } from "@/lib/schemas";
import { computeAnalysis } from "@/lib/studio/analysis";
import { getSupabaseServer } from "@/lib/supabase/server";

export interface StudioPayload {
  analysis: ReturnType<typeof computeAnalysis>;
  submittedAt: string;
}

export interface StudioState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
  payload?: StudioPayload;
}

export async function submitStudio(
  _prev: StudioState,
  formData: FormData
): Promise<StudioState> {
  const raw = {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp") ?? "",
    empresa: formData.get("empresa") ?? "",
    rubro: formData.get("rubro"),
    publico: formData.get("publico") ?? "",
    nota: formData.get("nota"),
    goals: formData.getAll("goals").map(String),
    budget: formData.get("budget"),
    budgetNote: formData.get("budgetNote") ?? "",
    plazo: formData.get("plazo") ?? "",
    extras: formData.getAll("extras").map(String),
    blocks: JSON.parse((formData.get("blocks") as string) || "[]"),
  };

  const parsed = studioSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors };
  }

  const data: StudioInput = parsed.data;
  const analysis = computeAnalysis({
    blocks: data.blocks,
    extras: data.extras,
    budget: data.budget,
    plazo: data.plazo,
  });

  const supabase = await getSupabaseServer();

  if (supabase) {
    const { error } = await supabase.from("studio_submissions").insert({
      nombre: data.nombre,
      email: data.email,
      whatsapp: data.whatsapp || null,
      empresa: data.empresa || null,
      rubro: data.rubro,
      publico: data.publico || null,
      nota: data.nota,
      goals: data.goals,
      budget_range: data.budget,
      budget_note: data.budgetNote || null,
      plazo: data.plazo || null,
      extras: data.extras,
      blocks: data.blocks,
      analysis: {
        score: analysis.score,
        level: analysis.level,
        hours: analysis.hours,
        cost: analysis.cost,
        suggested: analysis.suggested,
        verdict: analysis.verdict,
        totalWeeks: analysis.totalWeeks,
      },
      source: "studio",
    });

    if (error) {
      console.error("[studio insert]", error.message);
    }
  }

  return {
    status: "success",
    payload: { analysis, submittedAt: new Date().toISOString() },
  };
}
