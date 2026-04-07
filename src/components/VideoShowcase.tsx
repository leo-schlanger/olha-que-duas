import { useState } from "react";
import { ExternalLink, Play, Mic, Radio, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const highlights = [
  { icon: Mic, label: "Podcast", desc: "Entrevistas com proposito" },
  { icon: Radio, label: "Radio 24h", desc: "Musica e conteudo sem parar" },
  { icon: Users, label: "Comunidade", desc: "Milhares de ouvintes" },
];

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${siteConfig.video.youtubeId}/hqdefault.jpg`;

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Section Header - centered */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                Apresentacao
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-foreground mb-4 leading-tight">
              Conheça o nosso <span className="text-gradient-brand">trabalho</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra como damos voz as historias que merecem ser ouvidas
            </p>
          </div>

          {/* Main content: Video + Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

            {/* Video - takes more space */}
            <div className="lg:col-span-8 order-1">
              <div className="relative group">
                {/* Subtle glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-primary/5 bg-muted">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    {!isPlaying ? (
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
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/25 group-hover/play:bg-black/15 transition-colors duration-300" />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary/30 group-hover/play:scale-110 group-hover/play:bg-primary transition-all duration-300">
                            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white ml-0.5" fill="white" />
                          </div>
                        </div>

                        {/* Title bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white/90 text-sm sm:text-base font-medium">
                            {siteConfig.video.title}
                          </p>
                        </div>
                      </button>
                    ) : (
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

            {/* Sidebar: Highlights + CTA */}
            <div className="lg:col-span-4 order-2 flex flex-col gap-4">
              {/* Highlights cards */}
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/30 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}

              {/* CTA */}
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-medium shadow-lg shadow-primary/10 transition-all mt-1"
              >
                <a
                  href={siteConfig.video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Ver no YouTube
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
