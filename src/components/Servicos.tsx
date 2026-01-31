import { Mic, Megaphone, ShoppingBag, Rocket, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Mic,
    title: "Podcast",
    description:
      "Conversas profundas sobre temas que importam — justiça, saúde mental, maternidade e empreendedorismo.",
    color: "vermelho" as const,
  },
  {
    icon: Megaphone,
    title: "Assessoria de Imprensa",
    description:
      "Ajudamos marcas e pessoas a contarem as suas histórias com verdade e impacto.",
    color: "amarelo" as const,
  },
  {
    icon: ShoppingBag,
    title: "Representação de Marcas",
    description:
      "Embaixadoras de marcas que partilham os nossos valores através de experiências autênticas.",
    color: "vermelho" as const,
  },
  {
    icon: Rocket,
    title: "Promoção de Negócios",
    description:
      "Apoiamos ideias que merecem nascer através de mentoria e colaboração estratégica.",
    color: "amarelo" as const,
  },
];

const Servicos = () => {
  return (
    <section id="servicos" className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="label-sm text-primary mb-3 block">O Que Fazemos</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4">
            Múltiplas frentes,{" "}
            <span className="text-gradient-brand">um só propósito</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            O poder da palavra, da escuta e da estética como ferramentas de
            transformação.
          </p>
        </div>

        {/* Services Grid - Mobile first: 1 col, then 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto mb-10 md:mb-12">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-border/50 bg-card hover:border-border hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center transition-colors ${
                      service.color === "vermelho"
                        ? "bg-primary/10 group-hover:bg-primary/15"
                        : "bg-secondary/20 group-hover:bg-secondary/30"
                    }`}
                  >
                    <service.icon
                      className={`w-5 h-5 ${
                        service.color === "vermelho"
                          ? "text-primary"
                          : "text-secondary-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
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
            className="bg-primary hover:bg-primary/90 h-10 md:h-11 px-6 md:px-8 font-medium"
          >
            <a href="#contacto" className="inline-flex items-center gap-2">
              Fala Conosco
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
