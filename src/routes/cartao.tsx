import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useMyCard, salvarCartao } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/cartao")({
  head: () => ({ meta: [{ title: "Cadastrar cartão — Valore" }] }),
  component: CartaoPage,
});

// Chave pública de produção do Mercado Pago — segura para expor no client
// (é o par da Access Token secreta, que fica só no servidor).
const MP_PUBLIC_KEY = "APP_USR-6579bd56-853a-4fe3-885a-1ef78b1c267f";

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, opts?: { locale?: string }) => {
      createCardToken: (data: Record<string, string>) => Promise<{ id: string; last_four_digits?: string; payment_method_id?: string }>;
    };
  }
}

function loadMercadoPagoSdk(): Promise<void> {
  if (window.MercadoPago) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar o SDK do Mercado Pago."));
    document.head.appendChild(script);
  });
}

function CartaoPage() {
  return (
    <RequireAuth>
      <CartaoContent />
    </RequireAuth>
  );
}

function CartaoContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartao = useMyCard(user?.id);
  const [sdkReady, setSdkReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [cvv, setCvv] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    loadMercadoPagoSdk()
      .then(() => setSdkReady(true))
      .catch(() => toast.error("Não foi possível carregar o formulário de pagamento. Recarregue a página."));
  }, []);

  const ok = numero.replace(/\D/g, "").length >= 13 && nome.trim() && mes && ano && cvv.length >= 3 && cpf.replace(/\D/g, "").length === 11;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ok || !sdkReady || !window.MercadoPago) return;
    setSubmitting(true);
    try {
      const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
      const token = await mp.createCardToken({
        cardNumber: numero.replace(/\D/g, ""),
        cardholderName: nome,
        cardExpirationMonth: mes,
        cardExpirationYear: ano,
        securityCode: cvv,
        identificationType: "CPF",
        identificationNumber: cpf.replace(/\D/g, ""),
      });

      const bandeira = token.payment_method_id ?? "";
      const ultimosDigitos = token.last_four_digits ?? numero.replace(/\D/g, "").slice(-4);

      const { error } = await salvarCartao(token.id, ultimosDigitos, bandeira);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Cartão cadastrado.");
      navigate({ to: "/home" });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível validar o cartão. Confira os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cartao) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-gold bg-gold/10">
          <CreditCard className="size-8 text-gold" />
        </div>
        <h1 className="mt-6 font-display text-3xl">Cartão cadastrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {cartao.bandeira ?? "Cartão"} terminado em {cartao.ultimosDigitos ?? "----"}
        </p>
        <Button onClick={() => navigate({ to: "/home" })} className="mt-8 w-full max-w-xs">
          Continuar
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-10">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2 text-gold">
          <ShieldCheck className="size-5" />
          <span className="text-[10px] uppercase tracking-[0.3em]">Pagamento obrigatório</span>
        </div>
        <h1 className="mt-3 font-display text-3xl">Cadastre um cartão para dar lances.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Só cobramos se você vencer um leilão. Seus dados são tokenizados diretamente pelo Mercado
          Pago — a Valore nunca armazena o número do seu cartão.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Número do cartão">
            <Input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="0000 0000 0000 0000" inputMode="numeric" />
          </Field>
          <Field label="Nome impresso no cartão">
            <Input value={nome} onChange={(e) => setNome(e.target.value.toUpperCase())} placeholder="NOME COMO NO CARTÃO" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Mês">
              <Input value={mes} onChange={(e) => setMes(e.target.value)} placeholder="MM" inputMode="numeric" maxLength={2} />
            </Field>
            <Field label="Ano">
              <Input value={ano} onChange={(e) => setAno(e.target.value)} placeholder="AAAA" inputMode="numeric" maxLength={4} />
            </Field>
            <Field label="CVV">
              <Input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" inputMode="numeric" maxLength={4} />
            </Field>
          </div>
          <Field label="CPF do titular">
            <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
          </Field>

          <Button type="submit" disabled={!ok || !sdkReady || submitting} className="w-full">
            {submitting ? "Validando…" : "Cadastrar cartão"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
