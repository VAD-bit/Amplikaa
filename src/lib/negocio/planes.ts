import { createClient } from "@supabase/supabase-js";
import { AMPLIKAA_SCHEMA } from "@/lib/supabase/client";
import { PLANS, SYSTEM_PLANS, type Plan, type SystemPlan } from "@/lib/config";

export type LandingPlanes = { marketing: Plan[]; sistemas: SystemPlan[] };

type PlanRow = {
  key: string;
  seccion: string;
  plan_no: string;
  label: string;
  price: number;
  descripcion: string;
  features: unknown;
  entrega: string;
  featured: boolean;
  servicio: string;
  presupuesto: string;
  posicion: number;
  visible: boolean;
};

function toFeatures(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

const FALLBACK: LandingPlanes = {
  marketing: [...PLANS],
  sistemas: [...SYSTEM_PLANS],
};

/**
 * Tarifario visible en la landing. Lee de la tabla amplikaa.planes
 * (editada desde /admin/planes); si falla o está vacía, usa config.ts.
 */
export async function getLandingPlanes(): Promise<LandingPlanes> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return FALLBACK;

  try {
    const supabase = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: AMPLIKAA_SCHEMA },
    });

    const { data, error } = await supabase
      .from("planes")
      .select(
        "key, seccion, plan_no, label, price, descripcion, features, entrega, featured, servicio, presupuesto, posicion, visible"
      )
      .eq("visible", true)
      .order("posicion", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK;

    const marketing: Plan[] = [];
    const sistemas: SystemPlan[] = [];

    for (const r of data as PlanRow[]) {
      const base = {
        key: r.key,
        label: r.label,
        planNo: r.plan_no,
        price: Number(r.price),
        desc: r.descripcion,
        features: toFeatures(r.features),
        featured: r.featured,
        servicio: r.servicio,
        presupuesto: r.presupuesto,
      };
      if (r.seccion === "sistemas") sistemas.push({ ...base, entrega: r.entrega });
      else marketing.push(base);
    }

    return {
      marketing: marketing.length > 0 ? marketing : FALLBACK.marketing,
      sistemas: sistemas.length > 0 ? sistemas : FALLBACK.sistemas,
    };
  } catch {
    return FALLBACK;
  }
}
