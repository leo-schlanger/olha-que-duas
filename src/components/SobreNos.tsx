import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import alexandraImg from "@/assets/alexandra.jpg";
import marluceImg from "@/assets/marluce.jpg";

const founders = [
  {
    name: "Alexandra Serra",
    image: alexandraImg,
    role: "Jornalista & Comunicadora",
    description:
      "Luso-brasileira com vasta experiência em assessoria de imprensa e estratégias de comunicação. Apaixonada por dar voz a histórias que precisam ser contadas.",
    initials: "AS",
  },
  {
    name: "Marluce",
    image: marluceImg,
    role: "Empreendedora & Criativa",
    description:
      "Background em moda e negócios. Especialista em representação de marcas e promoção de novos negócios com propósito e autenticidade.",
    initials: "M",
  },
];

const SobreNos = () => {
  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="label-sm text-primary mb-4 block">Quem Somos</span>
          <h2 className="heading-lg text-foreground mb-6">
            Somos duas, mas{" "}
            <span className="text-gradient-brand">multiplicamos</span> ideias e impacto
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Nascido da união entre duas mulheres luso-brasileiras com trajetórias 
            distintas mas complementares, o Olha que Duas reúne jornalismo, 
            criatividade, moda, justiça social e empreendedorismo.
          </p>
        </div>

        {/* Founders */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 md:mb-20">
          {founders.map((founder, index) => (
            <div
              key={founder.name}
              className="group bg-card p-8 rounded-xl border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-28 h-28 mb-6 ring-4 ring-muted">
                  <AvatarImage src={founder.image} alt={founder.name} className="object-cover" />
                  <AvatarFallback className="text-2xl font-display bg-primary/10 text-primary">
                    {founder.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                  {founder.name}
                </h3>
                <Badge variant="secondary" className="mb-4 font-normal">
                  {founder.role}
                </Badge>
                <p className="text-muted-foreground leading-relaxed">
                  {founder.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-charcoal rounded-2xl p-10 md:p-14 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-vermelho/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amarelo/10 rounded-full blur-2xl" />
            
            <blockquote className="relative z-10 text-xl md:text-2xl text-white/90 font-display italic leading-relaxed">
              "No centro de tudo, está a nossa amizade, a nossa voz e a nossa vontade 
              de fazer diferente. O Olha que Duas é um espaço de escuta, criação e ação."
            </blockquote>
            <div className="relative z-10 mt-8 text-amarelo font-semibold text-lg">
              Olha que Duas. Olha bem.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNos;
