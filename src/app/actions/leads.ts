"use server";

import { leadSchema, type LeadInput } from "@/lib/schemas";
import { getSupabaseServer } from "@/lib/supabase/server";

export interface LeadState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof LeadInput, string>>;
}

export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  const raw = {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp") ?? "",
    empresa: formData.get("empresa") ?? "",
    servicio: formData.get("servicio"),
    presupuesto: formData.get("presupuesto") ?? "",
    mensaje: formData.get("mensaje"),
  };

  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Partial<Record<keyof LeadInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors };
  }

  const supabase = await getSupabaseServer();

  if (!supabase) {
    return {
      status: "error",
      message:
        "Supabase no está configurado. Copia .env.example a .env.local con tus claves y reinicia el servidor.",
    };
  }

  const { error } = await supabase.from("leads").insert({
    nombre: parsed.data.nombre,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp || null,
    empresa: parsed.data.empresa || null,
    servicio: parsed.data.servicio,
    presupuesto: parsed.data.presupuesto || null,
    mensaje: parsed.data.mensaje,
    source: "landing-contacto",
  });

  if (error) {
    console.error("[leads insert]", error.message);
    return {
      status: "error",
      message: "No pudimos guardar tu solicitud. Escríbenos por WhatsApp.",
    };
  }

  return {
    status: "success",
    message: "Solicitud recibida. Te contactamos en menos de 24 h.",
  };
}
