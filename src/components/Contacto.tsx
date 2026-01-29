import { useState } from "react";
import { Mail, Phone, Instagram, Facebook, Send } from "lucide-react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacto" className="py-24 bg-warm-gradient">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4">
            Fala <span className="text-gradient-brand">Conosco</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-6">
            Queres trabalhar connosco ou tens uma ideia para partilhar? Estamos aqui para ouvir!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 md:p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="O teu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="o.teu@email.com"
                />
              </div>

              <div>
                <label htmlFor="assunto" className="block text-sm font-medium text-foreground mb-2">
                  Assunto
                </label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="">Seleciona um assunto</option>
                  <option value="podcast">Participar no Podcast</option>
                  <option value="assessoria">Assessoria de Imprensa</option>
                  <option value="marcas">Representação de Marcas</option>
                  <option value="negocios">Promoção de Negócios</option>
                  <option value="outro">Outro Assunto</option>
                </select>
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-foreground mb-2">
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  placeholder="Conta-nos mais sobre o teu projeto ou ideia..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-vermelho transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar Mensagem
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="bg-primary rounded-3xl p-8 text-primary-foreground">
              <h3 className="text-xl font-display font-bold mb-6">Informações de Contacto</h3>
              <div className="space-y-4">
                <a
                  href="mailto:olhaqueduas@email.com"
                  className="flex items-center gap-4 hover:text-amarelo transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/70">Email</p>
                    <p className="font-medium">olhaqueduas@email.com</p>
                  </div>
                </a>
                <a
                  href="tel:+351000000000"
                  className="flex items-center gap-4 hover:text-amarelo transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/70">Telefone</p>
                    <p className="font-medium">+351 000 000 000</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-display font-bold text-foreground mb-6">
                Segue-nos nas Redes
              </h3>
              <div className="flex gap-4">
              <a
                href="https://www.instagram.com/olhaqueduas2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/share/17npXT7nNb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
              >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-amarelo rounded-3xl p-8">
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                Recebe Novidades e Convites
              </h3>
              <p className="text-foreground/70 mb-4">
                Inscreve-te na nossa newsletter para não perderes nada!
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="O teu email"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <button className="bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:bg-foreground/90 transition-colors">
                  Subscrever
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
