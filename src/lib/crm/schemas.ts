import { z } from "zod";
import { CICLOS, ETAPAS, ESTADOS_CLIENTE, PRIORIDADES, SALUDES, TIPOS_TAREA } from "./types";

export const loginSchema = z.object({
  email: z.string().trim().email("Email inválido."),
  password: z.string().min(6, "Mínimo 6 caracteres."),
});

export const updateEtapaSchema = z.object({
  id: z.string().uuid(),
  etapa: z.enum(ETAPAS),
});

export const noteSchema = z.object({
  texto: z.string().trim().min(2, "La nota está muy corta.").max(2000, "Máx. 2000 caracteres."),
  lead_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
});

export const clientSchema = z.object({
  nombre: z.string().trim().min(2, "Indica el nombre del cliente."),
  empresa: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().email("Email inválido.").or(z.literal("")),
  plan: z.string().trim().min(1, "Indica el plan."),
  ciclo: z.enum(CICLOS),
  precio: z.coerce.number().min(0, "Precio no válido."),
  inicio: z.string().optional(),
  proxima_cobro: z.string().optional(),
  salud: z.enum(SALUDES),
  estado: z.enum(ESTADOS_CLIENTE),
  notas: z.string().trim().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

export const clientPatchSchema = z.object({
  id: z.string().uuid(),
  salud: z.enum(SALUDES).optional(),
  estado: z.enum(ESTADOS_CLIENTE).optional(),
  proxima_cobro: z.string().optional(),
});

export const taskSchema = z.object({
  client_id: z.string().uuid(),
  titulo: z.string().trim().min(2, "Escribe la tarea."),
  tipo: z.enum(TIPOS_TAREA),
  prioridad: z.enum(PRIORIDADES),
  vence: z.string().optional(),
});
