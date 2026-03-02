import { MessageCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const platforms = [
  { name: "YouTube", url: siteConfig.social.youtube },
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

        <div className="max-w-xl mx-auto">
          {/* Participate CTA */}
          <Card className="bg-gradient-to-br from-vermelho to-vermelho-soft border-0 text-cream">
            <CardContent className="p-5 md:p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-amarelo" />
                <h3 className="text-lg md:text-xl font-display font-semibold">
                  Participa!
                </h3>
              </div>
              <p className="text-sm md:text-base text-cream/90 mb-5 leading-relaxed">
                Tem uma história para contar ou um projeto para destacar? Junte-se a nós e dê mais visibilidade à sua empresa ou evento com os nossos serviços.
              </p>
              <div className="flex justify-center sm:justify-start">
                <Button
                  asChild
                  className="bg-amarelo text-charcoal hover:bg-amarelo-soft transition-colors font-medium h-10 shadow-lg shadow-black/5"
                >
                  <a href="#contacto">Enviar História</a>
                </Button>
              </div>

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
    </section>
  );
};

export default Podcast;
