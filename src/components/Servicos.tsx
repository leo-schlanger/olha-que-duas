import { Mic, Megaphone, ShoppingBag, Rocket, Radio, Video, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Animated, AnimatedGrid } from "@/components/ui/animated";

const services = [
  {
    icon: Radio,
    title: "Rádio Online 24h",
    description:
      "Transmissão contínua com música, entretenimento e programas exclusivos sobre empreendedorismo feminino.",
    color: "vermelho" as const,
    highlight: true,
  },
  {
    icon: Mic,
    title: "Podcast",
    description:
      "Conversas autênticas sobre justiça, saúde, empreendedorismo e atualidades com convidados inspiradores.",
    color: "amarelo" as const,
  },
  {
    icon: Video,
    title: "Produção de Vídeo",
    description:
      "Criação de conteúdo audiovisual estratégico para redes sociais e plataformas digitais.",
    color: "vermelho" as const,
  },
  {
    icon: Megaphone,
    title: "Assessoria de Imprensa",
    description:
      "Construímos narrativas poderosas que posicionam marcas e pessoas com verdade e impacto.",
    color: "amarelo" as const,
  },
  {
    icon: ShoppingBag,
    title: "Representação de Marcas",
    description:
      "Somos embaixadoras de marcas alinhadas com os nossos valores, criando conexões autênticas.",
    color: "vermelho" as const,
  },
  {
    icon: Rocket,
    title: "Mentoria de Negócios",
    description:
      "Apoiamos empreendedoras através de mentoria estratégica e networking qualificado.",
    color: "amarelo" as const,
  },
];

const Servicos = () => {
  return (
    <section
      id="servicos"
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden"
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-vermelho/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amarelo/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/[0.02] to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <Animated animation="fade-up" className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              O Que Fazemos
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
            Múltiplas frentes,{" "}
            <span className="text-gradient-brand">um só propósito</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Utilizamos o poder da palavra, da escuta e da estética como
            ferramentas de transformação e crescimento.
          </p>
        </Animated>

        {/* Services Grid - 3x2 with enhanced cards */}
        <AnimatedGrid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto mb-14 md:mb-16"
          staggerDelay={100}
          animation="fade-up"
        >
          {services.map((service) => (
            <div
              key={service.title}
              className={`group relative rounded-2xl p-6 md:p-7 transition-all duration-500 card-3d cursor-pointer ${
                service.highlight
                  ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/20"
                  : "bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              }`}
            >
              {/* Highlight badge */}
              {service.highlight && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-amarelo text-charcoal text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Destaque
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${
                  service.highlight
                    ? "bg-white/20"
                    : service.color === "vermelho"
                    ? "bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20"
                    : "bg-gradient-to-br from-amarelo/20 to-amarelo/10 group-hover:from-amarelo/30"
                }`}
              >
                <service.icon
                  className={`w-7 h-7 ${
                    service.highlight
                      ? "text-white"
                      : service.color === "vermelho"
                      ? "text-primary"
                      : "text-amarelo-soft"
                  }`}
                />
              </div>

              {/* Content */}
              <h3
                className={`text-xl font-display font-semibold mb-3 transition-colors ${
                  service.highlight
                    ? "text-white"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm md:text-base leading-relaxed mb-5 ${
                  service.highlight ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {service.description}
              </p>

              {/* CTA Link */}
              <a
                href="#contacto"
                className={`inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3 ${
                  service.highlight
                    ? "text-amarelo hover:text-white"
                    : "text-primary hover:text-primary/80"
                }`}
              >
                Saber mais
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${
                  service.highlight ? "bg-primary/30" : "bg-primary/10"
                }`}
              />
            </div>
          ))}
        </AnimatedGrid>

        {/* CTA */}
        <Animated animation="fade-up" delay={400} className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="btn-primary-glow btn-shine h-13 md:h-14 px-8 md:px-10 text-base font-medium border-none rounded-xl"
            >
              <a href="#contacto" className="inline-flex items-center gap-2">
                Quero Saber Mais
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <span className="text-sm text-muted-foreground">
              ou{" "}
              <a
                href="#radio"
                className="text-primary hover:underline font-medium"
              >
                ouve a nossa rádio
              </a>
            </span>
          </div>
        </Animated>
      </div>
    </section>
  );
};

export default Servicos;
