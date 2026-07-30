-- Defesa em profundidade: até agora nada no banco impedia um leilão com
-- lance_minimo = 0 ou com data_fim <= data_inicio — a única validação era em
-- código de aplicação (criar-leilao.tsx / editar-leilao). Estas constraints
-- barram esses dois casos mesmo que um bug futuro em alguma tela pule a
-- validação da aplicação.
--
-- NOT VALID: não revalida linhas já existentes (podem já ter lance_minimo = 0
-- de antes desta migration) — só passa a valer para novos inserts/updates a
-- partir de agora. Sem isso, a migration falharia caso já exista alguma linha
-- violando a regra.
alter table public.leiloes
  add constraint leiloes_lance_minimo_positivo check (lance_minimo > 0) not valid;

alter table public.leiloes
  add constraint leiloes_data_fim_apos_inicio check (data_fim > data_inicio) not valid;
