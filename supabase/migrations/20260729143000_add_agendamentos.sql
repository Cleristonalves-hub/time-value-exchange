-- Agendamentos: sessão marcada pelo vencedor de um leilão encerrado, num
-- horário dentro da disponibilidade declarada pelo especialista (dias_
-- disponibilidade / horario_inicio / horario_fim em especialistas).
create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  leilao_id uuid not null references public.leiloes (id) on delete cascade,
  cliente_id uuid not null references public.usuarios (id) on delete cascade,
  especialista_id uuid not null references public.especialistas (id) on delete cascade,
  data_hora timestamptz not null,
  plataforma text,
  status text not null default 'confirmado', -- confirmado | cancelado
  created_at timestamptz not null default now()
);
create index if not exists agendamentos_especialista_idx on public.agendamentos (especialista_id, data_hora);
create index if not exists agendamentos_cliente_idx on public.agendamentos (cliente_id);

-- Nenhum especialista pode ter dois agendamentos confirmados no mesmo
-- horário (evita dois vencedores diferentes reservando o mesmo horário numa
-- corrida entre dois `criar-agendamento` simultâneos), e nenhum leilão pode
-- gerar mais de um agendamento confirmado (um vencedor agenda uma vez só).
-- Índices parciais (só sobre status = 'confirmado') porque um agendamento
-- cancelado não deve travar o horário nem o leilão para uma nova tentativa.
create unique index if not exists agendamentos_especialista_horario_unico
  on public.agendamentos (especialista_id, data_hora)
  where status = 'confirmado';
create unique index if not exists agendamentos_leilao_unico
  on public.agendamentos (leilao_id)
  where status = 'confirmado';

alter table public.agendamentos enable row level security;

-- Leitura: só o cliente e o especialista envolvidos no agendamento (ou
-- admin) — não expõe a agenda de um especialista para terceiros.
create policy "Cliente ve seus agendamentos" on public.agendamentos
  for select to authenticated using (cliente_id = auth.uid());
create policy "Especialista ve seus agendamentos" on public.agendamentos
  for select to authenticated using (
    especialista_id in (select id from public.especialistas where usuario_id = auth.uid())
  );
create policy "Admin ve todos os agendamentos" on public.agendamentos
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Escrita: criação acontece via Edge Function `criar-agendamento` com
-- service_role (precisa validar atomicamente a disponibilidade e dar erro
-- amigável em caso de corrida — RLS sozinha não faz isso). Só admin pode
-- alterar o status depois de criado (ex.: cancelar um agendamento).
create policy "Admin altera status do agendamento" on public.agendamentos
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
