-- Tabela de notificações para o admin revisar manualmente especialistas reprovados
-- pelo Trust Engine (ex: quando o link ou o registro profissional não confirmam).
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  especialista_id uuid not null references public.especialistas (id) on delete cascade,
  motivo text not null,
  criterios jsonb not null,
  lida boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_lida_idx on public.admin_notifications (lida);
