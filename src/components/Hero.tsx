import { useEffect, useState, useRef } from "react";
import { ArrowRight, Play, Mic, Radio, Video, Sparkles, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax APENAS em desktop (lg+). Em mobile o scroll listener causa:
  //  1. Re-renders a cada frame → jank
  //  2. Interação com a address bar do Chrome Android que muda viewport
  //  3. Layout shifts visíveis ao fazer scroll-up manual
  // Em mobile scrollY fica em 0 → transforms estáticos → zero re-renders.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    if (!mql.matches) return; // mobile/tablet → sem parallax

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          if (rect.bottom > 0) {
            setScrollY(window.scrollY * 0.3);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Trigger entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-dvh bg-hero-gradient overflow-hidden"
    >
      {/* Animated background with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orb - parallax */}
        <div
          className="absolute top-1/4 -right-32 w-64 md:w-[600px] h-64 md:h-[600px] rounded-full blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(180,41,43,0.15) 0%, transparent 70%)",
            transform: `translateY(${scrollY * 0.5}px)`,
            animationDuration: "4s",
          }}
        />

        {/* Secondary accent orb - parallax opposite */}
        <div
          className="absolute bottom-1/4 -left-20 w-48 md:w-96 h-48 md:h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
            transform: `translateY(${-scrollY * 0.3}px)`,
          }}
        />

        {/* Floating particles */}
        <div
          className="absolute top-1/3 left-1/4 w-3 h-3 bg-amarelo/40 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-2 h-2 bg-vermelho/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-amarelo/20 rounded-full animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-2/3 right-1/4 w-2 h-2 bg-vermelho/20 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amarelo/50 to-transparent animate-shimmer" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(30 20% 35%) 1px, transparent 0)",
            backgroundSize: "50px 50px",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-dvh pt-40 pb-20 md:pt-36 md:pb-16">
          {/* Content - Mobile first, stacks on top */}
          <div className="text-charcoal space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Enhanced animated label */}
            <div
              className={`flex flex-wrap items-center gap-2 justify-center lg:justify-start transition-all duration-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-dark">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amarelo" />
                  <Mic className="w-3.5 h-3.5 text-vermelho-soft" />
                  <Video className="w-3.5 h-3.5 text-amarelo" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-cream/80">
                  Comunicação • Voz • Negócios
                </span>
                <span className="flex items-center gap-1.5 pl-2 border-l border-cream/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-medium">AO VIVO</span>
                </span>
              </div>

              {/* Mini-chip do app Android — discreto, não compete com os CTAs */}
              <a
                href="#app"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/5 border border-charcoal/15 hover:bg-charcoal/10 hover:border-charcoal/30 transition-all group"
              >
                <Smartphone className="w-3 h-3 text-vermelho group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal">
                  App Android
                </span>
              </a>
            </div>

            {/* Animated headline */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold leading-[1.1] tracking-tight transition-all duration-700 delay-150 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Onde a força é propósito, a comunicação é ponte e o afeto é{" "}
              <span className="text-vermelho relative inline-block group">
                <span className="relative z-10">estratégia</span>
                <span
                  className={`absolute inset-x-0 -bottom-1 h-3 bg-vermelho/20 -skew-x-3 transition-transform duration-500 origin-left ${
                    isLoaded ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transitionDelay: "800ms" }}
                />
                <Sparkles className="absolute -top-2 -right-4 w-5 h-5 text-vermelho animate-pulse" />
              </span>
            </h1>

            {/* Animated description */}
            <p
              className={`text-base md:text-lg lg:text-xl text-charcoal/70 max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-700 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Somos comunicadoras com propósito, estrategas com coração e
              empreendedoras com visão. Damos voz ao empreendedorismo.
            </p>

            {/* Animated buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start transition-all duration-700 delay-[450ms] ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                asChild
                size="lg"
                className="btn-primary-glow btn-shine btn-magnetic font-medium h-12 md:h-14 px-6 md:px-8 text-base border-none rounded-xl group"
              >
                <a href="#servicos" className="inline-flex items-center gap-2">
                  Conhecer Serviços
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-charcoal/30 bg-charcoal/5 text-charcoal hover:bg-charcoal/10 hover:border-charcoal/50 font-medium h-12 md:h-14 px-6 md:px-8 text-base rounded-xl backdrop-blur-sm btn-magnetic group"
              >
                <a href="#radio" className="inline-flex items-center gap-2">
                  <Play className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" />
                  Ouvir Rádio
                </a>
              </Button>
            </div>

            {/* Live indicator */}
            <div
              className={`flex items-center gap-3 pt-6 justify-center lg:justify-start transition-all duration-700 delay-[600ms] ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-2 bg-charcoal/5 backdrop-blur-sm px-4 py-2 rounded-full border border-charcoal/10 group cursor-default">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-2xl md:text-3xl font-display font-bold text-vermelho group-hover:scale-105 transition-transform">
                  24/7
                </span>
                <span className="text-sm text-charcoal/60 font-medium">No Ar</span>
              </div>
            </div>
          </div>

          {/* Image - Enhanced with 3D effects */}
          <div
            className={`relative flex justify-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-all duration-1000 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            <div className="relative w-full group">
              {/* Animated glow behind image */}
              <div
                className="absolute -inset-6 rounded-3xl blur-2xl transition-all duration-500 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(180,41,43,0.3) 0%, rgba(255,215,0,0.2) 100%)",
                  transform: `translateY(${scrollY * 0.1}px)`,
                }}
              />

              {/* Rotating border ring */}
              <div className="absolute -inset-3 rounded-2xl border border-charcoal/10 animate-rotate-slow opacity-50" />

              {/* Main image container with 3D tilt on hover */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 card-3d">
                <img
                  src={fotoJuntas}
                  alt="Alexandra e Marluce - Fundadoras do Olha que Duas"
                  width={1024}
                  height={1536}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />

                {/* Shimmer overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>

              {/* Enhanced floating badge with animation */}
              <div
                className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 animate-float-slow"
                style={{ animationDuration: "5s" }}
              >
                <div className="bg-gradient-to-r from-amarelo to-amarelo-soft text-charcoal px-5 py-3 sm:px-6 sm:py-4 rounded-2xl font-display text-lg sm:text-xl font-bold shadow-xl shadow-amarelo/30 border border-amarelo-soft/50 btn-magnetic">
                  <span className="relative flex items-center gap-2">
                    Olha bem.
                    <span className="w-2 h-2 bg-vermelho rounded-full animate-pulse" />
                  </span>
                </div>
              </div>

              {/* Play button with pulse glow */}
              <div className="absolute -top-3 -right-3 animate-bounce-soft" style={{ animationDuration: "3s" }}>
                <a
                  href="#radio"
                  className="w-14 h-14 bg-vermelho rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow btn-magnetic"
                >
                  <Play className="w-6 h-6 text-cream ml-0.5" fill="currentColor" />
                </a>
              </div>

              {/* Media type badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-amarelo" />
                  <span className="text-[10px] font-semibold text-cream uppercase">Rádio</span>
                </div>
                <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Mic className="w-3 h-3 text-vermelho-soft" />
                  <span className="text-[10px] font-semibold text-cream uppercase">Podcast</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div
          className={`absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 transition-all duration-700 delay-[800ms] ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="#sobre"
            className="group flex flex-col items-center gap-2 text-charcoal/40 hover:text-charcoal/70 transition-all duration-300"
          >
            <span className="text-[10px] uppercase tracking-widest font-medium">Explorar</span>
            <div className="w-7 h-11 rounded-full border-2 border-current flex items-start justify-center p-2 group-hover:border-vermelho/50 transition-colors">
              <div
                className="w-1.5 h-3 bg-current rounded-full animate-bounce group-hover:bg-vermelho"
                style={{ animationDuration: "1.5s" }}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
