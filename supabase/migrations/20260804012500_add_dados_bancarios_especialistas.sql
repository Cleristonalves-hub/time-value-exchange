-- Recebimento alternativo via conta bancária (além de chave PIX, já
-- existente) — o especialista escolhe um dos dois em /configurar-leilao. Não
-- há uma coluna separada para "qual método está ativo": a UI infere isso a
-- partir de qual conjunto de campos está preenchido (banco/agencia/
-- numero_conta não vazios = conta bancária; caso contrário, PIX).
alter table public.especialistas
  add column if not exists banco text,
  add column if not exists agencia text,
  add column if not exists numero_conta text,
  add column if not exists tipo_conta text; -- 'corrente' | 'poupanca'
