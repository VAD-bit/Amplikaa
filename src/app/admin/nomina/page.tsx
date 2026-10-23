import { requireUser } from "../_components/guard";
import { NominaManager, type PagoUI } from "./nomina-manager";
import type { EmpleadoUI } from "../empleados/empleados-manager";

export const dynamic = "force-dynamic";

export default async function AdminNominaPage() {
  const { supabase } = await requireUser();

  const [pagosRes, empleadosRes] = await Promise.all([
    supabase
      .from("nomina_pagos")
      .select("id, empleado_id, monto, fecha, periodo, metodo, notas, empleados(nombre)")
      .order("fecha", { ascending: false })
      .limit(300),
    supabase.from("empleados").select("id, nombre, cargo, email, telefono, salario_base, ingreso, estado, notas"),
  ]);

  const pagosError = pagosRes.error && /does not exist/i.test(pagosRes.error.message);
  const empleadosError = empleadosRes.error && /does not exist/i.test(empleadosRes.error.message);

  const pagos: PagoUI[] = (pagosRes.data ?? []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    empleado_id: p.empleado_id as string,
    monto: p.monto as number,
    fecha: p.fecha as string,
    periodo: (p.periodo as string) ?? null,
    metodo: (p.metodo as string) ?? null,
    notas: (p.notas as string) ?? null,
    empleado_nombre: (p.empleados as { nombre: string } | null)?.nombre ?? null,
  }));

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <NominaManager
      pagos={pagos}
      empleados={(empleadosRes.data ?? []) as EmpleadoUI[]}
      needsSetup={!!pagosError || !!empleadosError}
      hoy={hoy}
    />
  );
}
