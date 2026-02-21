import { useState, useRef, useEffect } from "react";
import { Radio, Play, Pause, Volume2, VolumeX, Headphones, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { radio } = siteConfig;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!radio.isLive || !radio.streamUrl) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <section id="radio" className="py-16 md:py-24 lg:py-32 bg-beige-dark text-cream">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="label-sm text-amarelo mb-3 block">Radio</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-cream mb-4">
            Ouve-nos <span className="text-amarelo">agora</span>
          </h2>
          <p className="text-base md:text-lg text-cream/70">
            {radio.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* Player Card */}
          <div>
            <Card className="bg-gradient-to-br from-vermelho to-vermelho-soft border-0 text-cream overflow-hidden">
              <CardContent className="p-5 md:p-6 lg:p-8">
                {/* Audio Element (hidden) */}
                {radio.streamUrl && (
                  <audio ref={audioRef} src={radio.streamUrl} preload="none" />
                )}

                {/* Header with Live Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-amarelo" />
                    <h3 className="text-lg md:text-xl font-display font-semibold">
                      {radio.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-medium text-xs uppercase tracking-wider">
                      No ar
                    </span>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={togglePlay}
                    className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isPlaying
                        ? "bg-amarelo text-charcoal scale-105 shadow-lg shadow-amarelo/30"
                        : "bg-amarelo text-charcoal hover:scale-105 hover:shadow-lg hover:shadow-amarelo/30"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" fill="currentColor" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p className="text-cream font-medium mb-1">
                      {isPlaying ? "A tocar agora" : "Clica para ouvir"}
                    </p>
                    <p className="text-cream/60 text-sm">
                      Streaming 24/7
                    </p>
                  </div>
                </div>

                {/* Audio Visualizer (when playing) */}
                {isPlaying && (
                  <div className="flex items-end justify-start gap-0.5 h-8 mb-6">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-amarelo/80 rounded-full"
                        style={{
                          height: `${20 + Math.random() * 80}%`,
                          animation: `pulse 0.4s ease-in-out infinite`,
                          animationDelay: `${i * 0.03}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-cream/70 hover:text-cream hover:bg-cream/10 h-9 w-9"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-cream/60 w-8 text-right">
                    {isMuted ? 0 : volume}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Quality Card */}
            <Card className="bg-cream/5 border-cream/10">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amarelo/10 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-amarelo" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cream mb-1">
                      Alta Qualidade
                    </h4>
                    <p className="text-xs text-cream/60 leading-relaxed">
                      Streaming em 192kbps para uma experiencia de audio cristalina.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 24/7 Card */}
            <Card className="bg-cream/5 border-cream/10">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amarelo/10 rounded-lg flex items-center justify-center">
                    <Radio className="w-5 h-5 text-amarelo" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cream mb-1">
                      Sempre no Ar
                    </h4>
                    <p className="text-xs text-cream/60 leading-relaxed">
                      24 horas por dia, 7 dias por semana. A tua companhia a qualquer momento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Card */}
            <Card className="bg-cream/5 border-cream/10">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amarelo/10 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-amarelo" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cream mb-1">
                      Conteudo Exclusivo
                    </h4>
                    <p className="text-xs text-cream/60 leading-relaxed">
                      Musica, conversas inspiradoras e muito mais, tudo no mesmo lugar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
