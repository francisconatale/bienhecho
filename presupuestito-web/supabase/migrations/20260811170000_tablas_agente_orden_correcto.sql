-- 2026-08-11: Supersede de 20260811150000_tablas_agente.sql.
-- Motivo: en una BD sin baseline (prod), 15:00 creaba pending_steps (FK a
-- tasks_snapshot) ANTES que tasks_snapshot -> error 42P01. En local era no-op
-- porque el baseline ya creaba las 3 tablas. Esta migración crea las 3 tablas
-- en orden de dependencias FK: conversations -> tasks_snapshot -> pending_steps.
-- Totalmente idempotente: en local (tablas ya existentes) es no-op.

-- conversations
create table if not exists public.conversations (
    id uuid default gen_random_uuid() not null constraint conversations_pkey primary key,
    created_at timestamp with time zone default now() not null,
    status text default 'IN_PROGRESS'::text not null,
    user_id uuid not null,
    cliente_id uuid,
    trabajo_id uuid,
    constraint conversations_cliente_id_fkey foreign key (cliente_id) references public.clientes(id) on delete set null,
    constraint conversations_trabajo_id_fkey foreign key (trabajo_id) references public.trabajos(id) on delete set null,
    constraint conversations_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

alter table public.conversations owner to postgres;
alter table public.conversations enable row level security;

create index if not exists idx_conversations_cliente_id on public.conversations using btree (cliente_id);
create index if not exists idx_conversations_trabajo_id on public.conversations using btree (trabajo_id);
create index if not exists idx_conversations_user_id on public.conversations using btree (user_id);

drop policy if exists usuarios_sus_conversaciones on public.conversations;
create policy usuarios_sus_conversaciones on public.conversations
    using ((user_id = auth.uid()))
    with check ((user_id = auth.uid()));

grant all on table public.conversations to anon;
grant all on table public.conversations to authenticated;
grant all on table public.conversations to service_role;

-- tasks_snapshot
create table if not exists public.tasks_snapshot (
    id uuid default gen_random_uuid() not null constraint tasks_snapshot_pkey primary key,
    conversation_id uuid not null,
    description text not null,
    quantity numeric,
    status text default 'PENDING'::text not null,
    created_at timestamp with time zone default now() not null,
    precio numeric,
    constraint tasks_snapshot_conversation_id_fkey foreign key (conversation_id) references public.conversations(id) on delete cascade
);

alter table public.tasks_snapshot owner to postgres;
alter table public.tasks_snapshot enable row level security;

create index if not exists idx_tasks_snapshot_conversation_id on public.tasks_snapshot using btree (conversation_id);

drop policy if exists usuarios_sus_tasks_snapshot on public.tasks_snapshot;
create policy usuarios_sus_tasks_snapshot on public.tasks_snapshot
    using ((exists (
        select 1 from public.conversations
        where conversations.id = tasks_snapshot.conversation_id
          and conversations.user_id = auth.uid()
    )))
    with check ((exists (
        select 1 from public.conversations
        where conversations.id = tasks_snapshot.conversation_id
          and conversations.user_id = auth.uid()
    )));

grant all on table public.tasks_snapshot to anon;
grant all on table public.tasks_snapshot to authenticated;
grant all on table public.tasks_snapshot to service_role;

-- pending_steps
create table if not exists public.pending_steps (
    id uuid default gen_random_uuid() not null constraint pending_steps_pkey primary key,
    conversation_id uuid not null,
    task_id uuid not null,
    step_type text not null,
    status text default 'PENDING'::text not null,
    attempts integer default 0 not null,
    created_at timestamp with time zone default now() not null,
    constraint pending_steps_conversation_id_fkey foreign key (conversation_id) references public.conversations(id) on delete cascade,
    constraint pending_steps_task_id_fkey foreign key (task_id) references public.tasks_snapshot(id) on delete cascade
);

alter table public.pending_steps owner to postgres;
alter table public.pending_steps enable row level security;

create index if not exists idx_pending_steps_conversation_id on public.pending_steps using btree (conversation_id);
create index if not exists idx_pending_steps_task_id on public.pending_steps using btree (task_id);

drop policy if exists usuarios_sus_pending_steps on public.pending_steps;
create policy usuarios_sus_pending_steps on public.pending_steps
    using ((exists (
        select 1 from public.conversations
        where conversations.id = pending_steps.conversation_id
          and conversations.user_id = auth.uid()
    )))
    with check ((exists (
        select 1 from public.conversations
        where conversations.id = pending_steps.conversation_id
          and conversations.user_id = auth.uid()
    )));

grant all on table public.pending_steps to anon;
grant all on table public.pending_steps to authenticated;
grant all on table public.pending_steps to service_role;
