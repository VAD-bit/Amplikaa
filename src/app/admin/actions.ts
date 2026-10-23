"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  clientPatchSchema,
  clientSchema,
  loginSchema,
  noteSchema,
  taskSchema,
  updateEtapaSchema,
} from "@/lib/crm/schemas";

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const IDLE: ActionState = { status: "idle" };

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

/* ---------------- Auth ---------------- */

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await getSupabaseServer();
  if (!supabase) return { status: "error", message: "Supabase no está configurado." };

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { status: "error", message: "Credenciales incorrectas." };

  redirect("/admin");
}

export async function logout() {
  const supabase = await getSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------------- CRM: leads ---------------- */

export async function updateLeadEtapa(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateEtapaSchema.safeParse({
    id: formData.get("id"),
    etapa: formData.get("etapa"),
  });
  if (!parsed.success) return { status: "error", message: "Etapa no válida." };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase
    .from("leads")
    .update({ etapa: parsed.data.etapa, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id);
  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { status: "success", message: "Etapa actualizada." };
}

/* ---------------- Notas ---------------- */

export async function addNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = noteSchema.safeParse({
    texto: formData.get("texto"),
    lead_id: formData.get("lead_id") || undefined,
    client_id: formData.get("client_id") || undefined,
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };
  if (!parsed.data.lead_id && !parsed.data.client_id)
    return { status: "error", message: "Nota sin destino." };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("notes").insert({
    texto: parsed.data.texto,
    lead_id: parsed.data.lead_id ?? null,
    client_id: parsed.data.client_id ?? null,
  });
  if (error) return { status: "error", message: error.message };

  revalidatePath(parsed.data.lead_id ? "/admin/leads" : "/admin/clientes");
  return { status: "success", message: "Nota guardada." };
}

/* ---------------- CSM: clientes ---------------- */

export async function createClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = clientSchema.safeParse({
    nombre: formData.get("nombre"),
    empresa: formData.get("empresa") || "",
    whatsapp: formData.get("whatsapp") || "",
    email: formData.get("email") || "",
    plan: formData.get("plan"),
    ciclo: formData.get("ciclo"),
    precio: formData.get("precio") || 0,
    inicio: formData.get("inicio") || "",
    proxima_cobro: formData.get("proxima_cobro") || "",
    salud: formData.get("salud") || "verde",
    estado: formData.get("estado") || "activo",
    notas: formData.get("notas") || "",
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { data, error } = await supabase
    .from("clients")
    .insert({
      nombre: parsed.data.nombre,
      empresa: parsed.data.empresa || null,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email || null,
      plan: parsed.data.plan,
      ciclo: parsed.data.ciclo,
      precio: parsed.data.precio,
      inicio: parsed.data.inicio || null,
      proxima_cobro: parsed.data.proxima_cobro || null,
      salud: parsed.data.salud,
      estado: parsed.data.estado,
    })
    .select("id")
    .single();
  if (error) return { status: "error", message: error.message };

  if (parsed.data.notas) {
    await supabase.from("notes").insert({ client_id: data.id, texto: parsed.data.notas });
  }

  revalidatePath("/admin/clientes");
  revalidatePath("/admin");
  redirect(`/admin/clientes/${data.id}`);
}

export async function patchClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = clientPatchSchema.safeParse({
    id: formData.get("id"),
    salud: formData.get("salud") || undefined,
    estado: formData.get("estado") || undefined,
    proxima_cobro: formData.get("proxima_cobro") || undefined,
  });
  if (!parsed.success) return { status: "error", message: "Datos no válidos." };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.salud) patch.salud = parsed.data.salud;
  if (parsed.data.estado) patch.estado = parsed.data.estado;
  if (parsed.data.proxima_cobro !== undefined) patch.proxima_cobro = parsed.data.proxima_cobro || null;

  const { error } = await supabase.from("clients").update(patch).eq("id", parsed.data.id);
  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/clientes");
  revalidatePath("/admin");
  return { status: "success", message: "Ficha actualizada." };
}

/* ---------------- CSM: tareas ---------------- */

export async function addTask(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = taskSchema.safeParse({
    client_id: formData.get("client_id"),
    titulo: formData.get("titulo"),
    tipo: formData.get("tipo") || "general",
    prioridad: formData.get("prioridad") || "media",
    vence: formData.get("vence") || "",
  });
  if (!parsed.success) return { status: "error", message: zodError(parsed.error) };

  const supabase = await requireSupabase();
  if (!supabase) return { status: "error", message: "Sesión expirada." };

  const { error } = await supabase.from("tasks").insert({
    client_id: parsed.data.client_id,
    titulo: parsed.data.titulo,
    tipo: parsed.data.tipo,
    prioridad: parsed.data.prioridad,
    vence: parsed.data.vence || null,
  });
  if (error) return { status: "error", message: error.message };

  revalidatePath(`/admin/clientes/${parsed.data.client_id}`);
  revalidatePath("/admin");
  return { status: "success", message: "Tarea agregada." };
}

export async function toggleTask(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await requireSupabase();
  if (!supabase) return;

  const { data } = await supabase
    .from("tasks")
    .select("completed_at, client_id")
    .eq("id", id)
    .single();
  if (!data) return;

  await supabase
    .from("tasks")
    .update({ completed_at: data.completed_at ? null : new Date().toISOString() })
    .eq("id", id);

  revalidatePath(`/admin/clientes/${data.client_id}`);
  revalidatePath("/admin");
}
