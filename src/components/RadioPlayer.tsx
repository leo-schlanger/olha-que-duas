import { useState, useRef, useEffect } from "react";
import { Radio, Play, Pause, Volume2, VolumeX, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const schedule = [
  { day: "Segunda", show: "Nutrição", times: ["12:00", "19:00"] },
  { day: "Terça", show: "Motivar", times: ["12:00", "19:00"] },
  { day: "Quarta", show: "Prazer Feminino", times: ["21:00", "00:00"] },
  { day: "Quinta", show: "Companheiros de Caminhada", times: ["12:00", "19:00"] },
  { day: "Sexta", show: "Língua Afiada", times: ["12:00", "19:00"] },
  { day: "Sábado", show: "Olha que Duas!", times: ["11:00", "19:00", "00:00"] },
];

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
          <span className="label-sm text-amarelo mb-3 block">Rádio</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-cream mb-4">
            Ouve-nos <span className="text-amarelo">agora</span>
          </h2>
          <p className="text-base md:text-lg text-cream/70">
            {radio.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
          {/* Player Card */}
          <div className="lg:col-span-5">
            <Card className="bg-gradient-to-br from-vermelho to-vermelho-soft border-0 text-cream overflow-hidden sticky top-24">
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
                    className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${isPlaying
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

          {/* Schedule Section */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <Headphones className="w-5 h-5 text-amarelo" />
              <h3 className="text-xl font-display font-semibold text-cream">
                Programação da Semana
              </h3>
            </div>

            <div className="space-y-3">
              {schedule.map((dayPlan) => (
                <div
                  key={dayPlan.day}
                  className="group bg-cream/5 border border-cream/10 rounded-xl p-4 transition-all duration-300 hover:bg-cream/10 hover:border-amarelo/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-amarelo/10 rounded-full flex items-center justify-center text-amarelo font-display font-bold text-sm border border-amarelo/20">
                        {dayPlan.day.substring(0, 3)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-cream group-hover:text-amarelo transition-colors">
                          {dayPlan.show}
                        </h4>
                        <p className="text-xs text-cream/50 mt-0.5">
                          {dayPlan.day}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dayPlan.times.map((time) => (
                        <span
                          key={time}
                          className="px-3 py-1 bg-charcoal/50 border border-cream/10 rounded-full text-[11px] font-medium text-cream/80 group-hover:border-amarelo/20"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-cream/40 text-center italic">
              * Horários sujeitos a alterações sem aviso prévio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
