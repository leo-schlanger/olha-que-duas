import { useState, useRef, useEffect } from "react";
import {
  Calendar, Clock, Music, Radio, Play, Pause,
  Volume2, VolumeX, Sparkles, Zap, ShieldCheck,
  Apple, Target, Heart, Footprints, MessageSquare, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useSchedule } from "@/hooks/useSchedule";

// Ícones fallback por nome de programa
const FALLBACK_ICONS: Record<string, React.ReactNode> = {
  'Nutrição': <Apple className="w-4 h-4" />,
  'Motivar': <Target className="w-4 h-4" />,
  'Prazer Feminino': <Heart className="w-4 h-4" />,
  'Companheiros de Caminhada': <Footprints className="w-4 h-4" />,
  'Dizem que...': <MessageSquare className="w-4 h-4" />,
  'Olha que Duas!': <Users className="w-4 h-4" />,
};

const radioInfo = [
  {
    title: "Alta Qualidade",
    desc: "192kbps cristalino.",
    icon: <Zap className="w-4 h-4 text-amarelo" />,
  },
  {
    title: "Sempre no Ar",
    desc: "Companhia 24/7.",
    icon: <ShieldCheck className="w-4 h-4 text-amarelo" />,
  },
  {
    title: "Conteúdo Exclusivo",
    desc: "Música e conversas.",
    icon: <Sparkles className="w-4 h-4 text-amarelo" />,
  },
];

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { schedule, loading } = useSchedule();
  const { radio } = siteConfig;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!radio.isLive || !radio.streamUrl) return;
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) setIsMuted(false);
  };

  const renderIcon = (show: string, iconUrl: string) => {
    // Se tem URL de ícone válida, usa a imagem
    if (iconUrl && !iconUrl.includes('placehold.co')) {
      return (
        <img
          src={iconUrl}
          alt={show}
          className="w-5 h-5 object-contain"
        />
      );
    }
    // Senão, usa o ícone fallback
    return FALLBACK_ICONS[show] || <Radio className="w-4 h-4" />;
  };

  return (
    <section id="radio" className="py-12 md:py-20 bg-beige-dark text-cream selection:bg-amarelo selection:text-charcoal">
      <div className="container mx-auto px-4">
        {/* Header Compact */}
        <div className="mb-10 text-left md:text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amarelo/10 border border-amarelo/20 mb-4">
            <Radio className="w-3.5 h-3.5 text-amarelo" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amarelo">Radio Experience</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-semibold mb-4">
            Sintoniza a tua <span className="text-amarelo">inspiração</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-stretch">

          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-vermelho via-vermelho to-vermelho-dark border-0 text-cream shadow-xl overflow-hidden relative group h-full">
              <div className="absolute inset-0 bg-black/10 opacity-50 group-hover:opacity-30 transition-opacity"></div>
              <CardContent className="p-8 flex flex-col h-full relative z-10">
                {radio.streamUrl && <audio ref={audioRef} src={radio.streamUrl} preload="none" />}

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                      <Music className="w-5 h-5 text-amarelo" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight">{radio.name}</h3>
                      <p className="text-[10px] text-white/50 tracking-widest">LIVE STREAM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Live</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center my-6">
                  <button
                    onClick={togglePlay}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isPlaying
                      ? "bg-white text-vermelho scale-105"
                      : "bg-amarelo text-charcoal hover:scale-110"
                      }`}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
                  </button>
                  <p className="mt-6 text-sm font-medium tracking-wide opacity-80">
                    {isPlaying ? "Ouvindo agora..." : "Clique para ouvir"}
                  </p>
                </div>

                {/* Compact Visualizer */}
                <div className="flex items-end justify-center gap-1 h-8 mb-8">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white/30 rounded-full"
                      style={{
                        height: isPlaying ? `${30 + Math.random() * 70}%` : '4px',
                        animation: isPlaying ? `pulse 0.5s ease-in-out infinite` : 'none',
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Slider value={[isMuted ? 0 : volume]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Balanced Schedule */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream h-full overflow-hidden shadow-lg">
              <div className="p-6 border-b border-cream/10 bg-cream/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amarelo" />
                  <h3 className="text-lg font-display font-bold">Programação Semanal</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cream/10">
                {loading ? (
                  <div className="col-span-2 p-8 text-center text-cream/50">
                    Carregando programação...
                  </div>
                ) : (
                  schedule.map((item) => (
                    <div key={`${item.day}-${item.show}`} className="bg-beige-dark/40 p-5 hover:bg-cream/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-beige-light border border-cream/10 flex items-center justify-center text-amarelo group-hover:scale-110 transition-transform overflow-hidden">
                          {renderIcon(item.show, item.iconUrl)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm truncate">{item.show}</h4>
                            <span className="text-[10px] text-cream/40 font-medium uppercase tracking-wider">{item.day}</span>
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {item.times.map(time => (
                              <span key={time} className="flex items-center gap-1 text-[10px] font-mono text-cream/60 bg-black/20 px-2 py-0.5 rounded border border-white/5">
                                <Clock className="w-3 h-3 text-amarelo/50" />
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Integrated Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {radioInfo.map((info) => (
                <div key={info.title} className="p-4 rounded-xl bg-cream/5 border border-cream/10 flex items-center gap-3 hover:bg-cream/10 transition-all group">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-beige-light flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold truncate group-hover:text-amarelo transition-colors">{info.title}</h5>
                    <p className="text-[10px] text-cream/40 truncate">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
