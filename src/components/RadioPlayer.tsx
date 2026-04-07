import { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar, Clock, Music, Radio, Play, Pause,
  Volume2, VolumeX, Sparkles, Zap, ShieldCheck,
  Apple, Target, Heart, Footprints, MessageSquare, Users, ChevronRight,
  Sun, Sunset, Moon, CloudMoon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useSchedule } from "@/hooks/useSchedule";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { useDailySchedule, getCurrentPeriod } from "@/hooks/useDailySchedule";
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

// Mapping period key → icon
const PERIOD_ICONS: Record<string, typeof Sun> = {
  manha: Sun,
  tarde: Sunset,
  noite: Moon,
  madrugada: CloudMoon,
};

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { schedule, loading } = useSchedule();
  const { data: dailySchedule } = useDailySchedule();
  const { radio } = siteConfig;
  const { song, isMusic, isLiveShow, liveShowName } = useNowPlaying(radio.streamUrl);
  const currentPeriod = getCurrentPeriod();

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
    const fallback = FALLBACK_ICONS[show] || <Radio className="w-full h-full p-1.5" />;
    // Se tem URL de ícone válida, usa a imagem com fallback
    if (iconUrl && !iconUrl.includes('placehold.co')) {
      return (
        <img
          src={iconUrl}
          alt={show}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      );
    }
    return fallback;
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-start">

          <div className="lg:col-span-4 flex flex-col lg:sticky lg:top-24">
            <Card className="bg-gradient-to-br from-vermelho via-vermelho to-vermelho-dark border-0 text-cream shadow-2xl overflow-hidden relative group">
              {/* Album art background blur */}
              {isMusic && song?.art && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={song.art}
                    alt=""
                    className="w-full h-full object-cover scale-150 blur-3xl opacity-30 transition-all duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
                    <div className={`w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border-2 border-white/10 transition-all duration-300 ${isPlaying ? 'scale-100' : 'scale-95 opacity-90'}`}>
                      {isMusic && song?.art ? (
                        <img
                          src={song.art}
                          alt={`${song.title} - ${song.artist}`}
                          className="w-full h-full object-cover transition-all duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center p-4">
                          <img src={radioLogo} alt={radio.name} className="w-full h-full object-contain opacity-70" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                      {/* Play/Pause overlay */}
                      <button
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pausar rádio" : "Ouvir rádio"}
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
                  <div className="mt-6 text-center w-full min-w-0 px-2">
                    {isLiveShow ? (
                      <>
                        <p className="text-base font-display font-bold truncate" title={liveShowName}>{liveShowName}</p>
                        <p className="text-sm opacity-60 mt-1">Programa ao Vivo</p>
                      </>
                    ) : isMusic && song ? (
                      <>
                        <p className="text-lg font-display font-bold truncate" title={song.title}>{song.title}</p>
                        <p className="text-sm opacity-60 truncate mt-1" title={song.artist}>{song.artist}</p>
                        {song.album && <p className="text-xs opacity-40 truncate mt-0.5" title={song.album}>{song.album}</p>}
                      </>
                    ) : (
                      <>
                        <p className="text-base font-display font-bold truncate">{radio.name}</p>
                        <p className="text-sm opacity-60 mt-1 truncate">
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
                      className="h-11 w-11 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label={isMuted || volume === 0 ? "Ativar som" : "Silenciar"}
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

          {/* Schedule Section */}
          <div className="lg:col-span-8 flex flex-col gap-5">

            {/* Daily Schedule - A Tua Soundtrack Do Dia (priority: what's on now) */}
            <Card className="bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream overflow-hidden shadow-lg">
              <div className="p-4 pb-3 border-b border-cream/10 bg-cream/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="w-4 h-4 text-amarelo" />
                    <h3 className="text-lg font-display font-bold">A Tua Soundtrack do Dia</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-amarelo uppercase tracking-widest">24H Non-Stop</span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(dailySchedule || []).map((block) => {
                    const isCurrent = currentPeriod === block.period;
                    const Icon = PERIOD_ICONS[block.period] || Music;
                    return (
                      <div
                        key={block.period}
                        className={`relative rounded-xl p-3.5 transition-all duration-300 border ${
                          isCurrent
                            ? 'bg-gradient-to-br from-vermelho/20 to-amarelo/10 border-amarelo/30 shadow-lg shadow-amarelo/5'
                            : 'bg-cream/5 border-cream/5 hover:border-cream/10 hover:bg-cream/8'
                        }`}
                      >
                        {isCurrent && (
                          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amarelo/20 border border-amarelo/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amarelo animate-pulse" />
                            <span className="text-[9px] font-bold text-amarelo uppercase">Agora</span>
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-3 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isCurrent ? 'bg-amarelo/20 text-amarelo' : 'bg-cream/10 text-cream/50'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-sm font-display font-bold ${isCurrent ? 'text-amarelo' : 'text-cream'}`}>
                              {block.label}
                            </span>
                            <span className="text-[10px] text-cream/40 ml-1.5">{block.range}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {block.slots.map((slot) => (
                            <div key={slot.time} className="flex items-center gap-2.5 min-w-0">
                              <span className={`text-xs font-mono w-10 shrink-0 ${isCurrent ? 'text-amarelo/80' : 'text-cream/40'}`}>
                                {slot.time}
                              </span>
                              <span className="text-sm text-cream/80 truncate" title={slot.name}>{slot.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Weekly Schedule */}
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
              <div className="p-4 max-h-[420px] overflow-y-auto scrollbar-hide">
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
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-display font-bold text-base text-cream group-hover:text-amarelo transition-colors truncate" title={item.show}>
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
                    Selecione um dia para ver a programação
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
