-- Trust Engine: pontuação de confiança calculada automaticamente a cada
-- verificação (ver supabase/functions/trust-engine). Não é editável pelo
-- especialista — só o próprio Trust Engine (service_role) e admins podem
-- alterá-la, o que é garantido pelo trigger abaixo, não só pela aplicação.
alter table public.especialistas
  add column if not exists trust_score integer not null default 50
    check (trust_score >= 0 and trust_score <= 100);

-- Selo Premium (assinatura paga / destaque), controlado pelo admin ou pelo
-- processo de cobrança — nunca pelo próprio especialista.
alter table public.especialistas
  add column if not exists premium boolean not null default false;

-- A política "self_update" (20260723120000) permite que o especialista
-- atualize seu próprio registro em especialistas, mas isso vale para TODAS as
-- colunas — sem este trigger, bastaria uma chamada direta à REST API (fora do
-- app) para o próprio especialista se autodeclarar `premium = true` ou subir
-- seu `trust_score` para 100, esvaziando o valor desses dois campos como
-- sinais de confiança. O trigger reverte qualquer alteração nessas duas
-- colunas feita por quem não é o Trust Engine (service_role) nem admin.
create or replace function public.protect_especialistas_trust_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or public.has_role(auth.uid(), 'admin') then
    return new;
  end if;
  new.trust_score := old.trust_score;
  new.premium := old.premium;
  return new;
end;
$$;

drop trigger if exists protect_especialistas_trust_fields on public.especialistas;
create trigger protect_especialistas_trust_fields
  before update on public.especialistas
  for each row
  execute function public.protect_especialistas_trust_fields();
