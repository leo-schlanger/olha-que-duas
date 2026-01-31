import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen bg-hero-gradient overflow-hidden">
      {/* Decorative gradient orb - simplified */}
      <div className="absolute top-1/4 -right-32 w-64 md:w-96 h-64 md:h-96 bg-vermelho/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen pt-24 pb-20 md:pt-28 md:pb-16">
          {/* Content - Mobile first, stacks on top */}
          <div className="text-cream space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <span className="label-sm text-cream/50 block">
              Comunicação • Voz • Negócios
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold leading-tight">
              Onde a força, a comunicação é ponte e o afeto é{" "}
              <span className="text-amarelo">estratégia</span>
            </h1>

            <p className="text-base md:text-lg text-cream/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Somos comunicadoras com propósito, estrategas com coração e
              empreendedoras com visão.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-cream text-charcoal hover:bg-cream/90 font-medium h-11 md:h-12 px-6 md:px-8"
              >
                <a href="#servicos" className="inline-flex items-center gap-2">
                  Conhecer Serviços
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-cream/60 bg-cream/10 text-cream hover:bg-cream/20 hover:border-cream font-medium h-11 md:h-12 px-6 md:px-8"
              >
                <a href="#podcast">Ouvir Podcast</a>
              </Button>
            </div>
          </div>

          {/* Image - Shows first on mobile */}
          <div className="relative flex justify-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="relative w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={fotoJuntas}
                  alt="Alexandra e Marluce - Olha que Duas"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 left-4 sm:-bottom-4 sm:-left-4 bg-amarelo text-charcoal px-4 py-2 sm:px-5 sm:py-3 rounded-xl font-display text-base sm:text-lg font-semibold shadow-lg">
                Olha bem.
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2">
          <a
            href="#sobre"
            className="flex flex-col items-center gap-1 text-cream/30 hover:text-cream/60 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-widest">Explorar</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
