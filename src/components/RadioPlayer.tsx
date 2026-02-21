import { useState, useRef, useEffect } from "react";
import { Radio, Play, Pause, Volume2, VolumeX, Headphones, Music2 } from "lucide-react";
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
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="label-sm text-amarelo mb-3 block">Ouve-nos agora</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cream mb-4">
            {radio.name}
          </h2>
          <p className="text-base md:text-lg text-cream/70 max-w-2xl mx-auto">
            {radio.tagline}
          </p>
        </div>

        {/* Main Player Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-vermelho/90 via-vermelho to-vermelho-soft rounded-3xl p-8 md:p-12 shadow-2xl shadow-vermelho/30 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_40%)]" />
            </div>

            {/* Audio Element (hidden) */}
            {radio.streamUrl && (
              <audio ref={audioRef} src={radio.streamUrl} preload="none" />
            )}

            <div className="relative z-10">
              {/* Player Content */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Play Button with Animation */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Pulse rings when playing */}
                    {isPlaying && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-amarelo/50 animate-ping" style={{ animationDuration: "2s" }} />
                        <div className="absolute inset-0 rounded-full border-2 border-amarelo/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                      </>
                    )}
                    <Button
                      onClick={togglePlay}
                      className={`w-28 h-28 md:w-36 md:h-36 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? "bg-amarelo hover:bg-amarelo-soft text-charcoal shadow-xl shadow-amarelo/40 scale-100"
                          : "bg-amarelo hover:bg-amarelo-soft text-charcoal shadow-lg shadow-amarelo/30 hover:scale-105"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-12 h-12 md:w-14 md:h-14" fill="currentColor" />
                      ) : (
                        <Play className="w-12 h-12 md:w-14 md:h-14 ml-2" fill="currentColor" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Info & Controls */}
                <div className="flex-1 w-full text-center md:text-left">
                  {/* Live Status */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">
                      No ar
                    </span>
                  </div>

                  {/* Now Playing Info */}
                  <div className="mb-6">
                    <p className="text-cream/80 text-lg md:text-xl font-medium mb-1">
                      {isPlaying ? "A tocar agora" : "Clica para ouvir"}
                    </p>
                    <p className="text-cream/50 text-sm">
                      Streaming 24 horas por dia
                    </p>
                  </div>

                  {/* Audio Visualizer (when playing) */}
                  {isPlaying && (
                    <div className="flex items-end justify-center md:justify-start gap-1 h-10 mb-6">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 md:w-2 bg-amarelo rounded-full"
                          style={{
                            height: `${20 + Math.random() * 80}%`,
                            animation: `pulse 0.5s ease-in-out infinite`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Volume Control */}
                  <div className="flex items-center gap-3 max-w-xs mx-auto md:mx-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-cream/70 hover:text-cream hover:bg-cream/10 h-10 w-10"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-cream/60 w-10 text-right">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center justify-center gap-3 bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-xl p-4">
              <Headphones className="w-5 h-5 text-amarelo" />
              <span className="text-cream/70 text-sm">Streaming de alta qualidade</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-xl p-4">
              <Radio className="w-5 h-5 text-amarelo" />
              <span className="text-cream/70 text-sm">24 horas no ar</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-xl p-4">
              <Music2 className="w-5 h-5 text-amarelo" />
              <span className="text-cream/70 text-sm">Conteudo exclusivo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
