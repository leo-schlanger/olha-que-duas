import alexandraImg from "@/assets/alexandra.jpg";
import marluceImg from "@/assets/marluce.jpg";

const founders = [
  {
    name: "Alexandra Serra",
    image: alexandraImg,
    role: "Co-Fundadora",
    description:
      "Jornalista e comunicadora luso-brasileira com vasta experiência em assessoria de imprensa e estratégias de comunicação. Apaixonada por dar voz a histórias que precisam ser contadas.",
  },
  {
    name: "Marluce",
    image: marluceImg,
    role: "Co-Fundadora",
    description:
      "Empreendedora e criativa com background em moda e negócios. Especialista em representação de marcas e promoção de novos negócios com propósito e autenticidade.",
  },
];

const SobreNos = () => {
  return (
    <section id="sobre" className="py-24 bg-warm-gradient">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Quem Somos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4">
            Somos duas, mas{" "}
            <span className="text-gradient-brand">multiplicamos ideias</span> e impacto
          </h2>
          <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
            Nascido da união entre duas mulheres luso-brasileiras com trajetórias distintas 
            mas complementares, o Olha que Duas reúne jornalismo, criatividade, moda, 
            justiça social e empreendedorismo num só lugar.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <div
              key={founder.name}
              className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-amarelo/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="relative w-32 h-32 rounded-2xl object-cover mx-auto ring-4 ring-primary/10"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {founder.name}
                </h3>
                <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mt-2">
                  {founder.role}
                </span>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {founder.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-primary rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <blockquote className="text-primary-foreground text-xl md:text-2xl font-display italic leading-relaxed">
            "No centro de tudo, está a nossa amizade, a nossa voz e a nossa vontade de fazer diferente. 
            O Olha que Duas é um espaço de escuta, criação e ação."
          </blockquote>
          <div className="mt-6 text-amarelo font-bold text-lg">
            Olha que Duas. Olha bem. Porque estamos aqui para ficar.
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNos;
