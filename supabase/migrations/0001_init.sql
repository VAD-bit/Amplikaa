-- ============================================================
-- AMPLIKAA — Esquema inicial (schema: amplikaa)
-- Revísalo y ejecútalo en Supabase → SQL Editor (o via CLI).
-- TODO vive en el schema `amplikaa` (NO en public).
-- ============================================================

-- ---------- 1) SCHEMA ----------
create schema if not exists amplikaa;

comment on schema amplikaa is
  'Datos de la web app AMPLIKAA (leads del landing + solicitudes del Studio)';

grant usage on schema amplikaa to anon, authenticated, service_role;

-- ---------- 2) LEADS (formularios de contacto de la landing) ----------
create table if not exists amplikaa.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  source text,
  nombre text not null,
  email text not null,
  whatsapp text,
  empresa text,
  servicio text not null,
  presupuesto text,
  mensaje text not null
);

alter table amplikaa.leads enable row level security;

drop policy if exists "Allow public insert to leads" on amplikaa.leads;
create policy "Allow public insert to leads"
  on amplikaa.leads for insert
  to anon
  with check (true);

-- Solo service_role lee (dashboard / backend). Sin policy de SELECT para anon.

-- ---------- 3) STUDIO SUBMISSIONS (constructor "Construye tu Website") ----------
create table if not exists amplikaa.studio_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  source text not null default 'studio',
  nombre text not null,
  email text not null,
  whatsapp text,
  empresa text,
  rubro text not null,
  publico text,
  nota text not null,
  goals jsonb default '[]'::jsonb,
  budget_range text not null,
  budget_note text,
  plazo text,
  extras jsonb default '[]'::jsonb,
  blocks jsonb not null,
  analysis jsonb
);

alter table amplikaa.studio_submissions enable row level security;

drop policy if exists "Allow public insert to studio_submissions" on amplikaa.studio_submissions;
create policy "Allow public insert to studio_submissions"
  on amplikaa.studio_submissions for insert
  to anon
  with check (true);

-- ---------- 4) Índices para el dashboard ----------
create index if not exists leads_created_at_idx on amplikaa.leads (created_at desc);
create index if not exists leads_status_idx on amplikaa.leads (status);
create index if not exists studio_created_at_idx on amplikaa.studio_submissions (created_at desc);
create index if not exists studio_status_idx on amplikaa.studio_submissions (status);

-- ---------- 5) Privilegios por defecto para tablas futuras ----------
alter default privileges in schema amplikaa
  grant all on tables to anon, authenticated, service_role;

-- ---------- 6) Exponer el schema en la API REST de Supabase ----------
-- (PostgREST solo sirve los schemas listados en pgrst.db_schemas)
alter role authenticator set pgrst.db_schemas = 'public,amplikaa';
notify pgrst, 'reload config';
