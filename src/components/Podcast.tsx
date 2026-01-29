import { Headphones, Play, MessageCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const platforms = [
  { name: "Spotify", url: "https://open.spotify.com" },
  { name: "Apple Podcasts", url: "https://podcasts.apple.com" },
  { name: "YouTube", url: "https://youtube.com" },
];

const Podcast = () => {
  return (
    <section id="podcast" className="section-padding bg-charcoal text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vermelho/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amarelo/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="label-sm text-amarelo mb-4 block">Podcast</span>
          <h2 className="heading-lg text-white mb-6">
            Conversas que{" "}
            <span className="text-amarelo">importam</span>
          </h2>
          <p className="body-lg text-white/60 max-w-2xl mx-auto">
            Damos voz a quem precisa ser ouvido e criamos pontes entre experiências que merecem ser partilhadas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
          {/* Episodes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Headphones className="w-5 h-5 text-amarelo" />
              <h3 className="text-lg font-semibold">Episódios Recentes</h3>
            </div>

            <div className="space-y-4">
              {episodes.map((episode) => (
                <Card
                  key={episode.title}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <button className="flex-shrink-0 w-12 h-12 bg-amarelo rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-charcoal ml-0.5" fill="currentColor" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-amarelo transition-colors truncate">
                          {episode.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Badge variant="secondary" className="bg-white/10 text-white/70 hover:bg-white/10 font-normal text-xs">
                            {episode.category}
                          </Badge>
                          <span className="text-sm text-white/50">{episode.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Categories */}
            <div className="mt-8">
              <p className="text-sm text-white/50 mb-3">Temas:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-amarelo hover:text-charcoal hover:border-amarelo transition-colors cursor-pointer font-normal"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Participate CTA */}
          <div>
            <Card className="bg-gradient-to-br from-vermelho to-vermelho-soft border-0 text-white overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-7 h-7 text-amarelo" />
                  <h3 className="text-2xl font-display font-semibold">Participa!</h3>
                </div>
                <p className="text-white/85 mb-6 leading-relaxed">
                  Tens uma história para contar? Queres partilhar a tua experiência no nosso podcast? 
                  Envia-nos a tua história e poderás ser o nosso próximo convidado!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-amarelo text-charcoal hover:bg-amarelo/90 font-medium"
                >
                  <a href="#contacto">Enviar a Minha História</a>
                </Button>

                {/* Platforms */}
                <div className="mt-10 pt-6 border-t border-white/20">
                  <p className="text-sm text-white/60 mb-4">Ouve-nos em:</p>
                  <div className="flex flex-wrap gap-3">
                    {platforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white/70 hover:text-amarelo transition-colors text-sm font-medium"
                      >
                        {platform.name}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;
