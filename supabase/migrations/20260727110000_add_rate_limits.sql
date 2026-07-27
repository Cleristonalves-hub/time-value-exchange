-- Rate limiting real, com estado compartilhado no banco (substitui, para as
-- Edge Functions que mais importam, o rate limit em memória de
-- supabase/functions/_shared/rateLimit.ts — que é por instância e não
-- sobrevive a cold start nem é consistente entre instâncias concorrentes).
create table if not exists public.rate_limits (
  key text primary key,
  count int not null default 1,
  window_start timestamptz not null default now()
);

-- RLS habilitada e sem nenhuma policy: ninguém acessa esta tabela
-- diretamente pelo client. Todo acesso passa pela função abaixo, que roda
-- como SECURITY DEFINER (dono da função, não do chamador).
alter table public.rate_limits enable row level security;

-- Upsert atômico: o ON CONFLICT toma um lock de linha na chave, então duas
-- requisições concorrentes para o mesmo IP/função nunca perdem incremento
-- (diferente de fazer SELECT + UPDATE separados no código da Edge Function).
-- Reseta a contagem quando a janela anterior já expirou.
create or replace function public.check_rate_limit(
  p_key text,
  p_max int default 10,
  p_window_seconds int default 60
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case
      when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds) then 1
      else public.rate_limits.count + 1
    end,
    window_start = case
      when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds) then now()
      else public.rate_limits.window_start
    end
  returning count into v_count;

  return v_count <= p_max;
end;
$$;

grant execute on function public.check_rate_limit(text, int, int) to anon, authenticated, service_role;
