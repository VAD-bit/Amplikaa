import type { Etapa, EstadoCliente, Salud } from "./types";

export const ETAPA_CHIP: Record<Etapa, string> = {
  nuevo: "bg-sky",
  contactado: "bg-viol",
  propuesta: "bg-white text-paper",
  ganado: "bg-mint",
  perdido: "bg-elec",
};

export const ETAPA_TONE: Record<Etapa, string> = {
  nuevo: "text-sky",
  contactado: "text-viol",
  propuesta: "text-sky",
  ganado: "text-mint",
  perdido: "text-elec",
};

export const ETAPA_ACCENT: Record<Etapa, string> = {
  nuevo: "border-l-sky",
  contactado: "border-l-viol",
  propuesta: "border-l-sky",
  ganado: "border-l-mint",
  perdido: "border-l-elec",
};

export const ESTADO_CHIP: Record<EstadoCliente, string> = {
  activo: "bg-sky",
  pausado: "bg-naranja",
  cerrado: "bg-elec",
};

export const SALUD_DOT: Record<Salud, string> = {
  verde: "bg-mint",
  amarillo: "bg-naranja",
  rojo: "bg-elec",
};
