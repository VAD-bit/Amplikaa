-- ============================================================
-- AMPLIKAA — 0005: Cerebro neuronal local (sin APIs externas)
-- Almacena el modelo entrenado (pesos + vocabulario + chunks) como JSON.
-- Schema: amplikaa
-- ============================================================

create table if not exists amplikaa.ai_brain (
  id text primary key default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb not null
);

comment on table amplikaa.ai_brain is 'Modelo neuronal local del asistente (entrenado en el panel, sin API externa)';

alter table amplikaa.ai_brain enable row level security;

drop policy if exists "ai_brain all authenticated" on amplikaa.ai_brain;
create policy "ai_brain all authenticated"
  on amplikaa.ai_brain for all
  to authenticated
  using (true)
  with check (true);
