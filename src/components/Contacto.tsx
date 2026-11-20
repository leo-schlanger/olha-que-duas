import { useEffect, useRef, useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contactFormSchema,
  getFieldErrors,
} from "@/lib/validation";

// Timeout do submit do form de contacto. FormSubmit costuma responder em
// <2s; 10s deixa margem para redes lentas sem bloquear o utilizador para
// sempre se a rede cair a meio.
const CONTACT_SUBMIT_TIMEOUT_MS = 10_000;

/**
 * fetch com timeout via AbortController + 1 retry automático em falhas
 * transitórias (rede caída, 5xx). Erros 4xx não são retentados — são
 * problema do cliente.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { timeoutMs, retries = 1 }: { timeoutMs: number; retries?: number },
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      // 4xx: não retenta (problema do request, não da rede)
      if (response.status >= 400 && response.status < 500) return response;
      // 5xx: retenta se ainda há tentativas
      if (!response.ok && attempt < retries) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      return response;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      if (attempt >= retries) throw err;
    }
  }
  throw lastError ?? new Error("fetch falhou");
}

/**
 * Contact form. `variant="home"` (default): the whole #contacto section.
 * `variant="servicos"`: only the form, for /servicos#fale-connosco (the page
 * owns the heading and the aside); button «Enviar pedido» and a success
 * message in place of the form.
 */
const Contacto = ({ variant = "home" }: { variant?: "home" | "servicos" }) => {
  const embedded = variant === "servicos";
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const sentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const assuntoParam = params.get("assunto");
    if (assuntoParam) {
      setFormData((prev) => ({ ...prev, assunto: assuntoParam }));
    }

    const handleSelectSubject = (e: Event) => {
      const subject = (e as CustomEvent<string>).detail;
      if (subject) {
        setFormData((prev) => ({ ...prev, assunto: subject }));
      }
    };
    window.addEventListener("select-contact-subject", handleSelectSubject);
    return () => window.removeEventListener("select-contact-subject", handleSelectSubject);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validação Zod antes do fetch — feedback inline em vez de só toast
    const parsed = contactFormSchema.safeParse(formData);
    if (!parsed.success) {
      setFieldErrors(getFieldErrors(parsed.error));
      toast.error(embedded ? "Verifique os campos do formulário" : "Verifica os campos do formulário");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    try {
      const data = parsed.data;
      const payload = {
        // Dados do remetente
        Nome: data.nome,
        Email: data.email,
        Assunto: data.assunto || "Geral",
        Mensagem: data.mensagem,

        // Metadata fields for FormSubmit
        _subject: `[Olha que Duas] ${data.assunto || "Contacto"} - ${data.nome}`,
        _replyto: data.email,
        _template: "table",
        _captcha: "false",
      };

      const response = await fetchWithRetry(
        `https://formsubmit.co/ajax/${siteConfig.contact.deliveryEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        },
        { timeoutMs: CONTACT_SUBMIT_TIMEOUT_MS, retries: 1 },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // /servicos shows the success card in place of the form: no toast on top.
      if (!embedded) {
        toast.success("Mensagem enviada com sucesso!", {
          description: "Entraremos em contacto brevemente.",
        });
      }

      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      // /servicos shows the inline alert instead (formal, with the e-mail).
      if (!embedded) {
        toast.error("Erro ao enviar mensagem", {
          description: isAbort
            ? "Tempo limite excedido. Verifica a tua ligação."
            : "Por favor tenta novamente ou envia email direto.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpa o erro deste campo ao editar — feedback imediato
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const formCard = embedded && status === "sent" ? (
    <div ref={sentRef} tabIndex={-1} role="status" className="scroll-mt-32 rounded-2xl bg-white p-6 text-[#2b1a12] shadow-xl md:p-8">
      <p className="font-display text-2xl font-semibold">Pedido enviado. Obrigado!</p>
      <p className="mt-2 text-base text-[#5c4f45]">Respondemos em breve com um orçamento à medida, sem compromisso.</p>
      <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-base font-semibold text-vermelho-forte underline underline-offset-2">
        Enviar outro pedido
      </button>
    </div>
  ) : (
    <Card
      className={embedded
        ? "border-0 bg-white text-[#2b1a12] shadow-xl" // opaque on the dark /servicos band (AA)
        : "border-border/30 bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/5"}
    >
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-sm">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder={embedded ? "O seu nome" : "O teu nome"}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.nome}
                aria-describedby={fieldErrors.nome ? "nome-error" : undefined}
                className="h-12 sm:h-10"
                disabled={isSubmitting}
              />
              {fieldErrors.nome && (
                <p id="nome-error" role="alert" className="text-xs text-destructive mt-1">
                  {fieldErrors.nome}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={embedded ? "o.seu@email.com" : "o.teu@email.com"}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className="h-12 sm:h-10"
                disabled={isSubmitting}
              />
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="text-xs text-destructive mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assunto" className="text-sm">
              Assunto
            </Label>
            <Select
              value={formData.assunto}
              onValueChange={(value) =>
                setFormData({ ...formData, assunto: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-12 sm:h-10">
                <SelectValue placeholder={embedded ? "Selecione um assunto" : "Seleciona um assunto"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultoria">Consultoria de comunicação</SelectItem>
                <SelectItem value="redes">Gestão de redes e conteúdos</SelectItem>
                <SelectItem value="radio">Anúncio na rádio</SelectItem>
                <SelectItem value="video">Vídeo e reels</SelectItem>
                <SelectItem value="dedicatorias">Dedicatória na Rádio - Pedir Orçamento</SelectItem>
                <SelectItem value="dedicatorias-kids">Dedicatória Kids na Rádio - Pedir Orçamento (Pais)</SelectItem>
                <SelectItem value="podcast">Participar no Podcast</SelectItem>
                <SelectItem value="assessoria">Assessoria de Imprensa</SelectItem>
                <SelectItem value="marcas">Representação de Marcas</SelectItem>
                <SelectItem value="negocios">Promoção de Negócios</SelectItem>
                <SelectItem value="outro">Outro Assunto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mensagem" className="text-sm">
              Mensagem
            </Label>
            <Textarea
              id="mensagem"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder={embedded ? "Conte-nos mais sobre o seu negócio…" : "Conta-nos mais sobre o teu projeto..."}
              rows={4}
              required
              aria-required="true"
              aria-invalid={!!fieldErrors.mensagem}
              aria-describedby={fieldErrors.mensagem ? "mensagem-error" : undefined}
              className="resize-none"
              disabled={isSubmitting}
            />
            {fieldErrors.mensagem && (
              <p id="mensagem-error" role="alert" className="text-xs text-destructive mt-1">
                {fieldErrors.mensagem}
              </p>
            )}
          </div>

          {status === "error" && (
            <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg border border-red-700 bg-white p-3 text-sm font-medium text-red-700">
              Não foi possível enviar. Tente de novo ou escreva para {siteConfig.contact.email}.
            </p>
          )}
          <Button
            type="submit"
            className={embedded
              ? "w-full h-[52px] rounded-full bg-vermelho-forte text-lg font-bold text-white hover:bg-vermelho-forte/90"
              : "w-full bg-primary hover:bg-primary/90 h-12 sm:h-10 font-medium"}
            disabled={isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "A enviar..." : embedded ? "Enviar pedido" : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  // Move focus to the success message (servicos) so screen readers hear it.
  useEffect(() => {
    // preventScroll + centre: a plain focus() left the title under the fixed header (qa r3)
    // On error the disabled button had the focus: hand it to the alert.
    if (status === "error") errorRef.current?.focus({ preventScroll: true });
    if (status === "sent") {
      sentRef.current?.focus({ preventScroll: true });
      sentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  if (embedded) return formCard;

  return (
    <section id="contacto" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-secondary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto mb-10 md:mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-vermelho-forte">Fale connosco</p>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-foreground leading-tight">
            Vamos conversar?
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl">
            Dedicatórias, publicidade na rádio ou comunicação para a sua marca: escreva-nos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="min-w-0 lg:col-span-2">
            {formCard}
          </div>

          {/* Aside: services for brands, email, WhatsApp (social and newsletter live in the footer) */}
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl bg-muted/60 p-5">
              <h3 className="text-base font-semibold text-foreground">Comunicação para marcas</h3>
              <p className="mt-1 text-base text-muted-foreground">
                Assessoria de imprensa, publicidade na rádio e estratégia de marca.{" "}
                <a href="/servicos" className="font-semibold text-vermelho-forte underline underline-offset-2">
                  Ver serviços
                </a>
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-3 rounded-2xl bg-muted/60 p-5 transition-colors hover:bg-muted"
            >
              <Mail className="h-5 w-5 shrink-0 text-vermelho-forte" />
              <span className="min-w-0">
                <span className="block text-base font-semibold text-foreground">Email</span>
                <span className="block break-words text-base text-muted-foreground">
                  {siteConfig.contact.email.split("@")[0]}@<wbr />
                  {siteConfig.contact.email.split("@")[1]}
                </span>
              </span>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbC46l1FXUuaCr0kTt0C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-muted/60 p-5 transition-colors hover:bg-muted"
            >
              <svg className="h-5 w-5 shrink-0 text-[#128C4B]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="min-w-0">
                <span className="block text-base font-semibold text-foreground">WhatsApp</span>
                <span className="block text-base text-muted-foreground">Canal com as novidades da rádio</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
