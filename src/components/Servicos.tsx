import { Mic, Megaphone, ShoppingBag, Rocket, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Mic,
    title: "Podcast",
    description:
      "Conversas profundas e empáticas sobre temas que importam — justiça, saúde mental, maternidade, empreendedorismo feminino e cultura.",
    highlight: "Damos voz a quem precisa ser ouvido",
    color: "vermelho" as const,
  },
  {
    icon: Megaphone,
    title: "Assessoria de Imprensa",
    description:
      "Ajudamos marcas e pessoas a contarem as suas histórias com verdade, estratégia e impacto. Da criação de narrativas à gestão de imprensa.",
    highlight: "Comunicação que respeita a essência",
    color: "amarelo" as const,
  },
  {
    icon: ShoppingBag,
    title: "Representação de Marcas",
    description:
      "Atuamos como embaixadoras de marcas internacionais que partilham os nossos valores. Promovemos produtos com alma através de experiências autênticas.",
    highlight: "Eventos e conteúdos criativos",
    color: "vermelho" as const,
  },
  {
    icon: Rocket,
    title: "Promoção de Negócios",
    description:
      "Apoiamos ideias que merecem nascer. Através de mentoria, divulgação e colaboração estratégica, estamos ao lado de quem quer empreender.",
    highlight: "Propósito e coragem",
    color: "amarelo" as const,
  },
];

const Servicos = () => {
  return (
    <section id="servicos" className="section-padding bg-section-alt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="label-sm text-primary mb-4 block">O Que Fazemos</span>
          <h2 className="heading-lg text-foreground mb-6">
            Múltiplas frentes,{" "}
            <span className="text-gradient-brand">um só propósito</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Acreditamos no poder da palavra, da escuta e da estética como ferramentas de transformação.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group border-border hover:border-primary/30 bg-card hover:shadow-elegant transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div 
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      service.color === 'vermelho' 
                        ? 'bg-primary/10 group-hover:bg-primary' 
                        : 'bg-secondary/20 group-hover:bg-secondary'
                    }`}
                  >
                    <service.icon 
                      className={`w-6 h-6 transition-colors duration-300 ${
                        service.color === 'vermelho'
                          ? 'text-primary group-hover:text-white'
                          : 'text-secondary-foreground group-hover:text-charcoal'
                      }`} 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      {service.highlight}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-medium shadow-primary"
          >
            <a href="#contacto" className="inline-flex items-center gap-2">
              Transforma a tua comunicação
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
