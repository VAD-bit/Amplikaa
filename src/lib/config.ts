export const BRAND = {
  name: "AMPLIKAA",
  tagline: ["Digital Ecosystems", "Production", "Development"],
  claim: "High-End Brand Agency",
  location: "Maracay, Venezuela",
  year: 2026,
} as const;

export const CONTACT = {
  whatsapp: "584124633371",
  whatsappDisplay: "+58 0412 4633371",
} as const;

export const PAYMENTS = ["Pago Móvil (Venezuela)", "Binance / USDT", "Efectivo"] as const;

export const PRICING_NOTE =
  "Precios en USD. En Venezuela puedes abonar en Bs a tasa del día: Pago Móvil, USDT (Binance) o efectivo.";

export function waLink(text: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const WA_DEFAULT = waLink(
  "Hola AMPLIKAA, vengo de su página web y quiero información."
);

export const NAV_LINKS = [
  { href: "/#trabajos", label: "Portafolio" },
  { href: "/#clientes", label: "Clientes" },
  { href: "/#equipo", label: "Equipo" },
  { href: "/#planes", label: "Planes" },
  { href: "/#contacto", label: "Contacto" },
] as const;

export const METRICS = [
  { target: 150, suffix: "+", label: "Proyectos" },
  { target: 40, suffix: "+", label: "Marcas" },
  { target: 98, suffix: "%", label: "Retención" },
  { target: 24, suffix: "h", prefix: "<", label: "Respuesta" },
] as const;

export const SECTORS = [
  "SaaS",
  "E-Commerce",
  "Gastronomía",
  "Retail",
  "Fintech",
  "Salud",
  "Startups",
  "Educación",
  "Inmobiliaria",
  "Cultura & Música",
] as const;

export type ServiceIcon =
  | "globe"
  | "video"
  | "code"
  | "palette"
  | "trending"
  | "message";

export const SERVICES = [
  {
    index: "01",
    title: "Ecosistemas Digitales",
    desc: "Sitios, landings y e-commerce diseñados para convertir. Arquitectura, UX y performance en un solo sistema.",
    tags: ["Web", "E-Commerce", "CRO"],
    icon: "globe" as ServiceIcon,
    accent: "elec",
  },
  {
    index: "02",
    title: "Producción Audiovisual",
    desc: "Foto, video y reels con dirección de arte propia. Contenido que se siente premium y rinde en cada formato.",
    tags: ["Foto", "Reels", "Branded"],
    icon: "video" as ServiceIcon,
    accent: "elec",
  },
  {
    index: "03",
    title: "Desarrollo a Medida",
    desc: "Web apps, portales e integraciones. Cuando la plantilla no alcanza, lo construimos.",
    tags: ["Apps", "APIs", "Automatización"],
    icon: "code" as ServiceIcon,
    accent: "elec",
  },
  {
    index: "04",
    title: "Branding & Diseño",
    desc: "Identidad, design systems y piezas que sostienen la marca en todos los puntos de contacto.",
    tags: ["Identidad", "Design System", "Editorial"],
    icon: "palette" as ServiceIcon,
    accent: "viol",
  },
  {
    index: "05",
    title: "Performance & CRO",
    desc: "Pauta en Meta y Google con foco en ROI. Tests, embudos y reporting claro, sin humo.",
    tags: ["Meta Ads", "Google Ads", "Analytics"],
    icon: "trending" as ServiceIcon,
    accent: "viol",
  },
  {
    index: "06",
    title: "Social & Contenido",
    desc: "Estrategia, calendario y gestión de comunidades. Presencia constante con línea gráfica propia.",
    tags: ["Estrategia", "Gestión", "Community"],
    icon: "message" as ServiceIcon,
    accent: "viol",
  },
] as const;

export type WorkCat = "web" | "branding" | "produccion" | "social";
export type WorkType = "image" | "video";

export interface Work {
  id: number;
  title: string;
  cat: WorkCat;
  type: WorkType;
  c1: string;
  c2: string;
  url: string | null;
  video?: string;
  thumb?: string;
}

export const WORK_CATS: { key: WorkCat | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "web", label: "Sitios Web" },
  { key: "branding", label: "Branding" },
  { key: "produccion", label: "Producción" },
  { key: "social", label: "Social" },
];

export const WORK_CAT_LABELS: Record<WorkCat, string> = {
  web: "Sitio Web",
  branding: "Branding",
  produccion: "Producción",
  social: "Social",
};

export const WORKS: Work[] = [
  { id: 1, title: "Nova — SaaS Analytics", cat: "web", type: "image", c1: "#B9E3EC", c2: "#B9C9F2", url: "https://example.com/nova" },
  { id: 2, title: "Cacao Real — Branding", cat: "branding", type: "image", c1: "#F4BDB4", c2: "#F6EBB2", url: null },
  { id: 3, title: "Hotel Ávila — Reservas", cat: "web", type: "video", c1: "#B9C9F2", c2: "#B9E3EC", url: "https://example.com/avila", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { id: 4, title: "Ritmo Urbano — Social", cat: "social", type: "image", c1: "#F6EBB2", c2: "#C3E8CF", url: null },
  { id: 5, title: "Finora — Fintech Web", cat: "web", type: "image", c1: "#B9E3EC", c2: "#C3E8CF", url: "https://example.com/finora" },
  { id: 6, title: "Clínica Vitalis — Ident.", cat: "branding", type: "image", c1: "#C3E8CF", c2: "#B9E3EC", url: null },
  { id: 7, title: "Lumen — Reel 2026", cat: "produccion", type: "video", c1: "#B9C9F2", c2: "#F4BDB4", url: null, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: 8, title: "Andes Retail — Campaña", cat: "social", type: "image", c1: "#F4BDB4", c2: "#B9C9F2", url: null },
  { id: 9, title: "MetroLab — Portal", cat: "web", type: "image", c1: "#B9E3EC", c2: "#B9C9F2", url: "https://example.com/metrolab" },
];

export const PROCESS = [
  { n: "01", title: "Descubrimiento", desc: "Auditoría de marca, mercado y competencia. Definimos objetivos y métricas de éxito.", accent: "elec" },
  { n: "02", title: "Estrategia", desc: "Ruta de contenido, arquitectura digital y plan de medios. Todo documentado.", accent: "elec" },
  { n: "03", title: "Producción", desc: "Diseño, desarrollo y grabación en sprints semanales con entregas visibles.", accent: "viol" },
  { n: "04", title: "Lanzamiento & Escala", desc: "Publicación, medición y optimización continua. Iteramos con datos, no con opiniones.", accent: "viol" },
] as const;

export interface Plan {
  key: string;
  label: string;
  planNo: string;
  price: number;
  desc: string;
  features: string[];
  featured?: boolean;
  servicio: string;
  presupuesto: string;
}

export const PLANS: Plan[] = [
  {
    key: "impulso",
    label: "Impulso",
    planNo: "Plan 01",
    price: 65,
    desc: "Para marcas que quieren presencia seria cada semana, sin arrancar un sistema completo.",
    features: [
      "12 piezas de contenido semanales",
      "Gestión de 1 red social",
      "Calendario editorial semanal",
      "Reporte mensual de métricas",
    ],
    servicio: "Plan: Impulso",
    presupuesto: "$100 – $300",
  },
  {
    key: "crecimiento",
    label: "Crecimiento",
    planNo: "Plan 02",
    price: 90,
    desc: "Contenido y comunidad creciendo juntos todas las semanas.",
    features: [
      "Todo lo de Impulso",
      "18 piezas semanales (incluye 1 ad)",
      "Gestión de 2 redes sociales",
      "Reporte quincenal + call de seguimiento",
    ],
    featured: true,
    servicio: "Plan: Crecimiento",
    presupuesto: "$300 – $700",
  },
  {
    key: "ecosistema",
    label: "Ecosistema",
    planNo: "Plan 03",
    price: 100,
    desc: "Partner digital completo: marketing, pauta y web siempre al día.",
    features: [
      "Todo lo de Crecimiento",
      "Gestión de pauta Meta/Google",
      "Desarrollo & Mantenimiento de tu web (actualizaciones y backups)",
      "Soporte prioritario por WhatsApp",
    ],
    servicio: "Plan: Ecosistema",
    presupuesto: "$300 – $700",
  },
];

export const TESTIMONIALS = [
  {
    name: "María González",
    role: "Fundadora, Cacao Real",
    rating: 5,
    quote:
      "AMPLIKAA entendió nuestra marca desde el primer call. El e-commerce que nos armaron duplicó los pedidos en dos meses.",
  },
  {
    name: "Andrés Rivas",
    role: "CEO, Finora",
    rating: 5,
    quote:
      "Profesionales y rápidos. La web y la pauta trabajan juntas: bajamos el costo por lead un 40%.",
  },
  {
    name: "Laura Mendoza",
    role: "Directora, Clínica Vitalis",
    rating: 5,
    quote:
      "El sistema de reservas nos quitó el caos del WhatsApp. La agenda se llena sola y el equipo respira mejor.",
  },
];

export const FAQS = [
  {
    q: "¿Cuánto tarda un proyecto de website?",
    a: "Una landing se entrega en 1–2 semanas; un sitio completo con tienda o reservas toma 3–6 semanas según complejidad. Usa el Studio y te damos un cronograma estimado al instante.",
  },
  {
    q: "¿Cómo es el proceso de contratación?",
    a: "Completas el Studio o nos escribes, agendamos un call de diagnóstico, enviamos propuesta con alcance y precio, y arrancamos con una señal del 50%. Los planes semanales se abonan por adelantado y los proyectos se dividen por fases.",
  },
  {
    q: "¿En qué moneda y métodos de pago trabajan?",
    a: "Presupuestos en USD y abonos en Bs a tasa del día. Aceptamos Pago Móvil, Binance/USDT y efectivo (coordinando entrega). El plan semanal se cobra por adelantado; los proyectos únicos se dividen por fases.",
  },
  {
    q: "¿El sitio queda a mi nombre?",
    a: "Sí. Dominio, hosting y código se entregan a tu nombre. Te capacitamos para editar contenidos y te dejamos los accesos completos al lanzar.",
  },
  {
    q: "¿Trabajan con marcas fuera de Venezuela?",
    a: "Sí. Trabajamos de forma remota con clientes de todo el país y de Latinoamérica. La comunicación es por WhatsApp y calls programados.",
  },
  {
    q: "¿Ofrecen mantenimiento después del lanzamiento?",
    a: "Sí. Todos los planes incluyen garantía de bugs y podemos sumar un soporte mensual con actualizaciones, backups y optimización continua.",
  },
];

export const EDITION = {
  no: "Nº 026",
  volume: "Vol. IV",
  city: "Maracay, Venezuela",
  date: "Octubre 2026",
  price: "Entrada libre",
  kicker: "Edición especial · Agencia de marketing digital",
  index: ["Portafolio", "Clientes", "Equipo", "Planes"],
} as const;

export interface Client {
  id: number;
  name: string;
  sector: string;
  handle: string;
  service: string;
  since: string;
  result: string;
}

export function igProfile(handle: string) {
  return `https://www.instagram.com/${handle}/`;
}

export const CLIENTS: Client[] = [
  { id: 1, name: "Cliente confidencial", sector: "E-Commerce", handle: "", service: "Social + Performance", since: "2024", result: "Campañas activas" },
  { id: 2, name: "Cliente confidencial", sector: "Fintech", handle: "", service: "Web + Meta Ads", since: "2025", result: "Pauta activa con reporte quincenal" },
  { id: 3, name: "Cliente confidencial", sector: "Salud", handle: "", service: "Sistema de reservas + Branding", since: "2024", result: "Agenda gestionada sin caos de WhatsApp" },
  { id: 4, name: "Cliente confidencial", sector: "Cultura & Música", handle: "", service: "Social + Producción", since: "2025", result: "Producción mensual en curso" },
  { id: 5, name: "Cliente confidencial", sector: "Retail", handle: "", service: "Campañas Meta Ads", since: "2025", result: "Campañas de conversión activas" },
  { id: 6, name: "Cliente confidencial", sector: "Turismo", handle: "", service: "Web de reservas", since: "2026", result: "Reservas directas en operación" },
];

export interface Reel {
  id: number;
  client: string;
  handle: string;
  url: string;
  caption: string;
  tag: string;
}

export const REELS: Reel[] = [
  { id: 1, client: "Comercio Digital", handle: "amplikaa", url: "https://www.instagram.com/", caption: "Unboxing de temporada: la campaña que duplicó los pedidos.", tag: "Reel · Performance" },
  { id: 2, client: "Música y Eventos", handle: "amplikaa", url: "https://www.instagram.com/", caption: "Cobertura en vivo — más de 120K de alcance en 72 horas.", tag: "Reel · Producción" },
  { id: 3, client: "Servicios Financieros", handle: "amplikaa", url: "https://www.instagram.com/", caption: "Explicador de producto en 15 segundos para pauta en Meta.", tag: "Ad · Meta" },
  { id: 4, client: "Retail y Moda", handle: "amplikaa", url: "https://www.instagram.com/", caption: "Lookbook de lanzamiento con dirección de arte propia.", tag: "Reel · Social" },
  { id: 5, client: "Turismo y Hoteles", handle: "amplikaa", url: "https://www.instagram.com/", caption: "Tour cinematográfico de suite con reservas directas.", tag: "Reel · Turismo" },
];

export interface Member {
  name: string;
  role: string;
  photo?: string;
  note?: string;
  ceo?: boolean;
}

export const TEAM: Member[] = [
  {
    name: "Víctor Díaz",
    role: "CEO & Fundador",
    ceo: true,
    photo: "/equipo/victor.png",
    note: "Estrategia de marca, crecimiento y alianzas. Basado en Maracay, Venezuela.",
  },
];

export interface SystemPlan {
  key: string;
  label: string;
  planNo: string;
  price: number;
  desc: string;
  features: string[];
  entrega: string;
  featured?: boolean;
  servicio: string;
  presupuesto: string;
}

export const SYSTEM_PLANS: SystemPlan[] = [
  {
    key: "landing",
    label: "Landing Express",
    planNo: "Sistema 01",
    price: 500,
    desc: "Una página de alto contraste para lanzar, validar o pautar sin fricción.",
    features: ["Diseño a medida y copy CRO", "Formulario + WhatsApp", "SEO técnico básico + analytics", "Entrega en 1–2 semanas"],
    entrega: "1–2 semanas",
    servicio: "Sistema: Landing Express",
    presupuesto: "$300 – $700",
  },
  {
    key: "sitio",
    label: "Sitio Corporativo",
    planNo: "Sistema 02",
    price: 1250,
    desc: "Sitio multipágina con CMS para que publique usted mismo, sin código.",
    features: ["Hasta 8 páginas + blog", "CMS para editar contenidos", "SEO técnico y performance", "Integraciones (forms, CRM, analytics)", "Entrega en 3–4 semanas"],
    entrega: "3–4 semanas",
    featured: true,
    servicio: "Sistema: Sitio Corporativo",
    presupuesto: "$700 – $1,500",
  },
  {
    key: "sistema",
    label: "E-Commerce / Sistema",
    planNo: "Sistema 03",
    price: 2100,
    desc: "Tienda o sistema a medida: pagos, panel de administración y flujos propios.",
    features: ["Tienda o app web a medida", "Pagos y envíos integrados", "Panel de administración", "Integraciones con APIs", "Entrega en 6–10 semanas"],
    entrega: "6–10 semanas",
    servicio: "Sistema: E-Commerce / Sistema",
    presupuesto: "$1,500 – $3,000",
  },
];

