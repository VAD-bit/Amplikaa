import { requireUser } from "../_components/guard";
import { EmpleadosManager, type EmpleadoUI } from "./empleados-manager";

export const dynamic = "force-dynamic";

export default async function AdminEmpleadosPage() {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("empleados")
    .select("id, nombre, cargo, email, telefono, salario_base, ingreso, estado, notas")
    .order("estado", { ascending: true })
    .order("created_at", { ascending: true });

  const needsSetup = !!error && /does not exist/i.test(error.message);

  return <EmpleadosManager empleados={(data ?? []) as EmpleadoUI[]} needsSetup={needsSetup} />;
}
