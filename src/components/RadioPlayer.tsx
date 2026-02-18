import { useState, useRef, useEffect } from "react";
import { Radio, Play, Pause, Volume2, VolumeX, Waves, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
    <section id="radio" className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-charcoal via-charcoal to-beige-dark overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-vermelho/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amarelo/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Coming Soon Banner */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="relative bg-gradient-to-r from-vermelho via-vermelho-soft to-vermelho rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl shadow-vermelho/20 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_40%)]" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              {/* Icon/Visual */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-amarelo rounded-full flex items-center justify-center shadow-lg shadow-amarelo/30">
                    <Radio className="w-12 h-12 md:w-16 md:h-16 text-charcoal" />
                  </div>
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-amarelo/50 animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="absolute inset-0 rounded-full border-2 border-amarelo/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-amarelo/20 text-amarelo px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>Novidade</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-cream mb-4">
                  Em breve, <span className="text-amarelo">24/7</span> no ar!
                </h2>

                <p className="text-base md:text-lg text-cream/90 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Estamos a preparar a nossa <strong className="text-amarelo">rádio online</strong> para estar contigo a qualquer hora do dia!
                  Música, conversas inspiradoras e muito mais, tudo no mesmo lugar.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="flex items-center gap-2 text-cream/70 text-sm">
                    <Waves className="w-4 h-4 text-amarelo" />
                    <span>Streaming contínuo</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream/70 text-sm">
                    <Radio className="w-4 h-4 text-amarelo" />
                    <span>Conteúdo exclusivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radio Player Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="label-sm text-amarelo mb-3 block">Rádio</span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-cream mb-2">
              {radio.name}
            </h3>
            <p className="text-sm md:text-base text-cream/60">{radio.tagline}</p>
          </div>

          {/* Player Card */}
          <div className="bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-6 md:p-8">
            {/* Audio Element (hidden) */}
            {radio.streamUrl && (
              <audio ref={audioRef} src={radio.streamUrl} preload="none" />
            )}

            {/* Player Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Play Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={togglePlay}
                  disabled={!radio.isLive}
                  className={`w-20 h-20 rounded-full transition-all duration-300 ${
                    radio.isLive
                      ? "bg-amarelo hover:bg-amarelo-soft text-charcoal shadow-lg shadow-amarelo/30 hover:scale-105"
                      : "bg-cream/20 text-cream/50 cursor-not-allowed"
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  )}
                </Button>
              </div>

              {/* Status & Volume */}
              <div className="flex-1 w-full">
                {/* Status */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                  {radio.isLive ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">
                        No ar
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cream/30"></span>
                      </span>
                      <span className="text-cream/50 font-semibold text-sm uppercase tracking-wider">
                        Em breve
                      </span>
                    </>
                  )}
                </div>

                {/* Visualizer placeholder (when live) */}
                {radio.isLive && isPlaying && (
                  <div className="flex items-end justify-center sm:justify-start gap-1 h-8 mb-4">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-amarelo rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "0.5s",
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
                    disabled={!radio.isLive}
                    className="text-cream/70 hover:text-cream hover:bg-cream/10 h-8 w-8"
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
                    disabled={!radio.isLive}
                    className="flex-1"
                  />
                  <span className="text-xs text-cream/50 w-8 text-right">
                    {isMuted ? 0 : volume}%
                  </span>
                </div>
              </div>
            </div>

            {/* Info message when offline */}
            {!radio.isLive && (
              <div className="mt-6 pt-6 border-t border-cream/10 text-center">
                <p className="text-sm text-cream/60">
                  A nossa rádio ainda não está no ar. Fica atento às nossas redes sociais para saberes quando vamos lançar!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
