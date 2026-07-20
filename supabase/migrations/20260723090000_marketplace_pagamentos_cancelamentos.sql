-- Reestruturação do fluxo de marketplace: lances reais, cartão tokenizado,
-- pagamentos, inadimplência e cancelamento de leilão com penalidades.

-- 1) Campos novos em usuarios: CPF/telefone (coletados no cadastro de cliente)
-- e bloqueio automático por inadimplência.
alter table public.usuarios
  add column if not exists cpf text,
  add column if not exists telefone text,
  add column if not exists bloqueado boolean not null default false;

-- 2) Lances — histórico de lances reais por leilão (a coluna leiloes.lance_atual
-- já existe e reflete sempre o maior lance; esta tabela é o registro/auditoria).
create table if not exists public.lances (
  id uuid primary key default gen_random_uuid(),
  leilao_id uuid not null references public.leiloes (id) on delete cascade,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  valor numeric not null,
  created_at timestamptz not null default now()
);
create index if not exists lances_leilao_id_idx on public.lances (leilao_id, valor desc);

alter table public.lances enable row level security;
create policy "Lances sao publicos para leitura" on public.lances for select using (true);
create policy "Usuarios autenticados podem dar lance" on public.lances for insert to authenticated with check (usuario_id = auth.uid());

-- 3) Cartões tokenizados via Mercado Pago. Nunca armazenamos dado de cartão cru
-- — só o card_id/customer_id retornados pela API do Mercado Pago, e os últimos
-- 4 dígitos/bandeira (não sensíveis) para exibição.
create table if not exists public.cartoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  mp_customer_id text,
  mp_card_id text,
  ultimos_digitos text,
  bandeira text,
  created_at timestamptz not null default now()
);
create unique index if not exists cartoes_usuario_id_key on public.cartoes (usuario_id);
alter table public.cartoes enable row level security;
create policy "Usuario ve seu proprio cartao" on public.cartoes for select to authenticated using (usuario_id = auth.uid());
create policy "Usuario remove seu proprio cartao" on public.cartoes for delete to authenticated using (usuario_id = auth.uid());
-- Inserção/atualização de cartão só acontece via Edge Function com service_role
-- (a Edge Function fala com a API do Mercado Pago) — não expomos policy de
-- insert/update para o cliente autenticado diretamente.

-- 4) Pagamentos — um por leilão vencido, rastreando a tentativa de cobrança.
create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  leilao_id uuid not null references public.leiloes (id) on delete cascade,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  valor numeric not null,
  status text not null default 'pendente', -- pendente | em_analise | pago | falhou | cancelado
  mp_payment_id text,
  tentativa_iniciada_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pagamentos_leilao_id_idx on public.pagamentos (leilao_id);
create index if not exists pagamentos_status_idx on public.pagamentos (status, tentativa_iniciada_em);
alter table public.pagamentos enable row level security;
create policy "Usuario ve seus proprios pagamentos" on public.pagamentos for select to authenticated using (usuario_id = auth.uid());

-- 5) Cancelamentos de leilão — usado para aplicar/rastrear penalidades.
create table if not exists public.cancelamentos_leilao (
  id uuid primary key default gen_random_uuid(),
  leilao_id uuid not null references public.leiloes (id) on delete cascade,
  especialista_id uuid not null references public.especialistas (id) on delete cascade,
  motivo text,
  penalizado boolean not null default false,
  iniciado_por text not null default 'especialista', -- 'especialista' | 'sistema'
  created_at timestamptz not null default now()
);
create index if not exists cancelamentos_leilao_especialista_idx on public.cancelamentos_leilao (especialista_id, iniciado_por, created_at);
alter table public.cancelamentos_leilao enable row level security;
create policy "Cancelamentos sao publicos para leitura" on public.cancelamentos_leilao for select using (true);

-- 6) Colunas novas em leiloes: vencedor, destaque (reagendamento gratuito) e
-- rastreamento de leilão que substitui um cancelado por inadimplência.
alter table public.leiloes
  add column if not exists vencedor_usuario_id uuid references public.usuarios (id),
  add column if not exists destaque_ate date,
  add column if not exists criado_por_sistema boolean not null default false,
  add column if not exists leilao_original_id uuid references public.leiloes (id);

-- 7) Colunas novas em especialistas: penalidades de cancelamento.
alter table public.especialistas
  add column if not exists badge_cancelamento_ate date,
  add column if not exists suspenso_ate date,
  add column if not exists motivo_penalidade text;
