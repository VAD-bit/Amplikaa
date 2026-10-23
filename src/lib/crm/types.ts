export const ETAPAS = ["nuevo", "contactado", "propuesta", "ganado", "perdido"] as const;
export type Etapa = (typeof ETAPAS)[number];

export const ETAPA_LABELS: Record<Etapa, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  propuesta: "Propuesta",
  ganado: "Ganado",
  perdido: "Perdido",
};

export const SALUDES = ["verde", "amarillo", "rojo"] as const;
export type Salud = (typeof SALUDES)[number];

export const SALUD_LABELS: Record<Salud, string> = {
  verde: "Verde",
  amarillo: "Amarillo",
  rojo: "Rojo",
};

export const ESTADOS_CLIENTE = ["activo", "pausado", "cerrado"] as const;
export type EstadoCliente = (typeof ESTADOS_CLIENTE)[number];

export const CICLOS = ["semanal", "mensual", "proyecto"] as const;
export type Ciclo = (typeof CICLOS)[number];

export const TIPOS_TAREA = ["onboarding", "entrega", "renovacion", "seguimiento", "general"] as const;
export type TipoTarea = (typeof TIPOS_TAREA)[number];

export const PRIORIDADES = ["alta", "media", "baja"] as const;
export type Prioridad = (typeof PRIORIDADES)[number];

export interface LeadRow {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  etapa: Etapa;
  source: string | null;
  nombre: string;
  email: string;
  whatsapp: string | null;
  empresa: string | null;
  servicio: string;
  presupuesto: string | null;
  mensaje: string;
}

export interface ClientRow {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  empresa: string | null;
  whatsapp: string | null;
  email: string | null;
  plan: string;
  ciclo: Ciclo;
  precio: number;
  inicio: string | null;
  proxima_cobro: string | null;
  salud: Salud;
  estado: EstadoCliente;
  lead_id: string | null;
}

export interface TaskRow {
  id: string;
  created_at: string;
  completed_at: string | null;
  client_id: string;
  titulo: string;
  tipo: TipoTarea;
  prioridad: Prioridad;
  vence: string | null;
}

export interface NoteRow {
  id: string;
  created_at: string;
  lead_id: string | null;
  client_id: string | null;
  texto: string;
}

export function isEtapa(v: string): v is Etapa {
  return (ETAPAS as readonly string[]).includes(v);
}
