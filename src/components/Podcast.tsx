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
    title: "Saúde na Vida Moderna",
    category: "Sociedade",
    duration: "38 min",
  },
];

const categories = [
  "Justiça",
  "Saúde",
  "Empreendedorismo",
  "Cultura",
];

const platforms = [
  { name: "Spotify", url: "https://open.spotify.com" },
  { name: "YouTube", url: "https://youtube.com/@olhaqueduas-l9m?si=hKFnzKpluIODLFFk" },
];

const Podcast = () => {
  return (
    <section id="podcast" className="py-16 md:py-24 lg:py-32 bg-beige-dark text-cream">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="label-sm text-amarelo mb-3 block">Podcast</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-cream mb-4">
            Conversas que <span className="text-amarelo">importam</span>
          </h2>
          <p className="text-base md:text-lg text-cream/70">
            Damos voz a quem precisa ser ouvido.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* Episodes */}
          <div>
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <Headphones className="w-4 h-4 text-amarelo" />
              <h3 className="text-sm font-semibold">Episódios Recentes</h3>
            </div>

            <div className="space-y-3">
              {episodes.map((episode) => (
                <Card
                  key={episode.title}
                  className="bg-cream/5 border-cream/10 cursor-pointer group card-hover-effect"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <button className="flex-shrink-0 w-10 h-10 bg-amarelo rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Play
                          className="w-4 h-4 text-charcoal ml-0.5"
                          fill="currentColor"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-cream group-hover:text-amarelo transition-colors line-clamp-1">
                          {episode.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-cream/60">
                            {episode.category}
                          </span>
                          <span className="text-xs text-cream/30">•</span>
                          <span className="text-xs text-cream/60">
                            {episode.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Categories */}
            <div className="mt-6">
              <p className="text-xs text-cream/60 mb-2">Temas:</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="border-cream/15 text-cream/70 hover:bg-cream/10 text-xs font-normal px-2 py-0.5"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Participate CTA */}
          <div>
            <Card className="bg-gradient-to-br from-vermelho to-vermelho-soft border-0 text-cream">
              <CardContent className="p-5 md:p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-amarelo" />
                  <h3 className="text-lg md:text-xl font-display font-semibold">
                    Participa!
                  </h3>
                </div>
                <p className="text-sm md:text-base text-cream/90 mb-5 leading-relaxed">
                  Tens uma história para contar? Envia-nos e poderás ser o nosso
                  próximo convidado!
                </p>
                <Button
                  asChild
                  className="bg-amarelo text-charcoal hover:bg-amarelo-soft transition-colors font-medium h-10 shadow-lg shadow-black/5"
                >
                  <a href="#contacto">Enviar História</a>
                </Button>

                {/* Platforms */}
                <div className="mt-6 pt-5 border-t border-cream/15">
                  <p className="text-xs text-cream/70 mb-3">Ouve-nos em:</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {platforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cream/70 hover:text-amarelo transition-colors text-xs font-medium"
                      >
                        {platform.name}
                        <ExternalLink className="w-3 h-3" />
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
