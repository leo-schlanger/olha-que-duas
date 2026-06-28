import { Link } from "react-router-dom";
import { Plane, Music } from "lucide-react";
import { siteConfig } from "@/config/site";
import tripLogo from "@/assets/olhaqueduas-trip-logo.jpg";

const rir = siteConfig.rockInRio;

const Parceiros = () => {
  return (
    <section id="parceiros" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Olha que Duas Trip Banner */}
        <Link
          to="/viagens"
          className="group block max-w-2xl mx-auto mb-10"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal p-6 md:p-8 border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amarelo/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-vermelho/10 rounded-full blur-3xl" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
              <img
                src={tripLogo}
                alt="Olha que Duas Trip"
                className="h-20 w-20 md:h-24 md:w-24 rounded-xl shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amarelo/10 border border-amarelo/20 mb-2">
                  <Plane className="w-3 h-3 text-amarelo" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amarelo">Viagens</span>
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-cream mb-1 group-hover:text-amarelo transition-colors">
                  Olha que Duas Trip
                </h3>
                <p className="text-sm text-cream/60">
                  Viagens personalizadas, estadias exclusivas e experiências inesquecíveis.
                </p>
              </div>
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-cream/10 group-hover:bg-amarelo/20 transition-colors">
                <Plane className="w-5 h-5 text-cream/60 group-hover:text-amarelo transition-colors" />
              </div>
            </div>
          </div>
        </Link>

        {/* Travel Partners — linkam para /viagens */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-3xl mx-auto mb-16 md:mb-20">
          {siteConfig.travelPartners.map((partner) => (
            <Link
              key={partner.name}
              to="/viagens"
              className="group transition-transform duration-200 hover:scale-105"
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                width={96}
                height={96}
                className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
              />
            </Link>
          ))}
        </div>

        {/* Rock in Rio Lisboa — Card Destaque (permanente) */}
        <Link
          to="/rockinrio"
          className="group block max-w-2xl mx-auto mb-14 md:mb-18"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, hsl(217 85% 25%) 0%, hsl(217 85% 40%) 40%, hsl(0 70% 40%) 80%, hsl(0 70% 30%) 100%)",
              }}
            />

            {/* Animated glow orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute -top-12 -right-12 w-48 h-48 md:w-64 md:h-64 rounded-full blur-3xl animate-rir-glow"
                style={{ background: "radial-gradient(circle, hsla(217,85%,60%,0.3) 0%, transparent 70%)" }}
              />
              <div
                className="absolute -bottom-12 -left-12 w-40 h-40 md:w-56 md:h-56 rounded-full blur-3xl animate-rir-glow"
                style={{
                  background: "radial-gradient(circle, hsla(0,80%,50%,0.25) 0%, transparent 70%)",
                  animationDelay: "1.5s",
                }}
              />
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Logo */}
              <div className="relative shrink-0">
                <div className="absolute -inset-3 rounded-2xl bg-white/10 blur-xl group-hover:bg-white/15 transition-all" />
                <img
                  src={rir.partnerLogo}
                  alt={rir.partnerName}
                  className="relative w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-3">
                  <Music className="w-3 h-3 text-amber-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    Parceiros Oficiais · 2026
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white mb-2 group-hover:text-amber-100 transition-colors">
                  {rir.partnerName}
                </h3>
                <p className="text-sm md:text-base text-white/70 max-w-md">
                  Tivemos o orgulho de ser parceiros oficiais do Rock in Rio
                  Lisboa 2026. Reviva connosco os melhores momentos.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-all border border-white/20">
                <Music className="w-5 h-5 text-white/70 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
          </div>
        </Link>

        {/* General Partners */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="label-sm text-primary mb-3 block">Parceiros</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4">
            Quem <span className="text-gradient-brand">caminha connosco</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Marcas e pessoas que partilham dos nossos valores e propósito.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {siteConfig.partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-200 hover:scale-105"
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                width={128}
                height={128}
                className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Parceiros;
