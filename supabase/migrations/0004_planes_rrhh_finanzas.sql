-- ============================================================
-- AMPLIKAA — 0004: Planes editables, empleados, nómina y finanzas
-- Schema: amplikaa
-- ============================================================

-- ---------- 1) PLANES (tarifario editable desde el panel) ----------
create table if not exists amplikaa.planes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  key text not null unique,                     -- identificador estable (impulso, landing…)
  seccion text not null default 'marketing',    -- marketing | sistemas
  plan_no text not null default '',             -- "Plan 01" / "Sistema 01"
  label text not null,
  price numeric(10,2) not null default 0,
  descripcion text not null default '',
  features jsonb not null default '[]'::jsonb,  -- array de strings
  entrega text not null default '',             -- solo sistemas ("1–2 semanas")
  featured boolean not null default false,
  servicio text not null default '',            -- texto que va al formulario de contacto
  presupuesto text not null default '',
  posicion int not null default 0,
  visible boolean not null default true
);

comment on table amplikaa.planes is 'Tarifario de la landing; el panel lo edita en cualquier momento';

alter table amplikaa.planes enable row level security;

-- Lectura pública (la landing es anónima)
drop policy if exists "planes select public" on amplikaa.planes;
create policy "planes select public"
  on amplikaa.planes for select
  to anon, authenticated
  using (true);

-- Escritura solo desde el panel
drop policy if exists "planes write authenticated" on amplikaa.planes;
create policy "planes write authenticated"
  on amplikaa.planes for all
  to authenticated
  using (true)
  with check (true);

create index if not exists planes_seccion_pos_idx on amplikaa.planes (seccion, posicion);

-- ---------- 2) EMPLEADOS (control de personal) ----------
create table if not exists amplikaa.empleados (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null,
  cargo text not null default '',
  email text,
  telefono text,
  salario_base numeric(10,2) not null default 0,
  ingreso date,
  estado text not null default 'activo',         -- activo | inactivo
  notas text not null default ''
);

comment on table amplikaa.empleados is 'Nómina de personal de la agencia';

alter table amplikaa.empleados enable row level security;

drop policy if exists "empleados all authenticated" on amplikaa.empleados;
create policy "empleados all authenticated"
  on amplikaa.empleados for all
  to authenticated
  using (true)
  with check (true);

create index if not exists empleados_estado_idx on amplikaa.empleados (estado);

-- ---------- 3) NÓMINA (pagos a empleados) ----------
create table if not exists amplikaa.nomina_pagos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  empleado_id uuid not null references amplikaa.empleados (id) on delete cascade,
  fecha date not null default current_date,
  periodo text not null default '',              -- ej. "Oct 1 – Oct 15"
  monto numeric(10,2) not null check (monto >= 0),
  metodo text not null default 'efectivo',       -- efectivo | transferencia | zelle | paypal
  notas text not null default ''
);

comment on table amplikaa.nomina_pagos is 'Pagos de nómina realizados';

alter table amplikaa.nomina_pagos enable row level security;

drop policy if exists "nomina all authenticated" on amplikaa.nomina_pagos;
create policy "nomina all authenticated"
  on amplikaa.nomina_pagos for all
  to authenticated
  using (true)
  with check (true);

create index if not exists nomina_empleado_idx on amplikaa.nomina_pagos (empleado_id);
create index if not exists nomina_fecha_idx on amplikaa.nomina_pagos (fecha desc);

-- ---------- 4) FINANZAS (ingresos y egresos) ----------
create table if not exists amplikaa.finanzas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  fecha date not null default current_date,
  tipo text not null default 'ingreso',           -- ingreso | egreso
  concepto text not null,
  monto numeric(10,2) not null check (monto >= 0),
  categoria text not null default 'general',      -- cliente | pauta | herramientas | nomina | operacion | otros
  cliente_id uuid references amplikaa.clients (id) on delete set null,
  notas text not null default ''
);

comment on table amplikaa.finanzas is 'Movimientos financieros de la agencia';

alter table amplikaa.finanzas enable row level security;

drop policy if exists "finanzas all authenticated" on amplikaa.finanzas;
create policy "finanzas all authenticated"
  on amplikaa.finanzas for all
  to authenticated
  using (true)
  with check (true);

create index if not exists finanzas_fecha_idx on amplikaa.finanzas (fecha desc);
create index if not exists finanzas_tipo_idx on amplikaa.finanzas (tipo);

-- ---------- 5) Seed: primeros 6 planes iguales a la landing actual ----------
insert into amplikaa.planes (key, seccion, plan_no, label, price, descripcion, features, entrega, featured, servicio, presupuesto, posicion) values
  ('impulso', 'marketing', 'Plan 01', 'Impulso', 65,
   'Para marcas que quieren presencia seria cada semana, sin arrancar un sistema completo.',
   '["12 piezas de contenido semanales","Gestión de 1 red social","Calendario editorial semanal","Reporte mensual de métricas"]'::jsonb,
   '', false, 'Plan: Impulso', '$100 – $300', 1),
  ('crecimiento', 'marketing', 'Plan 02', 'Crecimiento', 90,
   'Contenido y comunidad creciendo juntos todas las semanas.',
   '["Todo lo de Impulso","18 piezas semanales (incluye 1 ad)","Gestión de 2 redes sociales","Reporte quincenal + call de seguimiento"]'::jsonb,
   '', true, 'Plan: Crecimiento', '$300 – $700', 2),
  ('ecosistema', 'marketing', 'Plan 03', 'Ecosistema', 100,
   'Partner digital completo: marketing, pauta y web siempre al día.',
   '["Todo lo de Crecimiento","Gestión de pauta Meta/Google","Desarrollo & Mantenimiento de tu web (actualizaciones y backups)","Soporte prioritario por WhatsApp"]'::jsonb,
   '', false, 'Plan: Ecosistema', '$300 – $700', 3),
  ('landing', 'sistemas', 'Sistema 01', 'Landing Express', 500,
   'Una página de alto contraste para lanzar, validar o pautar sin fricción.',
   '["Diseño a medida y copy CRO","Formulario + WhatsApp","SEO técnico básico + analytics","Entrega en 1–2 semanas"]'::jsonb,
   '1–2 semanas', false, 'Sistema: Landing Express', '$300 – $700', 1),
  ('sitio', 'sistemas', 'Sistema 02', 'Sitio Corporativo', 1250,
   'Sitio multipágina con CMS para que publique usted mismo, sin código.',
   '["Hasta 8 páginas + blog","CMS para editar contenidos","SEO técnico y performance","Integraciones (forms, CRM, analytics)","Entrega en 3–4 semanas"]'::jsonb,
   '3–4 semanas', true, 'Sistema: Sitio Corporativo', '$700 – $1,500', 2),
  ('sistema', 'sistemas', 'Sistema 03', 'E-Commerce / Sistema', 2100,
   'Tienda o sistema a medida: pagos, panel de administración y flujos propios.',
   '["Tienda o app web a medida","Pagos y envíos integrados","Panel de administración","Integraciones con APIs","Entrega en 6–10 semanas"]'::jsonb,
   '6–10 semanas', false, 'Sistema: E-Commerce / Sistema', '$1,500 – $3,000', 3)
on conflict (key) do nothing;
