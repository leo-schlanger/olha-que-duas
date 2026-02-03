import { useState } from "react";
import { Mail, Instagram, Facebook, Youtube, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        // Only include the message in the "body" of the email to keep it clean
        Mensagem: formData.mensagem,

        // Metadata fields for FormSubmit
        _subject: `Novo contacto de ${formData.nome} - ${formData.assunto || "Geral"}`,
        _replyto: formData.email, // Allows replying directly to the sender
        _template: "box", // "box" is usually cleaner than "table"
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
      console.error("Erro ao enviar:", error);
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
    <section id="contacto" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="label-sm text-primary mb-3 block">Contacto</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4">
            Fala <span className="text-gradient-brand">Conosco</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Queres trabalhar connosco? Estamos aqui para ouvir!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardContent className="p-5 md:p-6">
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
            <Card className="bg-amarelo border-0">
              <CardContent className="p-4 md:p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-1">
                  Newsletter
                </h3>
                <p className="text-charcoal/60 text-xs mb-3">
                  Recebe novidades e convites exclusivos.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="O teu email"
                    className="bg-white border-0 h-9 text-sm"
                  />
                  <Button
                    size="icon"
                    className="bg-charcoal text-white hover:bg-charcoal/90 shrink-0 h-9 w-9"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
