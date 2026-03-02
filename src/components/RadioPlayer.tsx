import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, Music, Headphones, Radio, Play, Pause, Volume2, VolumeX, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const schedule = [
  { day: "Segunda", show: "Nutrição", times: ["12:00", "19:00"], icon: "nutrition" },
  { day: "Terça", show: "Motivar", times: ["12:00", "19:00"], icon: "motivation" },
  { day: "Quarta", show: "Prazer Feminino", times: ["21:00", "00:00"], icon: "pleasure" },
  { day: "Quinta", show: "Companheiros de Caminhada", times: ["12:00", "19:00"], icon: "walking" },
  { day: "Sexta", show: "Língua Afiada", times: ["12:00", "19:00"], icon: "sharp" },
  { day: "Sábado", show: "Olha que Duas!", times: ["11:00", "19:00", "00:00"], icon: "main" },
];

const radioInfo = [
  {
    title: "Alta Qualidade",
    desc: "Streaming 192kbps cristalino.",
    icon: <Zap className="w-5 h-5 text-amarelo" />,
  },
  {
    title: "Sempre no Ar",
    desc: "A tua companhia 24/7.",
    icon: <ShieldCheck className="w-5 h-5 text-amarelo" />,
  },
  {
    title: "Conteúdo Exclusivo",
    desc: "Música e conversas inspiradoras.",
    icon: <Sparkles className="w-5 h-5 text-amarelo" />,
  },
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

  return (
    <section id="radio" className="py-16 md:py-24 lg:py-32 bg-beige-dark text-cream selection:bg-amarelo selection:text-charcoal">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amarelo/10 border border-amarelo/20 mb-4 animate-fade-in">
            <Radio className="w-3.5 h-3.5 text-amarelo" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amarelo">Radio Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-cream mb-6 tracking-tight">
            A voz que te <span className="text-amarelo italic">acompanha</span>
          </h2>
          <p className="text-lg md:text-xl text-cream/60 max-w-xl mx-auto font-light leading-relaxed">
            {radio.tagline}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">

          {/* Main Player Card - Bento Large */}
          <div className="lg:col-span-2 lg:row-span-2 order-1">
            <Card className="h-full bg-gradient-to-br from-vermelho via-vermelho to-vermelho-dark border-0 text-cream overflow-hidden group relative shadow-2xl shadow-vermelho/20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
              <CardContent className="p-8 md:p-10 lg:p-12 flex flex-col h-full relative z-10">
                {radio.streamUrl && <audio ref={audioRef} src={radio.streamUrl} preload="none" />}

                <div className="flex items-center justify-between mb-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                      <Music className="w-6 h-6 text-amarelo" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight">
                        {radio.name}
                      </h3>
                      <p className="text-xs text-white/50 font-medium tracking-wide">AO VIVO • 192KBPS</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-bold text-[10px] uppercase tracking-tighter">Live</span>
                  </div>
                </div>

                <div className="my-12 text-center">
                  <button
                    onClick={togglePlay}
                    className={`group/play w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-500 relative ${isPlaying
                        ? "bg-white text-vermelho scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                        : "bg-amarelo text-charcoal hover:scale-110 hover:shadow-[0_0_50px_rgba(244,180,0,0.4)]"
                      }`}
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow opacity-0 group-hover/play:opacity-100 transition-opacity"></div>
                    {isPlaying ? (
                      <Pause className="w-10 h-10 md:w-14 md:h-14" fill="currentColor" />
                    ) : (
                      <Play className="w-10 h-10 md:w-14 md:h-14 ml-2" fill="currentColor" />
                    )}
                  </button>
                  <p className="mt-8 text-lg font-medium tracking-wide text-white animate-pulse">
                    {isPlaying ? "Sintonizado" : "Sintoniza agora"}
                  </p>
                </div>

                {/* Modern Visualizer */}
                <div className="flex items-end justify-center gap-1.5 h-16 mb-10 overflow-hidden">
                  {[...Array(isPlaying ? 32 : 12)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-amarelo to-white transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-20 max-h-[4px]'}`}
                      style={{
                        height: isPlaying ? `${30 + Math.random() * 70}%` : '4px',
                        animation: isPlaying ? `pulse 0.6s ease-in-out infinite` : 'none',
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4 px-6 py-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 shrink-0"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono font-bold text-white/60 w-8 text-right">
                    {isMuted ? 'OFF' : `${volume}%`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Card - Bento Tall */}
          <div className="lg:col-span-2 lg:row-span-2 order-2 md:order-3 lg:order-2 self-stretch">
            <Card className="h-full bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream overflow-hidden flex flex-col shadow-xl">
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-cream/10 bg-cream/5">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amarelo" />
                  <h3 className="text-xl font-display font-bold">Programação</h3>
                </div>
                <div className="px-2 py-0.5 rounded bg-amarelo/20 text-amarelo text-[10px] font-bold uppercase">Semanal</div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {schedule.map((dayPlan, idx) => (
                  <div
                    key={dayPlan.day}
                    className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 hover:bg-cream/10 relative overflow-hidden active:scale-[0.98]"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="relative z-10 flex-shrink-0 w-11 h-11 rounded-xl bg-beige-light border border-cream/10 flex items-center justify-center text-cream font-display font-bold text-sm shadow-lg group-hover:border-amarelo/50 transition-colors">
                      {dayPlan.day.substring(0, 3)}
                    </div>

                    <div className="relative z-10 flex-1 min-w-0">
                      <h4 className="font-bold text-base text-cream group-hover:text-amarelo transition-colors line-clamp-1">
                        {dayPlan.show}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {dayPlan.times.map((time) => (
                          <div key={time} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 border border-white/5 text-[10px] font-bold text-cream/70 group-hover:border-amarelo/20">
                            <Clock className="w-3 h-3 text-amarelo/60" />
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subtle accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amarelo rounded-full opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-cream/5 border-t border-cream/10 text-center">
                <p className="text-[10px] text-cream/30 italic uppercase tracking-wider font-medium">
                  * Horários em GMT/Lisboa
                </p>
              </div>
            </Card>
          </div>

          {/* Info Cards - Bento Small Units */}
          {radioInfo.map((info, i) => (
            <div key={info.title} className="order-3 md:order-2 lg:order-3">
              <Card className="h-full bg-cream/5 backdrop-blur-sm border border-cream/10 hover:border-amarelo/30 transition-all duration-300 group cursor-default shadow-md">
                <CardContent className="p-6 md:p-8 flex items-center md:flex-col lg:items-start lg:flex-row gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-beige-light rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-cream mb-1 group-hover:text-amarelo transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-xs text-cream/50 leading-relaxed font-light">
                      {info.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* CTA Footer Card - Bento Small */}
          <div className="lg:col-span-1 order-4">
            <Card className="h-full bg-amarelo border-0 text-charcoal hover:brightness-105 transition-all duration-300 shadow-xl overflow-hidden group cursor-pointer active:scale-95">
              <div className="h-full p-6 md:p-8 flex flex-col justify-center items-center text-center relative">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-charcoal/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <Headphones className="w-8 h-8 mb-3 group-hover:animate-bounce" />
                <h4 className="text-sm font-bold uppercase tracking-tighter">Estúdio 24h</h4>
                <p className="text-[10px] font-medium opacity-60 mt-1 italic">Voz e Propósito</p>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
