import { MessageCircle, ExternalLink, Play, Headphones, Clock, TrendingUp, Mic, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Animated, AnimatedCounter } from "@/components/ui/animated";

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

// Episódios em destaque (exemplo - pode ser dinâmico no futuro)
const featuredEpisodes = [
  {
    title: "Empreendedorismo Feminino em Portugal",
    description: "Conversamos sobre os desafios e conquistas das mulheres empreendedoras no mercado português.",
    duration: "45 min",
    date: "Mar 2026",
  },
  {
    title: "A Força da Comunicação Autêntica",
    description: "Como construir uma marca pessoal baseada em valores e autenticidade.",
    duration: "38 min",
    date: "Mar 2026",
  },
  {
    title: "Networking: Criar Conexões Reais",
    description: "Estratégias para construir relacionamentos profissionais significativos.",
    duration: "42 min",
    date: "Fev 2026",
  },
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

        {/* Stats row */}
        <Animated animation="fade-up" delay={100} className="flex justify-center gap-8 md:gap-16 mb-14 md:mb-20">
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
        </Animated>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Featured Episodes - Left side */}
          <div className="lg:col-span-3 space-y-4">
            <Animated animation="fade-right">
              <h3 className="text-lg font-semibold text-cream/80 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amarelo" />
                Episódios em Destaque
              </h3>
            </Animated>

            {featuredEpisodes.map((episode, index) => (
              <Animated key={episode.title} animation="fade-up" delay={150 + index * 100}>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amarelo/30 transition-all duration-300 card-3d"
                >
                  <div className="flex gap-4">
                    {/* Play button */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-vermelho to-vermelho-soft flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-vermelho/30">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-semibold text-cream group-hover:text-amarelo transition-colors line-clamp-1">
                        {episode.title}
                      </h4>
                      <p className="text-sm text-cream/50 mt-1 line-clamp-2">
                        {episode.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-cream/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {episode.duration}
                        </span>
                        <span>{episode.date}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </Animated>
            ))}

            {/* View all link */}
            <Animated animation="fade-up" delay={450}>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-amarelo hover:text-white transition-colors mt-4"
              >
                Ver todos os episódios
                <ExternalLink className="w-4 h-4" />
              </a>
            </Animated>
          </div>

          {/* CTA Card - Right side */}
          <div className="lg:col-span-2">
            <Animated animation="fade-left" delay={200}>
              <div className="sticky top-28 bg-gradient-to-br from-vermelho via-vermelho to-vermelho-soft rounded-2xl p-6 md:p-8 shadow-2xl shadow-vermelho/30 border border-vermelho-soft/30 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amarelo/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center animate-pulse-glow">
                      <MessageCircle className="w-6 h-6 text-amarelo" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                      Participa!
                    </h3>
                  </div>

                  <p className="text-base text-white/80 mb-6 leading-relaxed">
                    Tens uma história inspiradora para contar ou um projeto para destacar?
                    Junta-te a nós e dá voz à tua jornada!
                  </p>

                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal hover:opacity-90 transition-all font-semibold h-12 rounded-xl shadow-lg shadow-amarelo/30 btn-shine btn-magnetic"
                  >
                    <a href="#contacto" className="flex items-center justify-center gap-2">
                      Enviar a Minha História
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>

                  {/* Platforms */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-white/50 mb-4 font-medium uppercase tracking-wider">
                      Ouve-nos em:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <a
                          key={platform.name}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl transition-all text-sm font-medium text-white ${
                            platform.comingSoon
                              ? "opacity-50 cursor-not-allowed"
                              : platform.color
                          }`}
                          onClick={(e) => platform.comingSoon && e.preventDefault()}
                        >
                          <platform.icon className="w-4 h-4" />
                          {platform.name}
                          {platform.comingSoon && (
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">
                              Em breve
                            </span>
                          )}
                        </a>
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
