-- Agenda a Edge Function processar-inadimplencia para rodar a cada 15 minutos.
-- Precisa das extensões pg_cron e pg_net habilitadas no projeto (Database >
-- Extensions no Dashboard). Se não estiverem habilitadas, esta migration falha
-- na hora do `supabase db push` — habilite as extensões primeiro e rode de novo.
--
-- O secret de autenticação (PROCESSAR_INADIMPLENCIA_SECRET) evita que qualquer
-- pessoa na internet possa chamar essa função e disparar cobranças/cancelamentos.
-- Gere um valor aleatório, configure em ambos os lugares:
--   supabase secrets set PROCESSAR_INADIMPLENCIA_SECRET=<valor-aleatorio>
--   e troque o placeholder abaixo pelo mesmo valor antes de rodar esta migration.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select
  cron.schedule(
    'processar-inadimplencia-15min',
    '*/15 * * * *',
    $$
    select
      net.http_post(
        url := 'https://sapuvozigtbxowuzwgqq.supabase.co/functions/v1/processar-inadimplencia',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cron-secret', 'TROQUE_PELO_MESMO_VALOR_DE_PROCESSAR_INADIMPLENCIA_SECRET'
        ),
        body := '{}'::jsonb
      );
    $$
  );
