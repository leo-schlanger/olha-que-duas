import { Headphones, Mic, Youtube, Users, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Animated } from "@/components/ui/animated";

// Plataformas onde o podcast está disponível
const platforms = [
  {
    name: "YouTube",
    icon: Youtube,
    url: siteConfig.social.youtube,
    color: "hover:bg-red-500/20 hover:text-red-400",
  },
  {
    name: "Spotify",
    icon: Headphones,
    url: "#", // Adicionar quando disponível
    color: "hover:bg-green-500/20 hover:text-green-400",
    comingSoon: true,
  },
  {
    name: "Apple Podcasts",
    icon: Mic,
    url: "#", // Adicionar quando disponível
    color: "hover:bg-purple-500/20 hover:text-purple-400",
    comingSoon: true,
  },
];

// TODO: Episódios em destaque - descomentar quando houver episódios reais
// const featuredEpisodes = [
//   {
//     title: "Empreendedorismo Feminino em Portugal",
//     description: "Conversamos sobre os desafios e conquistas das mulheres empreendedoras no mercado português.",
//     duration: "45 min",
//     date: "Mar 2026",
//   },
//   {
//     title: "A Força da Comunicação Autêntica",
//     description: "Como construir uma marca pessoal baseada em valores e autenticidade.",
//     duration: "38 min",
//     date: "Mar 2026",
//   },
//   {
//     title: "Networking: Criar Conexões Reais",
//     description: "Estratégias para construir relacionamentos profissionais significativos.",
//     duration: "42 min",
//     date: "Fev 2026",
//   },
// ];

// Benefícios de participar no podcast
const guestBenefits = [
  {
    icon: "mic",
    title: "Partilha a Tua História",
    description: "Um espaço autêntico para contar o teu percurso e inspirar outros.",
  },
  {
    icon: "users",
    title: "Alcança Nova Audiência",
    description: "Conecta-te com uma comunidade engajada e interessada no teu trabalho.",
  },
  {
    icon: "sparkles",
    title: "Fortalece a Tua Marca",
    description: "Posiciona-te como referência na tua área de atuação.",
  },
];

// Perfis que procuramos
const guestProfiles = [
  "Empreendedores com histórias inspiradoras",
  "Pequenos negócios com grandes sonhos",
  "Profissionais de comunicação e marketing",
  "Qualquer pessoa a fazer a diferença",
];

const Podcast = () => {
  return (
    <section
      id="podcast"
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-beige-dark via-charcoal to-beige-dark text-cream relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vermelho/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amarelo/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amarelo/5 to-transparent rounded-full" />

        {/* Sound wave pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5v50M20 15v30M40 15v30M10 25v10M50 25v10' stroke='%23ffffff' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <Animated animation="fade-up" className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amarelo/10 border border-amarelo/20 mb-6">
            <Mic className="w-4 h-4 text-amarelo" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amarelo">
              Podcast
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-cream mb-6 leading-tight">
            Conversas que <span className="text-amarelo">importam</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-cream/60 max-w-xl mx-auto leading-relaxed">
            Damos voz a quem precisa ser ouvido. Histórias inspiradoras de
            empreendedorismo, comunicação e propósito.
          </p>
        </Animated>

        {/* TODO: Stats row - descomentar quando houver dados reais */}
        {/* <Animated animation="fade-up" delay={100} className="flex justify-center gap-8 md:gap-16 mb-14 md:mb-20">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-amarelo">
              <AnimatedCounter value={50} suffix="+" />
            </div>
            <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Episódios</div>
          </div>
          <div className="w-px h-12 bg-cream/10" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-cream">
              <AnimatedCounter value={30} suffix="+" />
            </div>
            <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Convidados</div>
          </div>
          <div className="w-px h-12 bg-cream/10" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-cream">
              <AnimatedCounter value={5} suffix="k+" />
            </div>
            <div className="text-xs text-cream/50 uppercase tracking-wider mt-1">Ouvintes</div>
          </div>
        </Animated> */}

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Guest Invitation Section - Left side */}
          <div className="lg:col-span-3 space-y-6">
            <Animated animation="fade-right">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-display font-semibold text-cream mb-3">
                  Vem Ser o Nosso Próximo <span className="text-amarelo">Convidado</span>
                </h3>
                <p className="text-cream/60 text-base leading-relaxed">
                  Estamos à procura de vozes autênticas para partilhar histórias que inspiram.
                  Se tens uma jornada única, queremos ouvir-te.
                </p>
              </div>
            </Animated>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              {guestBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon === "mic" ? Mic : benefit.icon === "users" ? Users : Sparkles;
                return (
                  <Animated key={benefit.title} animation="fade-up" delay={150 + index * 100}>
                    <div className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amarelo/30 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amarelo/20 to-amarelo/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-amarelo" />
                      </div>
                      <h4 className="text-base font-semibold text-cream mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-cream/50 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </Animated>
                );
              })}
            </div>

            {/* Who We're Looking For */}
            <Animated animation="fade-up" delay={450}>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <h4 className="text-sm font-semibold text-amarelo uppercase tracking-wider mb-4">
                  Quem Procuramos
                </h4>
                <ul className="space-y-3">
                  {guestProfiles.map((profile, index) => (
                    <li key={index} className="flex items-center gap-3 text-cream/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-amarelo flex-shrink-0" />
                      {profile}
                    </li>
                  ))}
                </ul>
              </div>
            </Animated>

            {/* CTA Button */}
            <Animated animation="fade-up" delay={550}>
              <Button
                asChild
                size="lg"
                className="group bg-transparent border-2 border-amarelo text-amarelo hover:bg-amarelo hover:text-charcoal transition-all font-semibold h-12 rounded-xl"
              >
                <a href="#contacto" className="flex items-center gap-2">
                  Quero Participar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </Animated>
          </div>

          {/* Coming Soon Card - Right side */}
          <div className="lg:col-span-2">
            <Animated animation="fade-left" delay={200}>
              <div className="sticky top-28 bg-gradient-to-br from-vermelho via-vermelho to-vermelho-soft rounded-2xl p-6 md:p-8 shadow-2xl shadow-vermelho/30 border border-vermelho-soft/30 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amarelo/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center animate-pulse-glow">
                      <Headphones className="w-6 h-6 text-amarelo" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-amarelo uppercase tracking-wider">
                        Em Breve
                      </span>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                        Novos Episódios
                      </h3>
                    </div>
                  </div>

                  <p className="text-base text-white/80 mb-6 leading-relaxed">
                    Estamos a preparar conversas incríveis com pessoas inspiradoras.
                    Segue-nos para não perderes nenhum episódio!
                  </p>

                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal hover:opacity-90 transition-all font-semibold h-12 rounded-xl shadow-lg shadow-amarelo/30 btn-shine btn-magnetic"
                  >
                    <a
                      href={siteConfig.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Youtube className="w-5 h-5" />
                      Seguir no YouTube
                    </a>
                  </Button>

                  {/* Platforms */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-white/50 mb-4 font-medium uppercase tracking-wider">
                      Disponível em breve:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.filter(p => p.comingSoon).map((platform) => (
                        <div
                          key={platform.name}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl text-sm font-medium text-white/50"
                        >
                          <platform.icon className="w-4 h-4" />
                          {platform.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Animated>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;
