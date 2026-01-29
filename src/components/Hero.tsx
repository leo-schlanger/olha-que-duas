import { ArrowDown } from "lucide-react";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="min-h-screen bg-hero-gradient relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-amarelo/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amarelo/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="text-primary-foreground space-y-8 animate-fade-up">
            <div className="inline-block bg-amarelo text-foreground px-4 py-2 rounded-full text-sm font-semibold">
              Comunicação • Voz • Negócios
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Olha que Duas:
              <span className="block text-amarelo mt-2">
                Comunicação, Voz e Negócios com Propósito
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-xl leading-relaxed">
              Somos comunicadoras com propósito, estrategas com coração e empreendedoras com visão. 
              O feminino é força, a comunicação é ponte e o afeto é estratégia.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="#servicos"
                className="bg-amarelo text-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-amarelo transition-all duration-300 hover:scale-105"
              >
                Conhecer Serviços
              </a>
              <a
                href="#podcast"
                className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-foreground hover:text-primary transition-all duration-300"
              >
                Ouvir Podcast
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-amarelo/30 rounded-3xl blur-2xl" />
              <img
                src={fotoJuntas}
                alt="Alexandra e Marluce - Olha que Duas"
                className="relative w-full max-w-md rounded-3xl shadow-2xl object-cover aspect-[3/4]"
              />
              <div className="absolute -bottom-4 -right-4 bg-amarelo text-foreground px-6 py-3 rounded-2xl font-bold shadow-lg">
                Olha bem. 👀
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#sobre" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowDown size={32} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
