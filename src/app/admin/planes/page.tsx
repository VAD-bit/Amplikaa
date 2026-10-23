import { requireUser } from "../_components/guard";
import { PlanesManager, type PlanRowUI } from "./planes-manager";

export const dynamic = "force-dynamic";

export default async function AdminPlanesPage() {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("planes")
    .select(
      "id, key, seccion, plan_no, label, price, descripcion, features, entrega, featured, servicio, presupuesto, posicion, visible"
    )
    .order("posicion", { ascending: true })
    .order("created_at", { ascending: true });

  const needsSetup = !!error && /does not exist/i.test(error.message);

  return <PlanesManager planes={(data ?? []) as PlanRowUI[]} needsSetup={needsSetup} />;
}
