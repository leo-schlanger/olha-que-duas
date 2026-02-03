import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const VideoShowcase = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-10">
            <span className="label-sm text-primary mb-3 block">Apresentação</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-foreground mb-3">
              Conheça o nosso <span className="text-gradient-brand">trabalho</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Descobre como damos voz às histórias que merecem ser ouvidas
            </p>
          </div>

          {/* Video Container */}
          <Card className="overflow-hidden border-border/50 shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${siteConfig.video.youtubeId}?rel=0&modestbranding=1`}
                title={siteConfig.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Card>

          {/* CTA Button */}
          <div className="flex justify-center mt-6">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary hover:text-white transition-all group"
            >
              <a
                href={siteConfig.video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Assistir no YouTube
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
