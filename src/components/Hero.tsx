import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen bg-hero-gradient overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orb */}
        <div className="absolute top-1/4 -right-32 w-64 md:w-[500px] h-64 md:h-[500px] bg-vermelho/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        {/* Secondary accent orb */}
        <div className="absolute bottom-1/4 -left-20 w-48 md:w-80 h-48 md:h-80 bg-amarelo/8 rounded-full blur-3xl" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen pt-24 pb-20 md:pt-28 md:pb-16">
          {/* Content - Mobile first, stacks on top */}
          <div className="text-cream space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Enhanced label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/5 border border-cream/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amarelo animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-cream/70">
                Comunicação • Voz • Negócios
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold leading-[1.1] tracking-tight">
              Onde a força, a comunicação é ponte e o afeto é{" "}
              <span className="text-amarelo relative">
                estratégia
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amarelo/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-cream/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Somos comunicadoras com propósito, estrategas com coração e
              empreendedoras com visão.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="btn-primary-glow font-medium h-12 md:h-14 px-6 md:px-8 text-base border-none rounded-xl"
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
                className="border-cream/30 bg-cream/5 text-cream hover:bg-cream/10 hover:border-cream/50 font-medium h-12 md:h-14 px-6 md:px-8 text-base rounded-xl backdrop-blur-sm"
              >
                <a href="#radio" className="inline-flex items-center gap-2">
                  <Play className="w-4 h-4" fill="currentColor" />
                  Ouvir Rádio
                </a>
              </Button>
            </div>

            {/* Social proof / stats */}
            <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-display font-bold text-amarelo">24/7</div>
                <div className="text-[10px] text-cream/50 uppercase tracking-wider">No Ar</div>
              </div>
              <div className="w-px h-10 bg-cream/10" />
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-display font-bold text-cream">6+</div>
                <div className="text-[10px] text-cream/50 uppercase tracking-wider">Programas</div>
              </div>
              <div className="w-px h-10 bg-cream/10" />
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-display font-bold text-cream">2</div>
                <div className="text-[10px] text-cream/50 uppercase tracking-wider">Fundadoras</div>
              </div>
            </div>
          </div>

          {/* Image - Enhanced with decorative frame */}
          <div className="relative flex justify-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="relative w-full">
              {/* Decorative frame behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-vermelho/20 via-transparent to-amarelo/20 rounded-3xl blur-xl" />
              <div className="absolute -inset-2 border border-cream/10 rounded-2xl" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                <img
                  src={fotoJuntas}
                  alt="Alexandra e Marluce - Olha que Duas"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              </div>

              {/* Enhanced floating badge */}
              <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal px-5 py-3 sm:px-6 sm:py-4 rounded-2xl font-display text-lg sm:text-xl font-bold shadow-xl shadow-amarelo/25 border border-amarelo-soft/50">
                <span className="relative">
                  Olha bem.
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-vermelho rounded-full" />
                </span>
              </div>

              {/* Small decorative element */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-vermelho/80 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-cream ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2">
          <a
            href="#sobre"
            className="group flex flex-col items-center gap-2 text-cream/40 hover:text-cream/70 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-widest font-medium">Explorar</span>
            <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5">
              <div className="w-1 h-2 bg-current rounded-full animate-bounce" style={{ animationDuration: '1.5s' }} />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
