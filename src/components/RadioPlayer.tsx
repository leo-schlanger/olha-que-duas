import { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar, Clock, Music, Radio, Play, Pause,
  Volume2, VolumeX, Sparkles, Zap, ShieldCheck,
  Apple, Target, Heart, Footprints, MessageSquare, Users, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useSchedule } from "@/hooks/useSchedule";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import radioLogo from "@/assets/logo-olha-que-duas.png";

// Ícones fallback por nome de programa
const FALLBACK_ICONS: Record<string, React.ReactNode> = {
  'Nutrição': <Apple className="w-full h-full p-1.5" />,
  'Motivar': <Target className="w-full h-full p-1.5" />,
  'Prazer Feminino': <Heart className="w-full h-full p-1.5" />,
  'Companheiros de Caminhada': <Footprints className="w-full h-full p-1.5" />,
  'Dizem que...': <MessageSquare className="w-full h-full p-1.5" />,
  'Olha que Duas!': <Users className="w-full h-full p-1.5" />,
};

const DAYS_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DAYS_SHORT: Record<string, string> = {
  'Segunda': 'Seg',
  'Terça': 'Ter',
  'Quarta': 'Qua',
  'Quinta': 'Qui',
  'Sexta': 'Sex',
  'Sábado': 'Sáb',
  'Domingo': 'Dom',
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { schedule, loading } = useSchedule();
  const { radio } = siteConfig;
  const { song, isMusic, isLiveShow, liveShowName } = useNowPlaying(radio.streamUrl);

  // Agrupar programação por dia
  const scheduleByDay = useMemo(() => {
    const grouped: Record<string, typeof schedule> = {};
    for (const item of schedule) {
      if (!grouped[item.day]) {
        grouped[item.day] = [];
      }
      grouped[item.day].push(item);
    }
    return grouped;
  }, [schedule]);

  // Dias disponíveis ordenados
  const availableDays = useMemo(() => {
    return DAYS_ORDER.filter(day => scheduleByDay[day]?.length > 0);
  }, [scheduleByDay]);

  // Selecionar dia atual por padrão
  useEffect(() => {
    if (availableDays.length > 0 && !selectedDay) {
      const today = new Date().getDay();
      const todayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][today];
      if (availableDays.includes(todayName)) {
        setSelectedDay(todayName);
      } else {
        setSelectedDay(availableDays[0]);
      }
    }
  }, [availableDays]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!radio.isLive || !radio.streamUrl) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch {
          // Browser blocked autoplay — user interaction required
          setIsPlaying(false);
        }
      }
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
          className="w-full h-full object-cover rounded-md"
        />
      );
    }
    // Senão, usa o ícone fallback
    return FALLBACK_ICONS[show] || <Radio className="w-full h-full p-1.5" />;
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

          <div className="lg:col-span-4 flex flex-col">
            <Card className="bg-gradient-to-br from-vermelho via-vermelho to-vermelho-dark border-0 text-cream shadow-2xl overflow-hidden relative group h-full">
              {/* Album art background blur */}
              {isMusic && song?.art && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={song.art}
                    alt=""
                    className="w-full h-full object-cover scale-150 blur-3xl opacity-30 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-vermelho/80 via-vermelho/70 to-vermelho-dark/90" />
                </div>
              )}
              {/* Decorative background elements (fallback when no art) */}
              {!(isMusic && song?.art) && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-amarelo/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 opacity-40 group-hover:opacity-20 transition-opacity duration-500" />

              <CardContent className="p-6 md:p-8 flex flex-col h-full relative z-10">
                {radio.streamUrl && <audio ref={audioRef} src={radio.streamUrl} preload="none" />}

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg">
                      <Music className="w-5 h-5 text-amarelo" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl leading-tight">{radio.name}</h3>
                      <p className="text-[10px] text-white/50 tracking-widest font-medium">LIVE STREAM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wide">Ao Vivo</span>
                  </div>
                </div>

                {/* Album Art + Play Button */}
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div className="relative">
                    {/* Album art disc */}
                    <div className={`w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border-2 border-white/10 transition-all duration-500 ${isPlaying ? 'scale-100' : 'scale-95 opacity-90'}`}>
                      {isMusic && song?.art ? (
                        <img
                          src={song.art}
                          alt={`${song.title} - ${song.artist}`}
                          className="w-full h-full object-cover transition-all duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center p-4">
                          <img src={radioLogo} alt={radio.name} className="w-full h-full object-contain opacity-70" />
                        </div>
                      )}
                      {/* Play/Pause overlay */}
                      <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all duration-300 group/play"
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isPlaying
                            ? 'bg-white/0 group-hover/play:bg-white/90 text-transparent group-hover/play:text-vermelho'
                            : 'bg-white/90 text-vermelho shadow-xl'
                        }`}>
                          {isPlaying
                            ? <Pause className="w-7 h-7" fill="currentColor" />
                            : <Play className="w-7 h-7 ml-0.5" fill="currentColor" />
                          }
                        </div>
                      </button>
                    </div>

                    {/* Equalizer dots around the art */}
                    {isPlaying && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-4">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-full bg-amarelo/70"
                            style={{
                              height: `${20 + Math.random() * 80}%`,
                              animation: `equalizer 0.4s ease-in-out infinite`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Now playing info */}
                  <div className="mt-6 text-center max-w-full px-2">
                    {isLiveShow ? (
                      <>
                        <p className="text-base font-display font-bold">{liveShowName}</p>
                        <p className="text-sm opacity-60 mt-1">Programa ao Vivo</p>
                      </>
                    ) : isMusic && song ? (
                      <>
                        <p className="text-lg font-display font-bold truncate">{song.title}</p>
                        <p className="text-sm opacity-60 truncate mt-1">{song.artist}</p>
                        {song.album && <p className="text-xs opacity-40 truncate mt-0.5">{song.album}</p>}
                      </>
                    ) : (
                      <>
                        <p className="text-base font-display font-bold">{radio.name}</p>
                        <p className="text-sm opacity-60 mt-1">
                          {isPlaying ? radio.tagline : "Clica para ouvir"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Volume control */}
                <div className="pt-5 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-9 w-9 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono text-white/40 w-8 text-right">{isMuted ? 0 : volume}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Section - Redesigned */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <Card className="bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream overflow-hidden shadow-lg">
              {/* Header with day tabs */}
              <div className="border-b border-cream/10 bg-cream/5">
                <div className="p-4 pb-0 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amarelo" />
                  <h3 className="text-lg font-display font-bold">Programação Semanal</h3>
                </div>

                {/* Day tabs */}
                <div className="flex gap-1 px-4 pt-4 pb-0 overflow-x-auto scrollbar-hide">
                  {loading ? (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-9 w-16 bg-cream/10 rounded-t-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    availableDays.map((day) => {
                      const isActive = selectedDay === day;
                      const programCount = scheduleByDay[day]?.length || 0;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`relative px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                            isActive
                              ? 'bg-vermelho text-cream'
                              : 'text-cream/60 hover:text-cream hover:bg-cream/10'
                          }`}
                        >
                          <span className="hidden sm:inline">{day}</span>
                          <span className="sm:hidden">{DAYS_SHORT[day]}</span>
                          {programCount > 1 && (
                            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-cream/20' : 'bg-amarelo/20 text-amarelo'
                            }`}>
                              {programCount}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Programs list for selected day */}
              <div className="p-4">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-20 bg-cream/5 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : selectedDay && scheduleByDay[selectedDay] ? (
                  <div className="space-y-3">
                    {scheduleByDay[selectedDay].map((item, idx) => (
                      <div
                        key={`${item.day}-${item.show}-${idx}`}
                        className="group relative bg-gradient-to-r from-cream/5 to-transparent rounded-xl p-4 hover:from-cream/10 transition-all border border-cream/5 hover:border-cream/10"
                      >
                        <div className="flex items-start gap-4">
                          {/* Program icon */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vermelho/20 to-amarelo/10 border border-cream/10 flex items-center justify-center text-amarelo shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                            {renderIcon(item.show, item.iconUrl)}
                          </div>

                          {/* Program info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-display font-bold text-base text-cream group-hover:text-amarelo transition-colors">
                                  {item.show}
                                </h4>
                                <p className="text-xs text-cream/50 mt-0.5">
                                  {item.times.length} {item.times.length === 1 ? 'exibição' : 'exibições'} neste dia
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-cream/30 group-hover:text-amarelo group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                            </div>

                            {/* Times */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {item.times.map((time, timeIdx) => (
                                <span
                                  key={`${time}-${timeIdx}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cream bg-black/30 px-3 py-1.5 rounded-lg border border-cream/10 group-hover:border-amarelo/20 transition-colors"
                                >
                                  <Clock className="w-3 h-3 text-amarelo" />
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-cream/50">
                    Seleciona um dia para ver a programação
                  </div>
                )}
              </div>
            </Card>

            {/* Info Cards - Compact horizontal */}
            <div className="grid grid-cols-3 gap-3">
              {radioInfo.map((info) => (
                <div key={info.title} className="p-3 rounded-xl bg-cream/5 border border-cream/10 text-center hover:bg-cream/10 transition-all group">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-beige-light flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    {info.icon}
                  </div>
                  <h5 className="text-[11px] font-bold group-hover:text-amarelo transition-colors">{info.title}</h5>
                  <p className="text-[9px] text-cream/40 mt-0.5">{info.desc}</p>
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
