export const BRAND = {
  name: "AMPLIKAA",
  tagline: ["Digital Ecosystems", "Production", "Development"],
  claim: "High-End Brand Agency",
  location: "Caracas, Venezuela",
  year: 2026,
} as const;

export const CONTACT = {
  whatsapp: "584121234567",
  whatsappDisplay: "+58 412 123 4567",
  email: "hola@amplikaa.com",
} as const;

export function waLink(text: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const WA_DEFAULT = waLink(
  "Hola AMPLIKAA, vengo de su página web y quiero información."
);

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
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

// Reemplaza thumb con "/work/xxx.jpg" y url con el sitio real cuando tengas los assets.
export const WORKS: Work[] = [
  { id: 1, title: "Nova — SaaS Analytics", cat: "web", type: "image", c1: "#00F0FF", c2: "#7B2CBF", url: "https://example.com/nova" },
  { id: 2, title: "Cacao Real — Branding", cat: "branding", type: "image", c1: "#7B2CBF", c2: "#c084fc", url: null },
  { id: 3, title: "Hotel Ávila — Reservas", cat: "web", type: "video", c1: "#0ea5e9", c2: "#00F0FF", url: "https://example.com/avila", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { id: 4, title: "Ritmo Urbano — Social", cat: "social", type: "image", c1: "#f59e0b", c2: "#7B2CBF", url: null },
  { id: 5, title: "Finora — Fintech Web", cat: "web", type: "image", c1: "#22d3ee", c2: "#3b82f6", url: "https://example.com/finora" },
  { id: 6, title: "Clínica Vitalis — Ident.", cat: "branding", type: "image", c1: "#34d399", c2: "#00F0FF", url: null },
  { id: 7, title: "Lumen — Reel 2026", cat: "produccion", type: "video", c1: "#a78bfa", c2: "#00F0FF", url: null, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: 8, title: "Andes Retail — Campaña", cat: "social", type: "image", c1: "#fb7185", c2: "#7B2CBF", url: null },
  { id: 9, title: "MetroLab — Portal", cat: "web", type: "image", c1: "#00F0FF", c2: "#2563eb", url: "https://example.com/metrolab" },
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
    price: 149,
    desc: "Para marcas que están empezando a mostrar presencia seria.",
    features: [
      "8 piezas de contenido al mes",
      "Gestión de 2 redes sociales",
      "Calendario editorial mensual",
      "Reporte mensual de métricas",
    ],
    servicio: "Plan: Impulso",
    presupuesto: "$100 – $300",
  },
  {
    key: "crecimiento",
    label: "Crecimiento",
    planNo: "Plan 02",
    price: 349,
    desc: "El sistema completo: contenido, sitio y pauta trabajando juntos.",
    features: [
      "Todo lo de Impulso",
      "Producción audiovisual mensual",
      "Landing page de alta conversión",
      "Gestión de pauta (Meta/Google)",
      "Reporting quincenal + calls",
    ],
    featured: true,
    servicio: "Plan: Crecimiento",
    presupuesto: "$300 – $700",
  },
  {
    key: "ecosistema",
    label: "Ecosistema",
    planNo: "Plan 03",
    price: 790,
    desc: "Partner digital completo con desarrollo a medida incluido.",
    features: [
      "Todo lo de Crecimiento",
      "Sitio web o e-commerce a medida",
      "Branding / design system",
      "Soporte prioritario y SLA",
    ],
    servicio: "Plan: Ecosistema",
    presupuesto: "$700 – $1,500",
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
    a: "Completas el Studio o nos escribes, agendamos un call de diagnóstico, enviamos propuesta con alcance y precio, y arrancamos con una señal del 50%. Trabajamos por fases con entregas revisables.",
  },
  {
    q: "¿En qué moneda y métodos de pago trabajan?",
    a: "Presupuestos en USD. Aceptamos transferencia, Pago Móvil y transferencias internacionales. El plan mensual se cobra por adelantado; los proyectos únicos se dividen por fases.",
  },
  {
    q: "¿El sitio queda a mi nombre?",
    a: "Sí. Dominio, hosting y código se entregan a tu nombre. Te capacitamos para editar contenidos y te dejamos los accesos completos al lanzar.",
  },
  {
    q: "¿Trabajan con marcas fuera de Venezuela?",
    a: "Sí. Trabajamos de forma remota con clientes de Latinoamérica y Estados Unidos. La comunicación es por WhatsApp, email y calls programados.",
  },
  {
    q: "¿Ofrecen mantenimiento después del lanzamiento?",
    a: "Sí. Todos los planes incluyen garantía de bugs y podemos sumar un soporte mensual con actualizaciones, backups y optimización continua.",
  },
];
