import { MessageCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const platforms = [
  { name: "YouTube", url: siteConfig.social.youtube },
];

const Podcast = () => {
  return (
    <section id="podcast" className="py-20 md:py-28 lg:py-36 bg-beige-dark text-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-vermelho/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amarelo/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header - Enhanced */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amarelo/10 border border-amarelo/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amarelo animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amarelo">
              Podcast
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-cream mb-5 leading-tight">
            Conversas que <span className="text-amarelo">importam</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-cream/60 max-w-lg mx-auto">
            Damos voz a quem precisa ser ouvido.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Participate CTA - Enhanced */}
          <Card className="bg-gradient-to-br from-vermelho via-vermelho to-vermelho-soft border-0 text-cream shadow-2xl shadow-vermelho/20 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amarelo/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

            <CardContent className="p-6 md:p-8 lg:p-10 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-amarelo" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold">
                  Participa!
                </h3>
              </div>
              <p className="text-base md:text-lg text-cream/80 mb-6 leading-relaxed">
                Tem uma história para contar ou um projeto para destacar? Junte-se a nós e dê mais visibilidade à sua empresa ou evento com os nossos serviços.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal hover:opacity-90 transition-all font-semibold h-12 px-8 rounded-xl shadow-lg shadow-amarelo/20"
                >
                  <a href="#contacto">Enviar História</a>
                </Button>
              </div>

              {/* Platforms */}
              <div className="mt-8 pt-6 border-t border-cream/10">
                <p className="text-xs text-cream/50 mb-3 font-medium uppercase tracking-wider">Ouve-nos em:</p>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-sm font-medium text-cream hover:text-amarelo"
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
    </section>
  );
};

export default Podcast;
