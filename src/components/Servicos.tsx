import { Mic, Megaphone, ShoppingBag, Rocket } from "lucide-react";

const services = [
  {
    icon: Mic,
    title: "Podcast",
    description:
      "Um canal de conversa profunda, provocadora e empática sobre temas que importam — justiça, saúde mental, maternidade, empreendedorismo feminino, cultura e muito mais.",
    highlight: "Damos voz a quem precisa ser ouvido",
  },
  {
    icon: Megaphone,
    title: "Assessoria de Imprensa",
    description:
      "Ajudamos marcas, projetos e pessoas a contarem as suas histórias com verdade, estratégia e impacto. Da criação de narrativas à gestão de imprensa.",
    highlight: "Comunicação que respeita a essência",
  },
  {
    icon: ShoppingBag,
    title: "Representação de Marcas",
    description:
      "Atuamos como embaixadoras e vendedoras de marcas internacionais que partilham os nossos valores. Promovemos produtos com alma.",
    highlight: "Experiências autênticas e eventos criativos",
  },
  {
    icon: Rocket,
    title: "Promoção de Negócios",
    description:
      "Apoiamos ideias que merecem nascer. Seja através de mentoria, divulgação ou colaboração estratégica, estamos ao lado de quem quer empreender.",
    highlight: "Propósito e coragem",
  },
];

const Servicos = () => {
  return (
    <section id="servicos" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            O Que Fazemos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4">
            Múltiplas frentes,{" "}
            <span className="text-gradient-brand">um só propósito</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-6">
            Acreditamos no poder da palavra, da escuta e da estética como ferramentas de transformação.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <span className="inline-block text-sm font-semibold text-primary">
                    {service.highlight} →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-vermelho transition-all duration-300 hover:scale-105"
          >
            Transforma a tua comunicação connosco
          </a>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
