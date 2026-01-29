import { Headphones, Play, MessageCircle } from "lucide-react";

const episodes = [
  {
    title: "Empreendedorismo Feminino: Desafios e Conquistas",
    category: "Empreendedorismo",
    duration: "45 min",
  },
  {
    title: "Saúde Mental na Vida Moderna",
    category: "Sociedade",
    duration: "38 min",
  },
  {
    title: "Maternidade Real: Sem Filtros",
    category: "Maternidade",
    duration: "52 min",
  },
];

const categories = ["Justiça", "Saúde Mental", "Maternidade", "Empreendedorismo", "Moda", "Cultura"];

const Podcast = () => {
  return (
    <section id="podcast" className="py-24 bg-foreground text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amarelo/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amarelo font-semibold text-sm uppercase tracking-wider">
            Podcast
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4">
            Conversas que{" "}
            <span className="text-amarelo">importam</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg mt-6">
            Damos voz a quem precisa ser ouvido e criamos pontes entre experiências que merecem ser partilhadas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Episodes List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Headphones className="text-amarelo" />
              Episódios Recentes
            </h3>
            {episodes.map((episode, index) => (
              <div
                key={episode.title}
                className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-primary-foreground/10 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <button className="flex-shrink-0 w-12 h-12 bg-amarelo rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-foreground ml-1" fill="currentColor" />
                  </button>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary-foreground group-hover:text-amarelo transition-colors">
                      {episode.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-primary-foreground/60 mt-1">
                      <span className="bg-primary/30 px-2 py-0.5 rounded-full text-xs">
                        {episode.category}
                      </span>
                      <span>{episode.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Categories */}
            <div className="pt-6">
              <h4 className="text-sm font-semibold text-primary-foreground/60 mb-3">Temas:</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="bg-primary/20 text-primary-foreground/80 px-3 py-1 rounded-full text-sm hover:bg-amarelo hover:text-foreground transition-colors cursor-pointer"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Participate CTA */}
          <div className="bg-gradient-to-br from-primary to-vermelho rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 text-amarelo" />
              <h3 className="text-2xl font-display font-bold">Participa!</h3>
            </div>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              Tens uma história para contar? Queres partilhar a tua experiência no nosso podcast? 
              Envia-nos a tua história e poderás ser o nosso próximo convidado!
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 bg-amarelo text-foreground px-6 py-3 rounded-full font-bold hover:shadow-amarelo transition-all duration-300 hover:scale-105"
            >
              Enviar a Minha História
            </a>

            {/* Platforms */}
            <div className="mt-8 pt-6 border-t border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/60 mb-3">Ouve-nos em:</p>
              <div className="flex gap-4">
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-amarelo transition-colors font-medium">
                  Spotify
                </a>
                <a href="https://podcasts.apple.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-amarelo transition-colors font-medium">
                  Apple Podcasts
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-amarelo transition-colors font-medium">
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;
