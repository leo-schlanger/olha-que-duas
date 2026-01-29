import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen bg-hero-gradient overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-vermelho/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amarelo/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen pt-28 pb-16">
          {/* Content */}
          <div className="text-white space-y-8 animate-fade-up">
            <span className="label-sm text-white/60">
              Comunicação • Voz • Negócios
            </span>
            
            <h1 className="heading-xl text-white leading-[1.1]">
              Onde o feminino é força, a comunicação é ponte e o afeto é{" "}
              <span className="text-amarelo">estratégia</span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-xl leading-relaxed font-light">
              Somos comunicadoras com propósito, estrategas com coração e 
              empreendedoras com visão. O Olha que Duas é um espaço de escuta, 
              criação e ação.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-charcoal hover:bg-white/90 font-medium text-base h-12 px-8"
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
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-base h-12 px-8"
              >
                <a href="#podcast">Ouvir Podcast</a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative max-w-md w-full">
              {/* Image frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={fotoJuntas}
                  alt="Alexandra e Marluce - Olha que Duas"
                  className="w-full aspect-[4/5] object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-amarelo text-charcoal px-5 py-3 rounded-xl font-display text-lg font-semibold shadow-elegant">
                Olha bem. 👀
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <a 
            href="#sobre" 
            className="flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Explorar</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
