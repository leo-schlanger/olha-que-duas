import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import alexandraImg from "@/assets/alexandra.jpg";
import marluceImg from "@/assets/marluce.jpg";
import leoImg from "@/assets/leo.png";

const founders = [
  {
    name: "Alexandra Serra",
    image: alexandraImg,
    role: "Fundadora Olha que Duas | Diretora",
    description:
      "Especialista em marketing e comunicação, com sólida experiência na gestão de redes sociais, equipas e projetos de grande impacto. Atuou como colaboradora e diretora de meios de comunicação. Curadora de eventos culturais, integrando criatividade e estratégia na construção de marcas e narrativas. Alia visão empreendedora à capacidade de impulsionar negócios e desenvolver soluções inovadoras em gestão e comunicação social.",
    initials: "AS",
    imagePosition: "object-cover object-top", // Ajusta para mostrar mais o rosto
  },
  {
    name: "Marluce Revoredo",
    image: marluceImg,
    role: "Fundadora Olha que Duas | Diretora",
    description:
      "Empresária de relações públicas com uma carreira marcada por parcerias com alguns dos nomes mais influentes da publicidade em Portugal. Com forte ligação aos meios de comunicação social, construiu uma reputação sólida na gestão de imagem, networking estratégico e comunicação de alto impacto. Com experiência no universo da moda como fashion advisor, destacou-se também na produção de eventos e no lançamento de novos talentos através da Marluce Produções, onde impulsiona carreiras e cria projetos que unem criatividade, visibilidade e estratégia.",
    initials: "MR",
    imagePosition: "object-cover",
  },
];

const team = [
  {
    name: "Leo Schlanger",
    image: leoImg,
    role: "Diretor/CTO | Coordenador de Presença Digital",
    description:
      "Desenvolvedor de software sénior com expertise em cibersegurança e infraestrutura. Apaixonado por automações e tecnologias Web3, é o responsável por toda a vertente tecnológica do projeto, garantindo soluções robustas, seguras e inovadoras que sustentam a presença digital do Olha que Duas.",
    initials: "LS",
    imagePosition: "object-cover",
  },
];

const SobreNos = () => {
  return (
    <section id="sobre" className="py-20 md:py-28 lg:py-36 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-64 h-64 bg-amarelo/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-48 h-48 bg-vermelho/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header - Enhanced */}
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Quem Somos
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-5 leading-tight">
            Somos duas, mas{" "}
            <span className="text-gradient-brand">multiplicamos</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Nascido da união entre duas mulheres luso-brasileiras com trajetórias
            distintas mas complementares.
          </p>
        </div>

        {/* Founders - Enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16 md:mb-20">
          {founders.map((founder) => (
            <Card
              key={founder.name}
              className="group border-border/30 bg-card/80 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="absolute -inset-2 bg-gradient-to-br from-vermelho/20 to-amarelo/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Avatar className="relative w-24 h-24 md:w-28 md:h-28 ring-4 ring-muted/50 group-hover:ring-primary/20 transition-all shadow-lg">
                      <AvatarImage
                        src={founder.image}
                        alt={founder.name}
                        className={founder.imagePosition}
                      />
                      <AvatarFallback className="text-2xl font-display bg-primary/10 text-primary">
                        {founder.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {founder.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs text-primary font-semibold mb-4 px-3 py-1 bg-primary/5 rounded-full">
                    {founder.role}
                  </span>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {founder.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-secondary-foreground">
              A Nossa Equipa
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-foreground">
            Quem nos <span className="text-gradient-brand">apoia</span>
          </h3>
        </div>

        <div className="flex justify-center mb-16 md:mb-20">
          {team.map((member) => (
            <Card
              key={member.name}
              className="group border-border/30 bg-card/80 backdrop-blur-sm hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 max-w-md"
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="absolute -inset-2 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Avatar className="relative w-24 h-24 md:w-28 md:h-28 ring-4 ring-muted/50 group-hover:ring-secondary/20 transition-all shadow-lg">
                      <AvatarImage
                        src={member.image}
                        alt={member.name}
                        className={member.imagePosition}
                      />
                      <AvatarFallback className="text-2xl font-display bg-secondary/10 text-secondary-foreground">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs text-secondary-foreground font-semibold mb-4 px-3 py-1 bg-secondary/10 rounded-full">
                    {member.role}
                  </span>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement - Enhanced */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-beige-dark via-beige-dark to-charcoal rounded-2xl md:rounded-3xl p-8 md:p-12 text-center overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-vermelho/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-amarelo/10 rounded-full blur-3xl" />
            <div className="absolute top-4 left-4 text-6xl md:text-8xl text-cream/5 font-display">"</div>
            <div className="absolute bottom-4 right-4 text-6xl md:text-8xl text-cream/5 font-display rotate-180">"</div>

            <blockquote className="relative z-10 text-xl md:text-2xl lg:text-3xl text-cream font-display italic leading-relaxed mb-6">
              No centro de tudo, está a nossa amizade, a nossa voz e a nossa
              vontade de fazer diferente.
            </blockquote>
            <div className="relative z-10 inline-flex items-center gap-3 px-5 py-2 bg-amarelo/10 rounded-full border border-amarelo/20">
              <span className="w-2 h-2 rounded-full bg-amarelo" />
              <span className="text-amarelo font-display font-semibold text-base md:text-lg">
                Olha que Duas. Olha bem.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNos;
