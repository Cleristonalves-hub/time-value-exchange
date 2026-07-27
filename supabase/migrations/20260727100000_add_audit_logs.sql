-- Log de auditoria das ações do painel admin (aprovar/reprovar/suspender
-- especialista, etc.). Imutável por design: só existe policy de SELECT e
-- INSERT — nenhuma de UPDATE/DELETE, então nem o próprio admin consegue
-- editar ou apagar um registro já criado pelo client.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.usuarios(id) on delete set null,
  acao text not null,
  alvo_tipo text not null,
  alvo_id uuid,
  detalhes jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_acao_idx on public.audit_logs (acao);

alter table public.audit_logs enable row level security;

create policy "admin_read" on public.audit_logs
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- O admin só consegue inserir logs atribuídos a si mesmo (admin_id = auth.uid()),
-- então ninguém pode forjar um log em nome de outro admin.
create policy "admin_insert" on public.audit_logs
  for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') and admin_id = auth.uid());
