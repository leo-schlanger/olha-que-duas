import { useState } from "react";
import { ExternalLink, Play, Tv, Mic, Radio, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const highlights = [
  { icon: Mic, label: "Podcast", desc: "Entrevistas com propósito" },
  { icon: Radio, label: "Rádio 24h", desc: "Música e conteúdo sem parar" },
  { icon: Users, label: "Comunidade", desc: "Milhares de ouvintes" },
];

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${siteConfig.video.youtubeId}/hqdefault.jpg`;

  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-vermelho/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-amarelo/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Layout: Two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">

          {/* Left: Content */}
          <div className="lg:col-span-5 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermelho/10 border border-vermelho/20 mb-6">
              <Tv className="w-4 h-4 text-vermelho" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-vermelho">
                Apresentacao
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cream mb-5 leading-tight">
              Conhece o nosso{' '}
              <span className="bg-gradient-to-r from-vermelho to-vermelho-soft bg-clip-text text-transparent">
                trabalho
              </span>
            </h2>

            <p className="text-base md:text-lg text-cream/60 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Descobre como damos voz as historias que merecem ser ouvidas.
              Comunicacao, empreendedorismo e entretenimento com proposito.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-4 mb-8">
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-vermelho" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-cream">{label}</p>
                    <p className="text-xs text-cream/40">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              asChild
              className="bg-vermelho hover:bg-vermelho/90 text-white rounded-xl h-12 px-6 font-medium shadow-lg shadow-vermelho/20 transition-all"
            >
              <a
                href={siteConfig.video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Ver no YouTube
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </Button>
          </div>

          {/* Right: Video */}
          <div className="lg:col-span-7">
            <div className="relative group">
              {/* Glow effect behind */}
              <div className="absolute -inset-3 bg-gradient-to-br from-vermelho/20 via-transparent to-amarelo/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

              {/* Video container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 bg-black">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  {!isPlaying ? (
                    /* Thumbnail with play button */
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 w-full h-full cursor-pointer group/play"
                      aria-label="Reproduzir video"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={siteConfig.video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-105"
                        loading="lazy"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover/play:bg-black/20 transition-colors duration-300" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-vermelho/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-vermelho/30 group-hover/play:scale-110 group-hover/play:bg-vermelho transition-all duration-300">
                          <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                        </div>
                      </div>

                      {/* Video title bar */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white/90 text-sm md:text-base font-medium">
                          {siteConfig.video.title}
                        </p>
                      </div>
                    </button>
                  ) : (
                    /* Actual iframe */
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${siteConfig.video.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                      title={siteConfig.video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
