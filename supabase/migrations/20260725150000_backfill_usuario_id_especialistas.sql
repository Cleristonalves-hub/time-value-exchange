-- Backfill idempotente: preenche usuario_id em linhas de public.especialistas
-- que ainda não têm esse vínculo, casando por e-mail (case-insensitive) com
-- auth.users — cobre cadastros feitos antes da migration
-- 20260723120000_add_self_update_especialistas.sql (quando addSpecialist ainda
-- não gravava usuario_id no insert). Seguro de rodar múltiplas vezes: só afeta
-- linhas com usuario_id nulo e um e-mail correspondente em auth.users.
update public.especialistas e
set usuario_id = u.id
from auth.users u
where e.usuario_id is null
  and e.email is not null
  and lower(u.email) = lower(e.email);
