-- ============================================================
-- AMPLIKAA — 0003: Asistente IA del panel (chat, conocimiento, tareas)
-- Schema: amplikaa
-- ============================================================

-- ---------- 1) CHAT (historial de conversación) ----------
create table if not exists amplikaa.ai_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null,                            -- user | assistant
  content text not null,
  check (role in ('user', 'assistant'))
);

comment on table amplikaa.ai_messages is 'Historial de chat del asistente interno';

alter table amplikaa.ai_messages enable row level security;

drop policy if exists "ai_messages all authenticated" on amplikaa.ai_messages;
create policy "ai_messages all authenticated"
  on amplikaa.ai_messages for all
  to authenticated
  using (true)
  with check (true);

create index if not exists ai_messages_created_idx on amplikaa.ai_messages (created_at);

-- ---------- 2) BASE DE CONOCIMIENTO (educar / entrenar) ----------
create table if not exists amplikaa.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  titulo text not null,
  contenido text not null
);

comment on table amplikaa.ai_knowledge is 'Lo que el equipo le ha enseñado al asistente; se inyecta como contexto';

alter table amplikaa.ai_knowledge enable row level security;

drop policy if exists "ai_knowledge all authenticated" on amplikaa.ai_knowledge;
create policy "ai_knowledge all authenticated"
  on amplikaa.ai_knowledge for all
  to authenticated
  using (true)
  with check (true);

create index if not exists ai_knowledge_created_idx on amplikaa.ai_knowledge (created_at desc);

-- ---------- 3) TAREAS (trabajo encomendado a la IA) ----------
create table if not exists amplikaa.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  titulo text not null,
  brief text not null default '',
  status text not null default 'pendiente',      -- pendiente | ejecutando | completada | error
  result text,
  ran_at timestamptz
);

comment on table amplikaa.ai_tasks is 'Tareas que el equipo le da a ejecutar al asistente';

alter table amplikaa.ai_tasks enable row level security;

drop policy if exists "ai_tasks all authenticated" on amplikaa.ai_tasks;
create policy "ai_tasks all authenticated"
  on amplikaa.ai_tasks for all
  to authenticated
  using (true)
  with check (true);

create index if not exists ai_tasks_status_idx on amplikaa.ai_tasks (status);
create index if not exists ai_tasks_created_idx on amplikaa.ai_tasks (created_at desc);
