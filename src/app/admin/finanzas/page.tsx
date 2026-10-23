import { requireUser } from "../_components/guard";
import { FinanzasManager, type MovUI } from "./finanzas-manager";

export const dynamic = "force-dynamic";

export default async function AdminFinanzasPage() {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("finanzas")
    .select("id, fecha, tipo, concepto, monto, categoria, notas")
    .order("fecha", { ascending: false })
    .limit(300);

  const needsSetup = !!error && /does not exist/i.test(error.message);

  return <FinanzasManager movs={(data ?? []) as MovUI[]} needsSetup={needsSetup} />;
}
