import { z } from "zod";

export const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Indica tu nombre."),
  email: z.string().trim().email("Email inválido."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,}$/, "Incluye tu WhatsApp con código de país.")
    .optional()
    .or(z.literal("")),
  empresa: z.string().trim().optional(),
  servicio: z.string().trim().min(1, "Selecciona un servicio."),
  presupuesto: z.string().trim().optional(),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mín. 10 caracteres)."),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const budgetRangeSchema = z.enum(
  ["0-300", "300-700", "700-1500", "1500-3000", "3000-5000", "5000-99999"],
  { errorMap: () => ({ message: "Selecciona un rango de presupuesto." }) }
);

export const plazoSchema = z.enum(["", "1-2", "2-4", "4-8", "8+"]);

export const studioBlockSchema = z.object({
  uid: z.number().int().positive(),
  key: z.string().min(1),
  note: z.string().max(500).default(""),
});

export const studioSchema = z.object({
  nombre: z.string().trim().min(2, "Indica tu nombre."),
  email: z.string().trim().email("Email inválido."),
  whatsapp: z.string().trim().optional(),
  empresa: z.string().trim().optional(),
  rubro: z
    .string()
    .trim()
    .min(20, "Describe tu rubro con más detalle (mín. 20 caracteres)."),
  publico: z.string().trim().optional(),
  nota: z
    .string()
    .trim()
    .min(40, "Explica tu idea con más detalle (mín. 40 caracteres)."),
  goals: z.array(z.string()).default([]),
  budget: budgetRangeSchema,
  budgetNote: z.string().trim().optional(),
  plazo: plazoSchema.default(""),
  extras: z.array(z.string()).default([]),
  blocks: z
    .array(studioBlockSchema)
    .min(3, "Agrega al menos 3 bloques para formar un esquema válido."),
});

export type StudioInput = z.infer<typeof studioSchema>;
