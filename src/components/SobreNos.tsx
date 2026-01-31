import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import alexandraImg from "@/assets/alexandra.jpg";
import marluceImg from "@/assets/marluce.jpg";

const founders = [
  {
    name: "Alexandra Serra",
    image: alexandraImg,
    role: "Fundadora Olha que Duas | Diretora de Comunicação e Marketing",
    description:
      "Especialista em marketing e comunicação, com sólida experiência na gestão de redes sociais, equipas e projetos de grande impacto. Atuou como colaboradora e diretora de meios de comunicação. Curadora de eventos culturais, integrando criatividade e estratégia na construção de marcas e narrativas. Alia visão empreendedora à capacidade de impulsionar negócios e desenvolver soluções inovadoras em gestão e comunicação social.",
    initials: "AS",
    imagePosition: "object-cover object-top", // Ajusta para mostrar mais o rosto
  },
  {
    name: "Marluce",
    image: marluceImg,
    role: "Fundadora Olha que Duas | Diretora Executiva",
    description:
      "Background em moda e negócios. Especialista em representação de marcas com propósito e autenticidade.",
    initials: "M",
    imagePosition: "object-cover",
  },
];

const SobreNos = () => {
  return (
    <section id="sobre" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <span className="label-sm text-primary mb-3 block">Quem Somos</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4 md:mb-6">
            Somos duas, mas{" "}
            <span className="text-gradient-brand">multiplicamos</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Nascido da união entre duas mulheres luso-brasileiras com trajetórias
            distintas mas complementares.
          </p>
        </div>

        {/* Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-12 md:mb-16">
          {founders.map((founder) => (
            <Card
              key={founder.name}
              className="border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 mb-4 ring-2 ring-muted">
                    <AvatarImage
                      src={founder.image}
                      alt={founder.name}
                      className={founder.imagePosition}
                    />
                    <AvatarFallback className="text-xl font-display bg-primary/10 text-primary">
                      {founder.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-1">
                    {founder.name}
                  </h3>
                  <span className="text-[10px] md:text-xs text-primary font-medium mb-3 leading-tight">
                    {founder.role}
                  </span>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {founder.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-charcoal rounded-xl md:rounded-2xl p-6 md:p-10 text-center overflow-hidden">
            <blockquote className="relative z-10 text-lg md:text-xl text-white/90 font-display italic leading-relaxed">
              "No centro de tudo, está a nossa amizade, a nossa voz e a nossa
              vontade de fazer diferente."
            </blockquote>
            <div className="relative z-10 mt-6 text-amarelo font-semibold text-sm md:text-base">
              Olha que Duas. Olha bem.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNos;
