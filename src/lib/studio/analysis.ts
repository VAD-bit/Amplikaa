export interface BlockDef {
  label: string;
  weight: number;
  blurb: string;
  plan: string[];
}

export const BLOCKS: Record<string, BlockDef> = {
  nav: { label: "Header / Navegación", weight: 2, blurb: "Logo, menú y CTA principal", plan: ["Maquetar header responsive", "Menú móvil accesible", "Estado scrolled + CTA"] },
  hero: { label: "Hero principal", weight: 3, blurb: "Titular, propuesta de valor y CTA", plan: ["Definir copy de hero", "Maquetar 2 variantes", "Optimizar mobile-first"] },
  servicios: { label: "Servicios / Productos", weight: 3, blurb: "Grid de tarjetas con detalle", plan: ["Estructura de servicios", "Tarjetas con estados hover", "Enlaces a detalle"] },
  galeria: { label: "Galería de imágenes", weight: 4, blurb: "Grid visual con lightbox", plan: ["Optimizar imágenes (WebP)", "Grid responsive", "Lightbox accesible"] },
  portafolio: { label: "Portafolio filtrable", weight: 5, blurb: "Casos con filtros y detalle", plan: ["Modelo de datos de casos", "Filtros por categoría", "Vista detalle / modal"] },
  tienda: { label: "Tienda / Catálogo", weight: 12, blurb: "Productos, carrito y checkout", plan: ["Modelo de catálogo", "Fichas de producto", "Carrito de compras", "Checkout y confirmación", "Gestión de stock básica"] },
  pagos: { label: "Pasarela de pagos", weight: 10, blurb: "Pago móvil, tarjeta o PayPal", plan: ["Integración pasarela (Stripe/PayPal)", "Flujo Pago Móvil local", "Recibos y notificaciones", "Manejo de errores de pago"] },
  reservas: { label: "Reservas / Citas", weight: 12, blurb: "Calendario con disponibilidad", plan: ["Definir reglas de disponibilidad", "Calendario interactivo", "Confirmaciones por email/WPP", "Panel de gestión de citas"] },
  blog: { label: "Blog / Noticias", weight: 6, blurb: "Artículos con CMS ligero", plan: ["Modelo de artículos", "Editor / carga de contenido", "Listado + paginación", "SEO por artículo"] },
  panel: { label: "Panel de usuario", weight: 15, blurb: "Login y dashboard privado", plan: ["Autenticación y roles", "Dashboard principal", "CRUD de recursos privados", "Recuperación de contraseña", "Permisos y seguridad"] },
  multi: { label: "Multi-idioma", weight: 8, blurb: "ES / EN u otro idioma", plan: ["Arquitectura de traducciones", "Selector de idioma", "Traducción de contenidos clave", "SEO hreflang"] },
  crm: { label: "CRM / Email marketing", weight: 7, blurb: "Integración con Mailchimp/HubSpot", plan: ["Conectar API de CRM", "Sincronizar leads", "Automatizaciones básicas", "Pruebas de entrega"] },
  chat: { label: "Chat / WhatsApp", weight: 3, blurb: "Widget de atención inmediata", plan: ["Widget flotante", "Mensajes predefinidos", "Horario de atención"] },
  testimonios: { label: "Testimonios", weight: 2, blurb: "Prueba social de clientes", plan: ["Carrusel de testimonios", "Diseño de tarjetas"] },
  precios: { label: "Tabla de precios", weight: 3, blurb: "Planes y paquetes", plan: ["Estructura de planes", "Diseño comparativo", "CTA por plan"] },
  faq: { label: "FAQ", weight: 2, blurb: "Preguntas frecuentes", plan: ["Recopilar preguntas", "Acordeón accesible"] },
  mapa: { label: "Mapa / Ubicación", weight: 2, blurb: "Google Maps embebido", plan: ["Integrar mapa", "Datos de contacto"] },
  contacto: { label: "Formulario de contacto", weight: 3, blurb: "Captura de leads validada", plan: ["Diseñar formulario", "Validación en cliente", "Notificación por email/WPP", "Protección anti-spam"] },
  newsletter: { label: "Newsletter", weight: 4, blurb: "Captura de suscriptores", plan: ["Formulario de suscripción", "Integración con email service", "Página de gracias"] },
  eventos: { label: "Agenda de eventos", weight: 6, blurb: "Calendario público de eventos", plan: ["Modelo de eventos", "Vista calendario/lista", "Inscripción a eventos"] },
  membresias: { label: "Membresías", weight: 14, blurb: "Suscripciones y contenido premium", plan: ["Sistema de planes de membresía", "Pagos recurrentes", "Contenido restringido", "Gestión de cancelaciones"] },
  custom: { label: "Función personalizada", weight: 10, blurb: "Algo no está en la lista", plan: ["Specification de la función", "Prototipo técnico", "Implementación", "Pruebas unitarias"] },
};

export const BUDGET_LABELS: Record<string, { label: string; mid: number }> = {
  "0-300": { label: "Menos de $300", mid: 200 },
  "300-700": { label: "$300 – $700", mid: 500 },
  "700-1500": { label: "$700 – $1,500", mid: 1100 },
  "1500-3000": { label: "$1,500 – $3,000", mid: 2250 },
  "3000-5000": { label: "$3,000 – $5,000", mid: 4000 },
  "5000-99999": { label: "$5,000 o más", mid: 7500 },
};

export const PLAZO_LABELS: Record<string, string> = {
  "1-2": "1 – 2 semanas (express)",
  "2-4": "2 – 4 semanas",
  "4-8": "1 – 2 meses",
  "8+": "2+ meses",
  "": "Sin fecha fija",
};

export const EXTRA_LABELS: Record<string, string> = {
  seo: "SEO técnico",
  analytics: "Analítica & embudos",
  custom: "Diseño 100% custom",
  anim: "Animaciones avanzadas",
  hosting: "Hosting + dominio",
  soporte: "Soporte 3 meses",
};

export const EXTRA_WEIGHTS: Record<string, number> = {
  seo: 3,
  analytics: 2,
  custom: 6,
  anim: 5,
  hosting: 1,
  soporte: 2,
};

export const STUDIO = {
  rateHour: 25,
  hoursPerPoint: 1.5,
  baseHours: 8,
  teamWeekHours: 32,
  marginTarget: 1.35,
};

export interface StudioAnalysisInput {
  blocks: { key: string; note?: string }[];
  extras: string[];
  budget: string;
  plazo: string;
}

export interface Factor {
  label: string;
  weight: number;
  note?: string;
}

export interface Phase {
  n: string;
  name: string;
  weeks: number;
  tasks: string[];
  deliver: string;
}

export interface Risk {
  sev: "Alta" | "Media" | "Baja";
  txt: string;
}

export interface StudioAnalysis {
  factors: Factor[];
  score: number;
  level: "Baja" | "Media" | "Alta" | "Extrema";
  levelColor: string;
  levelNote: string;
  hours: number;
  cost: number;
  suggested: number;
  budgetLabel: string;
  budgetMid: number;
  ratio: number;
  verdict: "RENTABLE" | "AJUSTADO" | "NO RENTABLE";
  verdictColor: string;
  verdictNote: string;
  recommendation: string;
  phases: Phase[];
  totalWeeks: number;
  risks: Risk[];
}

export function computeAnalysis(input: StudioAnalysisInput): StudioAnalysis {
  const factors: Factor[] = input.blocks.map((b) => ({
    label: BLOCKS[b.key]?.label ?? b.key,
    weight: BLOCKS[b.key]?.weight ?? 5,
    note: b.note || undefined,
  }));

  for (const k of input.extras) {
    factors.push({
      label: `Extra: ${EXTRA_LABELS[k] ?? k}`,
      weight: EXTRA_WEIGHTS[k] ?? 0,
    });
  }

  const score = Math.max(
    factors.reduce((s, f) => s + f.weight, 0),
    1
  );

  let level: StudioAnalysis["level"];
  let levelColor: string;
  let levelNote: string;
  if (score < 15) {
    level = "Baja";
    levelColor = "#34d399";
    levelNote =
      "Estructura tipo landing/micro-site. Puede entregarse en una sola fase de desarrollo.";
  } else if (score < 35) {
    level = "Media";
    levelColor = "#00F0FF";
    levelNote =
      "Sitio completo con módulos interactivos. Requiere diseño por secciones y pruebas moderadas.";
  } else if (score < 60) {
    level = "Alta";
    levelColor = "#f59e0b";
    levelNote =
      "Producto web con lógica de negocio (comercio, reservas o panel). Conviene dividir en sprints y prototipar flujos críticos.";
  } else {
    level = "Extrema";
    levelColor = "#f87171";
    levelNote =
      "Sistema a medida tipo plataforma. Se recomienda discovery pagado, arquitectura dedicada y despliegue por fases.";
  }

  const hours = Math.round(STUDIO.baseHours + score * STUDIO.hoursPerPoint);
  const cost = Math.round(hours * STUDIO.rateHour);
  const suggested = Math.round((cost * STUDIO.marginTarget) / 10) * 10;
  const budget = BUDGET_LABELS[input.budget] ?? { label: "—", mid: 0 };
  const ratio = budget.mid / Math.max(cost, 1);

  let verdict: StudioAnalysis["verdict"];
  let verdictColor: string;
  let verdictNote: string;
  let recommendation: string;

  if (ratio >= 1.25) {
    verdict = "RENTABLE";
    verdictColor = "#34d399";
    verdictNote = `El presupuesto del cliente (${budget.label}) supera el costo estimado ($${cost}). Margen sano; el encargo es atractivo y puede priorizarse.`;
    recommendation = `Presentar propuesta formal con precio de $${suggested} (o el rango $${cost}–$${suggested}). Señal del 50% para iniciar.`;
  } else if (ratio >= 0.75) {
    verdict = "AJUSTADO";
    verdictColor = "#f59e0b";
    verdictNote = `El presupuesto (${budget.label}) se acerca al costo estimado ($${cost}). Viable si se ajusta alcance (quitar 1-2 bloques) o se negocia pago por fases.`;
    recommendation = `Ofrecer $${suggested} como lista y aceptar hasta $${Math.round(cost * 1.05)} con pago en 2 quincenas. Proponer quitar bloques de bajo peso si pide bajar precio.`;
  } else {
    verdict = "NO RENTABLE";
    verdictColor = "#f87171";
    verdictNote = `El presupuesto (${budget.label}) no cubre el costo estimado ($${cost}). Recomendación: ofrecer una versión reducida (MVP) o escalonar el proyecto en fases con presupuesto separado.`;
    recommendation = `No presentar propuesta completa. Ofrecer MVP por $${Math.max(budget.mid, Math.round(cost * 0.6))} con los bloques esenciales y dejar el resto como Fase 2 con presupuesto aparte.`;
  }

  const devWeeks = Math.max(1, Math.round(hours / STUDIO.teamWeekHours));
  const designWeeks = score >= 35 ? 2 : 1;
  const qaWeeks = score >= 35 ? 1.5 : 1;
  const isExpress = input.plazo === "1-2";

  const phase: Phase[] = [
    {
      n: "01",
      name: "Descubrimiento & Alcance",
      weeks: 1,
      tasks: [
        "Kick-off con cliente (call 45 min)",
        "Revisar esquema visual y nota del cliente",
        "Definir contenidos faltantes (textos, fotos)",
        "Congelar alcance y cronograma",
      ],
      deliver: "Documento de alcance + cronograma",
    },
    {
      n: "02",
      name: "Diseño UI/UX",
      weeks: designWeeks,
      tasks: [
        "Wireframe del esquema enviado",
        "Design system (colores, tipografías, componentes)",
        "Diseño desktop + mobile de páginas clave",
        "Ronda de ajustes (2 incluidas)",
      ],
      deliver: "Figma con diseño aprobado",
    },
    {
      n: "03",
      name: "Contenido & SEO base",
      weeks: 1,
      tasks: [
        "Redacción de copy por sección",
        "Optimización de imágenes (WebP)",
        "Etiquetas SEO y metadatos",
        `Preparar textos de bloques: ${input.blocks
          .slice(0, 4)
          .map((b) => BLOCKS[b.key]?.label ?? b.key)
          .join(", ")}${input.blocks.length > 4 ? "…" : ""}`,
      ],
      deliver: "Contenido listo para maquetar",
    },
    {
      n: "04",
      name: "Desarrollo",
      weeks: devWeeks,
      tasks: [
        ...input.blocks.map((b) => `Módulo: ${BLOCKS[b.key]?.label ?? b.key}`),
        ...input.extras
          .filter((k) => ["seo", "analytics", "hosting", "soporte"].includes(k))
          .map((k) => `Extra: ${EXTRA_LABELS[k] ?? k}`),
        "Integración entre módulos y navegación",
        "Versionado en staging para revisión del cliente",
      ],
      deliver: "Sitio funcional en staging",
    },
    {
      n: "05",
      name: "QA & Garantía",
      weeks: qaWeeks,
      tasks: [
        "Pruebas en 375 / 768 / 1024 / 1440 px",
        "Pruebas de formularios, pagos y flujos críticos",
        "Accesibilidad básica y contraste",
        "Corrección de bugs priorizados",
      ],
      deliver: "Checklist de QA firmado",
    },
    {
      n: "06",
      name: "Lanzamiento & Handoff",
      weeks: 0.5,
      tasks: [
        "Deploy a producción + dominio",
        "Configurar analytics y Search Console",
        "Capacitación de uso (video o call)",
        "Entrega de accesos y código",
      ],
      deliver: "Sitio en vivo + capacitación",
    },
  ];

  if (isExpress) {
    for (const p of phase) {
      p.weeks = Math.max(0.5, Math.round(p.weeks * 0.6 * 10) / 10);
      p.tasks.push("Modo express: entregas parciales cada 48 h");
    }
  }

  const risks: Risk[] = [];
  const keys = input.blocks.map((b) => b.key);
  if (keys.includes("pagos"))
    risks.push({ sev: "Alta", txt: "Pasarela de pagos: requiere cuentas comerciales del cliente y pruebas con montos reales pequeños." });
  if (keys.includes("panel"))
    risks.push({ sev: "Alta", txt: "Panel de usuario: la seguridad (roles, contraseñas) puede duplicar tiempos si no se define alcance mínimo." });
  if (keys.includes("reservas"))
    risks.push({ sev: "Media", txt: "Reservas: las reglas de disponibilidad suelen ser ambiguas; validar con 3 escenarios reales antes de desarrollar." });
  if (keys.includes("membresias"))
    risks.push({ sev: "Alta", txt: "Membresías: cobros recurrentes requieren pasarela con soporte de suscripciones y política de reembolsos." });
  if (input.blocks.length > 10)
    risks.push({ sev: "Media", txt: "Alto número de bloques: riesgo de dispersión; sugerir priorización MoSCoW con el cliente." });
  if (budget.mid < cost * 0.75)
    risks.push({ sev: "Alta", txt: "Presupuesto por debajo del costo: alto riesgo de sobrecosto; formalizar cambios de alcance por escrito." });
  if (isExpress)
    risks.push({ sev: "Media", txt: "Plazo express: reducir rondas de feedback a 1 y exigir contenidos completos en la fase 1." });
  if (!risks.length)
    risks.push({ sev: "Baja", txt: "Sin riesgos críticos detectados. Proyecto de complejidad estándar." });

  const totalWeeks =
    Math.round((devWeeks + designWeeks + qaWeeks + 1) * 10) / 10;

  return {
    factors,
    score,
    level,
    levelColor,
    levelNote,
    hours,
    cost,
    suggested,
    budgetLabel: budget.label,
    budgetMid: budget.mid,
    ratio,
    verdict,
    verdictColor,
    verdictNote,
    recommendation,
    phases: phase,
    totalWeeks,
    risks,
  };
}
