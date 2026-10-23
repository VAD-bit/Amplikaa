"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const METODOS = ["efectivo", "transferencia", "zelle", "paypal"] as const;
const CATEGORIAS = ["cliente", "pauta", "herramientas", "nomina", "operacion", "otros"] as const;

const planSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().trim().regex(/^[a-z0-9-]{2,40}$/, "Clave en minúsculas (a-z, 0-9, -)."),
  seccion: z.enum(["marketing", "sistemas"]),
  plan_no: z.string().trim().max(30).optional().default(""),
  label: z.string().trim().min(2, "Nombre muy corto.").max(60, "Máx. 60."),
  price: z.coerce.number().min(0, "Precio no válido."),
  desc: z.string().trim().max(400, "Máx. 400.").optional().default(""),
  features: z.string().max(4000).optional().default(""),
  entrega: z.string().trim().max(60).optional().default(""),
  servicio: z.string().trim().max(80).optional().default(""),
  presupuesto: z.string().trim().max(40).optional().default(""),
  posicion: z.coerce.number().int().min(0).max(99).optional().default(0),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
});

const empleadoSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().trim().min(2, "Nombre muy corto.").max(80),
  cargo: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email("Email inválido.").or(z.literal("")).optional().default(""),
  telefono: z.string().trim().max(40).optional().default(""),
  salario_base: z.coerce.number().min(0, "Salario no válido.").optional().default(0),
  ingreso: z.string().regex(ISO_DATE, "Fecha inválida.").or(z.literal("")).optional().default(""),
  estado: z.enum(["activo", "inactivo"]).optional().default("activo"),
  notas: z.string().trim().max(2000).optional().default(""),
});

const pagoSchema = z.object({
  empleado_id: z.string().uuid("Selecciona un empleado."),
  fecha: z.string().regex(ISO_DATE, "Fecha inválida."),
  periodo: z.string().trim().max(60).optional().default(""),
  monto: z.coerce.number().positive("Monto debe ser > 0."),
  metodo: z.enum(METODOS).optional().default("efectivo"),
  notas: z.string().trim().max(1000).optional().default(""),
});

const movSchema = z.object({
  fecha: z.string().regex(ISO_DATE, "Fecha inválida."),
  tipo: z.enum(["ingreso", "egreso"]),
  concepto: z.string().trim().min(3, "Concepto muy corto.").max(140),
  monto: z.coerce.number().positive("Monto debe ser > 0."),
  categoria: z.enum(CATEGORIAS).optional().default("otros"),
  notas: z.string().trim().max(1000).optional().default(""),
});

const uuidSchema = z.string().uuid();

function zodError(e: { issues: { path: (string | number)[]; message: string }[] }) {
  return e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ");
}

function lines(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

async function requireSupabase() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function dbHint(message: string) {
  return /does not exist/i.test(message)
    ? "Falta la base: aplica supabase/migrations/0004_planes_rrhh_finanzas.sql en Supabase → SQL Editor."
    : message;
}

function revalidatePlanes() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/planes");
}

/* ---------------- Planes ---------------- */

export async function savePlan(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const idRaw = formData.get("id");
  const parsed = planSchema.safeParse({
    id: typeof idRaw === "string" && idRaw ? idRaw : undefined,
    key: formData.get("key"),
    seccion: formData.get("seccion"),
    plan_no: formData.get("plan_no") || "",
    label: formData.get("label"),
    price: formData.get("price"),
    desc: formData.get("descripcion") || "",
    features: formData.get("features") || "",
    entrega: formData.get("entrega") || "",
    servicio: formData.get("servicio") || "",
    presupuesto: formData.get("presupuesto") || "",
    posicion: formData.get("posicion") || 0,
    featured: !!formData.get("featured"),
    visible: !!formData.get("visible"),
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { id, features, desc, ...rest } = parsed.data;
  const row = { ...rest, descripcion: desc, features: lines(features), updated_at: new Date().toISOString() };

  const { error } = id
    ? await supabase.from("planes").update(row).eq("id", id)
    : await supabase.from("planes").insert({ ...row, created_at: new Date().toISOString() });
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePlanes();
  return { status: "success", message: id ? "Plan actualizado." : "Plan creado." };
}

export async function deletePlan(formData: FormData) {
  const parsed = uuidSchema.safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("planes").delete().eq("id", parsed.data);
  revalidatePlanes();
}

/* ---------------- Empleados ---------------- */

export async function saveEmpleado(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const idRaw = formData.get("id");
  const parsed = empleadoSchema.safeParse({
    id: typeof idRaw === "string" && idRaw ? idRaw : undefined,
    nombre: formData.get("nombre"),
    cargo: formData.get("cargo") || "",
    email: formData.get("email") || "",
    telefono: formData.get("telefono") || "",
    salario_base: formData.get("salario_base") || 0,
    ingreso: formData.get("ingreso") || "",
    estado: formData.get("estado") || "activo",
    notas: formData.get("notas") || "",
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { id, ...rest } = parsed.data;
  const row = {
    ...rest,
    email: rest.email || null,
    telefono: rest.telefono || null,
    ingreso: rest.ingreso || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("empleados").update(row).eq("id", id)
    : await supabase.from("empleados").insert({ ...row, created_at: new Date().toISOString() });
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/empleados");
  revalidatePath("/admin/nomina");
  revalidatePath("/admin/metricas");
  return { status: "success", message: id ? "Empleado actualizado." : "Empleado agregado." };
}

export async function deleteEmpleado(formData: FormData) {
  const parsed = uuidSchema.safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("empleados").delete().eq("id", parsed.data);
  revalidatePath("/admin/empleados");
  revalidatePath("/admin/nomina");
}

/* ---------------- Nómina ---------------- */

export async function addPago(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = pagoSchema.safeParse({
    empleado_id: formData.get("empleado_id"),
    fecha: formData.get("fecha"),
    periodo: formData.get("periodo") || "",
    monto: formData.get("monto"),
    metodo: formData.get("metodo") || "efectivo",
    notas: formData.get("notas") || "",
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("nomina_pagos").insert(parsed.data);
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/nomina");
  revalidatePath("/admin/metricas");
  return { status: "success", message: "Pago registrado." };
}

export async function deletePago(formData: FormData) {
  const parsed = uuidSchema.safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("nomina_pagos").delete().eq("id", parsed.data);
  revalidatePath("/admin/nomina");
  revalidatePath("/admin/metricas");
}

/* ---------------- Finanzas ---------------- */

export async function addMov(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = movSchema.safeParse({
    fecha: formData.get("fecha"),
    tipo: formData.get("tipo"),
    concepto: formData.get("concepto"),
    monto: formData.get("monto"),
    categoria: formData.get("categoria") || "otros",
    notas: formData.get("notas") || "",
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("finanzas").insert(parsed.data);
  if (error) return { status: "error", message: dbHint(error.message) };

  revalidatePath("/admin/finanzas");
  revalidatePath("/admin/metricas");
  revalidatePath("/admin");
  return { status: "success", message: "Movimiento registrado." };
}

export async function deleteMov(formData: FormData) {
  const parsed = uuidSchema.safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  await supabase.from("finanzas").delete().eq("id", parsed.data);
  revalidatePath("/admin/finanzas");
  revalidatePath("/admin/metricas");
  revalidatePath("/admin");
}
