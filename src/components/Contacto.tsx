import { useState } from "react";
import { Mail, Instagram, Facebook, Send, ArrowRight } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
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
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-10 font-medium"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Sidebar */}
          <div className="space-y-4">
            {/* Email Card */}
            <Card className="bg-charcoal text-white border-0">
              <CardContent className="p-4 md:p-5">
                <a
                  href="mailto:olhaqueduas.assessoria@gmail.com"
                  className="flex items-center gap-3 text-white/80 hover:text-amarelo transition-colors"
                >
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-medium">olhaqueduas.assessoria@gmail.com</p>
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
                    href="https://www.instagram.com/olhaqueduas2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/17npXT7nNb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Facebook className="w-4 h-4" />
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
