import { Mic, Megaphone, ShoppingBag, Rocket, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Mic,
    title: "Podcast",
    description:
      "Conversas profundas sobre temas que importam — justiça, saúde, empreendedorismo, atualidades e muito mais.",
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
    <section id="servicos" className="py-20 md:py-28 lg:py-36 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vermelho/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amarelo/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header - Enhanced */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              O Que Fazemos
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-5 leading-tight">
            Múltiplas frentes,{" "}
            <span className="text-gradient-brand">um só propósito</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto">
            O poder da palavra, da escuta e da estética como ferramentas de
            transformação.
          </p>
        </div>

        {/* Services Grid - Enhanced cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto mb-12 md:mb-16">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group border-border/30 bg-card/80 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 md:p-7">
                <div className="flex items-start gap-5">
                  <div
                    className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${service.color === "vermelho"
                      ? "bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 shadow-primary/5"
                      : "bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 group-hover:to-secondary/20 shadow-secondary/5"
                      }`}
                  >
                    <service.icon
                      className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${service.color === "vermelho"
                        ? "text-primary"
                        : "text-secondary-foreground"
                        }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA - Enhanced */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="btn-primary-glow h-12 md:h-14 px-8 md:px-10 text-base font-medium border-none rounded-xl"
          >
            <a href="#contacto" className="inline-flex items-center gap-2">
              Fala Conosco
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Servicos;
