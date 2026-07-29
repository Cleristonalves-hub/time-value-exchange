# Ativos estratégicos da Valore

Este documento descreve os cinco sistemas que formam o verdadeiro diferencial
competitivo da Valore — não a interface do marketplace (replicável em semanas
por qualquer equipe), mas a lógica de confiança, reputação, descoberta,
segurança financeira e leilão que roda por trás dela. Cada seção cobre: o que
é, como funciona hoje (código real, não aspiração), como evolui à medida que a
plataforma acumula dados de uso, e por que é difícil de copiar.

A tese comum aos cinco: **nenhum deles é "só um algoritmo"**. Cada um é uma
combinação de regras determinísticas + dados proprietários acumulados ao longo
do tempo (verificações, avaliações, cancelamentos, fraudes reais). Um
concorrente pode copiar o código em um dia; não pode copiar o histórico.

---

## 1. Trust Engine

**O que é.** O sistema de verificação automática que decide se um especialista
recém-cadastrado é confiável o suficiente para aparecer na plataforma, sem
intervenção humana na maioria dos casos.

**Como funciona hoje** (`supabase/functions/trust-engine/index.ts`):
- Disparado automaticamente por um Database Webhook do Supabase a cada `INSERT`
  em `especialistas`.
- Aplica dois critérios independentes e determinísticos (nenhum uso de IA):
  1. **Link** — a URL informada (LinkedIn, site, portfólio) precisa responder
     com sucesso.
  2. **Registro profissional** — o número de OAB/CRM/CREA declarado precisa
     ser confirmado (best-effort) no site do órgão oficial correspondente.
- `status` só vira `"verificado"` se os **dois** critérios passarem (AND). Se
  qualquer um falhar, vira `"reprovado"`, gera uma notificação em
  `admin_notifications` para revisão manual e dispara um e-mail explicando o
  motivo ao especialista.
- Desde a migration `20260729130000`, a cada verificação o Trust Engine também
  calcula e grava `especialistas.trust_score` (inteiro, 0–100): parte de uma
  base neutra de 50 e soma/subtrai por critério (registro profissional pesa
  30, link pesa 20 — o registro é o sinal mais difícil de forjar). Dois
  critérios aprovados = 100; os dois reprovados = 0.
- Um trigger de banco (`protect_especialistas_trust_fields`) impede que
  qualquer sessão que não seja o próprio Trust Engine (`service_role`) ou um
  admin altere `trust_score` — mesmo que o especialista tente uma chamada REST
  direta fora do app, o valor grafado é revertido silenciosamente para o
  anterior.

**Como evolui com dados.** Hoje o Trust Engine roda uma vez, no cadastro. O
valor real dele cresce à medida que a plataforma acumula histórico:
- `trust_score` já é desenhado como um número contínuo (não um booleano), o
  que permite incorporar novos sinais sem quebrar nada que já depende dele:
  taxa de cancelamento de leilões, densidade de denúncias recebidas,
  consistência entre o que o especialista declarou e o que os clientes
  reportam, tempo de resposta a lances.
- Cada verificação (aprovada ou reprovada) é um ponto de dado sobre a
  confiabilidade do critério em si — se, por exemplo, o critério de link
  começar a gerar muitos falsos negativos por sites lentos, isso é visível no
  histórico de `admin_notifications` e pode recalibrar os pesos.
- Reverificação periódica (não só no cadastro) é o próximo passo natural: um
  registro profissional pode ser cassado meses depois do cadastro original.

**Por que é difícil de copiar.** O código de scraping do CNA/CFM/Confea é a
parte fácil. O que não se copia é: (1) o histórico acumulado de quantas
verificações passaram/falharam e por quê, que calibra os pesos; (2) a curva de
aprendizado sobre os falsos positivos/negativos de cada órgão (já documentada
como limitação conhecida no próprio código); (3) o efeito de rede — quanto mais
especialistas verificados existem, mais confiável o selo "Verificado" fica aos
olhos de quem contrata, o que nenhum concorrente novo consegue simular no dia
um.

---

## 2. Sistema de Reputação

**O que é.** O conjunto de sinais públicos (avaliações) e privados
(penalidades por comportamento) que constroem a confiança de um especialista
ao longo do tempo, além da verificação inicial do Trust Engine.

**Como funciona hoje:**
- **Avaliações** (`avaliacoes`, `estrelas` 1–5 + comentário) — cada cliente
  avalia a sessão após o leilão. O perfil público mostra média + total via
  `useSpecialistReputation` (`src/lib/store.ts`); o painel admin usa o mesmo
  dado para sinalizar especialistas com concentração de notas baixas
  (`admin.tsx`).
- **Penalidades por cancelamento** — cancelar um leilão já ativo com menos de
  2h de antecedência aplica automaticamente o badge "Cancelamento recente" por
  7 dias; o terceiro cancelamento penalizado no mesmo mês suspende a conta por
  30 dias (`supabase/functions/cancelar-leilao`). Cancelamentos iniciados pelo
  próprio sistema (ex.: inadimplência do cliente vencedor) não contam contra o
  especialista — a regra distingue quem causou o problema.
- Todo esse estado (`badge_cancelamento_ate`, `suspenso_ate`,
  `motivo_penalidade`) é lido direto do perfil, sem cache separado, e some
  automaticamente quando a data expira.

**Como evolui com dados.** A reputação de um especialista com 200 avaliações
ao longo de um ano é um sinal qualitativamente diferente do de alguém com 2
avaliações da semana passada — o sistema já está desenhado para isso (a média
por si só já pondera naturalmente por volume), mas o próximo passo natural é
ponderar por recência (uma queda de qualidade recente deveria pesar mais que
uma boa fase antiga) e cruzar avaliação com o valor do lance vencedor
(sessões mais caras avaliadas bem são um sinal mais forte que sessões
gratuitas). Cada novo leilão encerrado e avaliado é mais um ponto de dado que
nenhuma plataforma nova possui.

**Por que é difícil de copiar.** Reputação não se copia — se acumula. Um
concorrente pode replicar o schema de `avaliacoes` em uma tarde; não pode
replicar dois anos de avaliações reais, nem o histórico comportamental de
cancelamentos que hoje já distingue "especialista confiável que cancelou uma
vez por emergência" de "especialista que cancela toda semana em cima da
hora". Esse histórico só existe para quem já rodou a plataforma com usuários
reais.

---

## 3. Algoritmo de Busca

**O que é.** O motor de descoberta que decide quais especialistas um cliente
vê ao navegar em `/explorar`.

**Como funciona hoje** (`src/routes/explorar.tsx`) — de forma deliberadamente
honesta: é um filtro, não um ranking. Todos os especialistas com status
`novo` ou `verificado` (excluindo `suspenso`/`reprovado`) são listados,
filtráveis por nicho e por busca textual (nome, especialidade, nicho,
normalizada sem acentos). A ordem de exibição vem de `created_at` — não há
hoje nenhuma ponderação por confiança, reputação ou destaque.

**Como evolui com dados.** Esta é a peça mais clara de "roadmap habilitado
pelos outros quatro ativos": agora que `trust_score` (Trust Engine),
`especialistas.premium` e a média de avaliações (Sistema de Reputação) já
existem como colunas/consultas prontas, o próximo passo natural é substituir
a ordenação por `created_at` por uma função de ranking que combine esses
sinais — por exemplo, priorizar quem tem `trust_score` alto, boa reputação e,
opcionalmente, um leilão ativo com `destaque_ate` vigente (já usado hoje para
reagendamentos automáticos por inadimplência, ver Sistema de Leilão). Cada
busca e cada lance dado é, em potencial, um sinal de "essa combinação de
especialista + posição gerou conversão" que pode alimentar um ranking mais
sofisticado no futuro.

**Por que é difícil de copiar.** O ranking "certo" não é uma fórmula que se
adivinha de fora — ele emerge de observar, com usuários reais, quais buscas
viram lance, quais especialistas no topo geram menos denúncias e cancelamento,
e quais critérios de destaque de fato correlacionam com sessões bem avaliadas.
Um concorrente que nasce hoje pode copiar a UI de busca da Valore linha por
linha; não tem os dados de comportamento real que dizem qual ranking
funciona.

---

## 4. Sistema Antifraude

**O que é.** Não é um único componente, e sim uma pilha de camadas
independentes que protegem a plataforma contra abuso financeiro e de conta —
cada uma delas nasceu de uma auditoria ou incidente específico, documentado em
`SECURITY.md`.

**Como funciona hoje:**
- **Validação de lance nunca confia no client** — `dar-lance` sempre recalcula
  o lance mínimo aceitável a partir do banco (nunca do valor que o navegador
  mandou), insere e atualiza `lance_atual` de forma resistente a corrida entre
  dois lances simultâneos.
- **Cartão obrigatório antes de dar lance** — bloqueado no servidor
  (`dar-lance`), não só na UI.
- **Bloqueio por inadimplência** — `usuarios.bloqueado` impede novos lances de
  quem não pagou um leilão anterior; aplicado automaticamente pelo cron
  `processar-inadimplencia` após 48h sem confirmação de pagamento, sem exigir
  ação manual de um admin.
- **Rate limiting por função/IP**, hoje em duas gerações: em memória
  (`_shared/rateLimit.ts`, mais simples) e com persistência em banco
  (`_shared/rateLimitDb.ts`, mais robusta a cold starts) — cada Edge Function
  sensível (lances, cancelamento, cartão, trust-engine) tem seu próprio limite.
- **CORS restrito a uma lista fixa de domínios** e **checagem de
  Origin/CSRF** em toda função que muda estado.
- **RLS auditada linha a linha** (`20260725170000_security_audit_rls_hardening.sql`)
  — incluindo a correção de uma tabela (`admin_notifications`) que nunca teve
  RLS habilitada, e de uma policy de INSERT que havia divergido silenciosamente
  do que estava versionado.
- **Sanitização de HTML** em campos de texto livre (bio, descrição de leilão),
  **mascaramento de e-mail** na UI, **audit log** de toda ação administrativa,
  e **expiração de sessão por inatividade**.

**Como evolui com dados.** Cada fraude ou abuso real detectado (um chargeback,
um padrão de cancelamento suspeito, uma tentativa de bypass encontrada em
auditoria) vira uma nova regra ou um novo limite calibrado — não uma regra
teórica, mas uma resposta a um caso concreto. Os limites de rate limiting, por
exemplo, foram escolhidos por função com base no uso esperado de cada uma
(20/min para lances, 5/min para cartão) e podem ser recalibrados com dados
reais de tráfego malicioso vs. legítimo.

**Por que é difícil de copiar.** Justamente por não ser um algoritmo, e sim
uma coleção de dezenas de decisões pequenas e específicas — cada uma
documentada com o incidente ou a auditoria que a motivou. Copiar o código é
trivial; passar pela mesma curva de descoberta (que RLS estava aberta, que
policy divergiu, que fail-open existia num cron) exige ou sofrer os mesmos
incidentes, ou auditar com o mesmo nível de rigor — o que já foi feito aqui.

---

## 5. Sistema de Leilão

**O que é.** O motor que transforma "tempo de um especialista" em um leilão
com dinheiro real em jogo — da abertura do lance até a cobrança do vencedor.

**Como funciona hoje:**
- **`dar-lance`** — valida atomicamente no servidor (cartão cadastrado,
  usuário não bloqueado, leilão ativo e dentro da janela de tempo, incremento
  mínimo sobre o lance atual) antes de inserir e atualizar o leilão.
- **`editar-leilao`** — permite ao especialista dono ajustar título, descrição
  e data de encerramento de um leilão ativo, sempre revalidando posse e status
  no servidor (não há política de RLS que permita update direto pelo dono —
  só admin — então isso passa por `service_role` com checagem explícita).
- **`cancelar-leilao`** — aplica a regra de penalidade (2h de antecedência,
  badge de 7 dias, suspensão de 30 dias após 3 cancelamentos penalizados no
  mês), distinguindo cancelamento iniciado pelo especialista do iniciado pelo
  sistema.
- **`processar-inadimplencia`** (via `pg_cron`) — fecha leilões expirados,
  identifica o vencedor pelo maior lance, tenta cobrar via Mercado Pago, e se
  o pagamento não for confirmado em 48h: marca a cobrança como falha, cancela
  o leilão, **recria automaticamente um leilão substituto com destaque
  gratuito por 7 dias** (sem penalizar o especialista, já que a culpa foi do
  cliente) e bloqueia o cliente inadimplente.

**Como evolui com dados.** A state machine já cobre os caminhos observados
até hoje (pago / pendente / falhou / cancelado-e-reagendado), o que significa
que o próximo ganho não é "mais estados", e sim calibração fina com volume
real: qual incremento mínimo de lance maximiza engajamento sem afastar
compradores, qual janela de cancelamento é justa na prática, quantos dias de
destaque gratuito de fato recuperam um leilão cancelado por inadimplência.
Esses parâmetros hoje são constantes no código (`INCREMENTO_MINIMO`,
`DUAS_HORAS_MS`, `SETE_DIAS_MS`) porque ainda não há dado suficiente para
otimizá-los — mas a arquitetura já separa claramente onde cada um vive,
pronta para virar dado configurável quando houver volume para justificar.

**Por que é difícil de copiar.** A parte visível (uma tela de lance) é
trivial. A parte difícil é a orquestração completa entre leilão, cobrança,
penalidade e notificação testada contra dinheiro real — em particular os
casos de borda que só aparecem em produção: duas pessoas dando lance no
mesmo milissegundo, um cliente que ganha e nunca paga, um especialista que
cancela em cima da hora pela terceira vez no mês. Cada um desses casos já
está mapeado e tratado aqui; um concorrente só descobre que precisa deles
depois de já ter perdido dinheiro ou confiança de usuários reais para
aprender isso.
