import { useState } from "react";
import { Mail, Phone, Instagram, Facebook, Send, ArrowRight } from "lucide-react";
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
    <section id="contacto" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="label-sm text-primary mb-4 block">Contacto</span>
          <h2 className="heading-lg text-foreground mb-6">
            Fala <span className="text-gradient-brand">Conosco</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Queres trabalhar connosco ou tens uma ideia para partilhar? Estamos aqui para ouvir!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-border shadow-soft">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="O teu nome"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="o.teu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assunto">Assunto</Label>
                    <Select
                      value={formData.assunto}
                      onValueChange={(value) => setFormData({ ...formData, assunto: value })}
                    >
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Conta-nos mais sobre o teu projeto ou ideia..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 h-12 font-medium shadow-primary"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card */}
            <Card className="bg-charcoal text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-semibold mb-6">Informações</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:olhaqueduas@email.com"
                    className="flex items-center gap-4 text-white/80 hover:text-amarelo transition-colors"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Email</p>
                      <p className="text-sm font-medium">olhaqueduas@email.com</p>
                    </div>
                  </a>
                  <a
                    href="tel:+351000000000"
                    className="flex items-center gap-4 text-white/80 hover:text-amarelo transition-colors"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Telefone</p>
                      <p className="text-sm font-medium">+351 000 000 000</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4">
                  Segue-nos
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/olhaqueduas2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/17npXT7nNb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-amarelo border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-semibold text-charcoal mb-2">
                  Newsletter
                </h3>
                <p className="text-charcoal/70 text-sm mb-4">
                  Recebe novidades e convites exclusivos.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="O teu email"
                    className="bg-white border-0"
                  />
                  <Button 
                    size="icon"
                    className="bg-charcoal text-white hover:bg-charcoal/90 shrink-0"
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
