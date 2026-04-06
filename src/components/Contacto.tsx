import { useState } from "react";
import { Mail, Instagram, Facebook, Youtube, Send, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
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

const Contacto = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { signup: signupNewsletter, loading: newsletterLoading } = useNewsletterSignup();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    const result = await signupNewsletter(newsletterEmail);

    if (result.success) {
      toast.success("Inscrição realizada!", {
        description: result.message,
      });
      setNewsletterEmail("");
    } else {
      toast.error("Erro na inscrição", {
        description: result.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        // Dados do remetente
        Nome: formData.nome,
        Email: formData.email,
        Assunto: formData.assunto || "Geral",
        Mensagem: formData.mensagem,

        // Metadata fields for FormSubmit
        _subject: `[Olha que Duas] ${formData.assunto || "Contacto"} - ${formData.nome}`,
        _replyto: formData.email,
        _template: "table",
        _captcha: "false",
      };

      const response = await fetch(`https://formsubmit.co/ajax/${siteConfig.contact.email}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Falha no envio");

      toast.success("Mensagem enviada com sucesso!", {
        description: "Entraremos em contacto brevemente.",
      });

      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
    } catch (error) {
      toast.error("Erro ao enviar mensagem", {
        description: "Por favor tenta novamente ou envia email direto.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacto" className="py-20 md:py-28 lg:py-36 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-secondary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header - Enhanced */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Contacto
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-5 leading-tight">
            Fala <span className="text-gradient-brand">Conosco</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto">
            Queres trabalhar connosco? Estamos aqui para ouvir!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/30 bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/5">
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
                        placeholder="O teu nome"
                        required
                        className="h-10"
                        disabled={isSubmitting}
                      />
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
                        placeholder="o.teu@email.com"
                        required
                        className="h-10"
                        disabled={isSubmitting}
                      />
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
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Seleciona um assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="podcast">Participar no Podcast</SelectItem>
                        <SelectItem value="assessoria">Assessoria de Imprensa</SelectItem>
                        <SelectItem value="marcas">Representação de Marcas</SelectItem>
                        <SelectItem value="negocios">Promoção de Negócios</SelectItem>
                        <SelectItem value="viagens">Viagens - Pedir Orçamento</SelectItem>
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
                      placeholder="Conta-nos mais sobre o teu projeto..."
                      rows={4}
                      required
                      className="resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-10 font-medium"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Sidebar */}
          <div className="space-y-4">
            {/* Email Card */}
            <Card className="bg-beige-dark text-cream border-0">
              <CardContent className="p-4 md:p-5">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-cream/80 hover:text-amarelo transition-colors"
                >
                  <div className="w-9 h-9 bg-cream/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cream/40 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-medium">{siteConfig.contact.email}</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-border/50">
              <CardContent className="p-4 md:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Segue-nos
                </h3>
                <div className="flex gap-2">
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#FF0000] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-amarelo via-amarelo to-amarelo-soft border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardContent className="p-4 md:p-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-charcoal/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-charcoal" />
                  </div>
                  <h3 className="text-sm font-semibold text-charcoal">
                    Newsletter Exclusiva
                  </h3>
                </div>
                <p className="text-charcoal/70 text-xs mb-3 leading-relaxed">
                  Novidades em primeira mão, <span className="font-semibold">descontos exclusivos</span> dos nossos parceiros e promoções especiais.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="O teu email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-white/90 backdrop-blur-sm border-0 h-10 text-sm rounded-xl shadow-sm focus:ring-2 focus:ring-charcoal/20"
                    disabled={newsletterLoading}
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-charcoal text-white hover:bg-charcoal/90 shrink-0 h-10 w-10 rounded-xl shadow-md hover:shadow-lg transition-all"
                    disabled={newsletterLoading}
                  >
                    {newsletterLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
