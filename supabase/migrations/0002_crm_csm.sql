-- ============================================================
-- AMPLIKAA — 0002: CRM (pipeline de leads) + CSM (clientes, tareas, notas)
-- Schema: amplikaa
-- ============================================================

-- ---------- 1) LEADS: pipeline CRM ----------
alter table amplikaa.leads
  add column if not exists etapa text not null default 'nuevo',
  add column if not exists updated_at timestamptz not null default now();

comment on column amplikaa.leads.etapa is
  'Etapa del pipeline: nuevo | contactado | propuesta | ganado | perdido';

drop index if exists amplikaa.leads_etapa_idx;
create index if not exists leads_etapa_idx on amplikaa.leads (etapa);

-- El equipo (authenticated) necesita leer y mover leads
drop policy if exists "leads select authenticated" on amplikaa.leads;
create policy "leads select authenticated"
  on amplikaa.leads for select
  to authenticated
  using (true);

drop policy if exists "leads update authenticated" on amplikaa.leads;
create policy "leads update authenticated"
  on amplikaa.leads for update
  to authenticated
  using (true)
  with check (true);

-- Si el equipo logueado envía el formulario público, también puede insertar
drop policy if exists "leads insert authenticated" on amplikaa.leads;
create policy "leads insert authenticated"
  on amplikaa.leads for insert
  to authenticated
  with check (true);

-- ---------- 2) CLIENTES (CSM) ----------
create table if not exists amplikaa.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null,
  empresa text,
  whatsapp text,
  email text,
  plan text not null default 'Impulso',
  ciclo text not null default 'semanal',        -- semanal | mensual | proyecto
  precio numeric(10,2) not null default 0,
  inicio date,
  proxima_cobro date,
  salud text not null default 'verde',          -- verde | amarillo | rojo
  estado text not null default 'activo',        -- activo | pausado | cerrado
  lead_id uuid references amplikaa.leads (id) on delete set null
);

comment on table amplikaa.clients is 'Cartera de clientes activos (CSM)';

alter table amplikaa.clients enable row level security;

drop policy if exists "clients all authenticated" on amplikaa.clients;
create policy "clients all authenticated"
  on amplikaa.clients for all
  to authenticated
  using (true)
  with check (true);

create index if not exists clients_estado_idx on amplikaa.clients (estado);
create index if not exists clients_salud_idx on amplikaa.clients (salud);
create index if not exists clients_proxima_cobro_idx on amplikaa.clients (proxima_cobro);

-- ---------- 3) TAREAS (CSM) ----------
create table if not exists amplikaa.tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  client_id uuid not null references amplikaa.clients (id) on delete cascade,
  titulo text not null,
  tipo text not null default 'general',         -- onboarding | entrega | renovacion | seguimiento | general
  prioridad text not null default 'media',      -- alta | media | baja
  vence date
);

alter table amplikaa.tasks enable row level security;

drop policy if exists "tasks all authenticated" on amplikaa.tasks;
create policy "tasks all authenticated"
  on amplikaa.tasks for all
  to authenticated
  using (true)
  with check (true);

create index if not exists tasks_client_idx on amplikaa.tasks (client_id);
create index if not exists tasks_vence_idx on amplikaa.tasks (vence) where completed_at is null;

-- ---------- 4) NOTAS (lead o cliente) ----------
create table if not exists amplikaa.notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references amplikaa.leads (id) on delete cascade,
  client_id uuid references amplikaa.clients (id) on delete cascade,
  texto text not null,
  check (lead_id is not null or client_id is not null)
);

alter table amplikaa.notes enable row level security;

drop policy if exists "notes all authenticated" on amplikaa.notes;
create policy "notes all authenticated"
  on amplikaa.notes for all
  to authenticated
  using (true)
  with check (true);

create index if not exists notes_lead_idx on amplikaa.notes (lead_id);
create index if not exists notes_client_idx on amplikaa.notes (client_id);

-- ---------- 5) Vista rápida de dashboard ----------
create or replace view amplikaa.pipeline_summary
with (security_invoker = true) as
select etapa, count(*)::int as total
from amplikaa.leads
group by etapa;
