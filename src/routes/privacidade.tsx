import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Valore" },
      { name: "description", content: "Política de Privacidade da Valore. Como coletamos, usamos e protegemos seus dados." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <Shield className="size-5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Legal</span>
        </div>

        <h1 className="mt-8 font-display text-4xl text-foreground">
          Política de <span className="text-gradient-gold">Privacidade</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Última atualização: 8 de junho de 2026
        </p>

        <div className="mt-10 space-y-10">
          <Section title="1. Introdução">
            A Valore (&ldquo;Plataforma&rdquo;, &ldquo;nós&rdquo;, &ldquo;nos&rdquo;) valoriza a sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações pessoais dos usuários (&ldquo;você&rdquo;, &ldquo;seu&rdquo;) ao utilizar nossa plataforma de leilão de tempo humano.
          </Section>

          <Section title="2. Dados que Coletamos">
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li><strong className="text-foreground">Dados de cadastro:</strong> nome completo, e-mail, telefone, cidade e senha.</li>
              <li><strong className="text-foreground">Dados profissionais:</strong> especialidade, credenciais, bio, anos de experiência e plataforma de videochamada preferida (para especialistas).</li>
              <li><strong className="text-foreground">Dados de transação:</strong> histórico de lances, valores pagos e saques solicitados.</li>
              <li><strong className="text-foreground">Dados de navegação:</strong> endereço IP, tipo de dispositivo, navegador e páginas visitadas.</li>
            </ul>
          </Section>

          <Section title="3. Como Usamos seus Dados">
            Utilizamos suas informações para:
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li>Criar e gerenciar sua conta na plataforma;</li>
              <li>Processar lances, pagamentos e saques;</li>
              <li>Verificar credenciais de especialistas e garantir a qualidade do marketplace;</li>
              <li>Enviar notificações sobre leilões, mensagens e atualizações da plataforma;</li>
              <li>Cumprir obrigações legais e regulatórias;</li>
              <li>Prevenir fraudes e garantir a segurança da comunidade Valore.</li>
            </ul>
          </Section>

          <Section title="4. Compartilhamento de Dados">
            Não vendemos seus dados pessoais. Podemos compartilhar informações com:
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
              <li>Processadores de pagamento (Stripe, Pix) para transações financeiras;</li>
              <li>Provedores de videochamada (Google Meet, Zoom, Microsoft Teams) para geração de links de sessão;</li>
              <li>Autoridades competentes, quando exigido por lei ou ordem judicial.</li>
            </ul>
          </Section>

          <Section title="5. Segurança">
            Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito (TLS 1.3), hash de senhas (bcrypt) e armazenamento seguro em servidores certificados. Apesar dos nossos esforços, nenhum sistema é 100% invulnerável. Notificaremos você em caso de incidentes de segurança relevantes.
          </Section>

          <Section title="6. Seus Direitos">
            Você tem o direito de acessar, corrigir, excluir ou exportar seus dados pessoais. Para exercer esses direitos, entre em contato pelo e-mail privacidade@valore.app. Responderemos em até 15 dias úteis.
          </Section>

          <Section title="7. Alterações nesta Política">
            Podemos atualizar esta Política de Privacidade periodicamente. Sempre que houver mudanças materiais, notificaremos você por e-mail ou por meio de aviso na plataforma. O uso continuado da Valore após a publicação das alterações constitui aceitação dos novos termos.
          </Section>

          <Section title="8. Contato">
            Em caso de dúvidas sobre esta Política de Privacidade, entre em contato:
            <p className="mt-3 text-sm text-foreground/80">
              E-mail: <span className="text-gold">privacidade@valore.app</span><br />
              Endereço: Av. Rio Branco, 1 — Centro, Rio de Janeiro — RJ, 20090-003
            </p>
          </Section>
        </div>

        <div className="mt-16 flex items-center gap-4 border-t border-border pt-8">
          <Link to="/termos" className="text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
            Termos de Uso
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <Link to="/" className="text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-foreground/70">
        {children}
      </div>
    </section>
  );
}
