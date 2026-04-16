import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Music, Radio, Play, Pause,
  Volume2, VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useSchedule } from "@/hooks/useSchedule";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import {
  useDailySchedule,
  getCurrentPeriodFromSchedule,
  getPeriodBoundaries,
} from "@/hooks/useDailySchedule";
import { useClockTick } from "@/hooks/useClockTick";
import WeatherStrip from "@/components/WeatherStrip";
import DailySoundtrackPanel from "@/components/radio/DailySoundtrackPanel";
import WeeklySchedulePanel from "@/components/radio/WeeklySchedulePanel";
import radioLogo from "@/assets/logo-olha-que-duas.png";

// Backoff para tentativas de reconexão após drop do stream (em ms)
const RECONNECT_BACKOFF = [1000, 2000, 4000, 8000, 15000];

// Limite (ms) acima do qual consideramos o buffer do stream como estagnado
// e forçamos um reload. Pauses mais curtos retomam sem destruir o pipeline.
const STALE_BUFFER_MS = 30_000;

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  // Epoch (ms) em que o stream realmente começou a tocar (do evento `playing`).
  // null quando não está a tocar. Usado pelo useNowPlaying para decair o
  // burst do icecast e estimar o offset real do ouvinte.
  const [playingStartedAtMs, setPlayingStartedAtMs] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  // Flag para distinguir pause iniciado pelo utilizador (togglePlay) de
  // pause externo do browser (chamada recebida, perda de foco em mobile,
  // outro app a tomar audio focus). No segundo caso queremos sincronizar
  // o estado para não ficarmos com um botão "pause" sem áudio a sair.
  const userActionRef = useRef(false);
  // Epoch (ms) do último pause. Usado para decidir se ao retomar precisamos
  // de reassinar src + load() (buffer estagnado) ou se basta um play() directo.
  const lastPauseAtRef = useRef<number>(0);

  const { schedule, loading, error: scheduleError } = useSchedule();
  const { data: dailySchedule } = useDailySchedule();
  const { radio } = siteConfig;
  const {
    song, isMusic, isLiveShow, liveShowName,
    isPodcast, podcastName, podcastArt,
    isAnnouncement, announcementName, announcementArt,
  } = useNowPlaying(radio.streamUrl, isPlaying, {
    audioRef,
    playingStartedAtMs,
  });

  // Avisa em dev se o schedule do Supabase falhou (cai no fallback hardcoded)
  useEffect(() => {
    if (scheduleError) {
      console.warn("[RadioPlayer] schedule fetch failed, using fallback:", scheduleError);
    }
  }, [scheduleError]);

  // Período actual derivado do dailySchedule (não mais hardcoded). Re-render
  // automático nas viragens de período via useClockTick.
  const periodBoundaries = useMemo(
    () => getPeriodBoundaries(dailySchedule),
    [dailySchedule]
  );
  useClockTick(periodBoundaries);
  const currentPeriod = getCurrentPeriodFromSchedule(dailySchedule);

  // Centraliza a verificação de "podemos tocar" — usado em vários sítios
  const canPlay = !!radio.isLive && !!radio.streamUrl;

  // Há artwork de algum tipo para mostrar como fundo / disc?
  const artSrc = isMusic && song?.art ? song.art
    : isPodcast && podcastArt ? podcastArt
    : isAnnouncement && announcementArt ? announcementArt
    : null;

  // Alturas estáveis do equalizer — geradas uma vez por mount. Recalcular
  // a cada render fazia as barras "saltarem" entre polls (5s) em vez de
  // animarem suavemente via CSS, criando uma sensação de tilt visual.
  const equalizerHeights = useMemo(
    () => Array.from({ length: 12 }, () => 20 + Math.random() * 80),
    []
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Mantém ref sincronizada para uso dentro de listeners do <audio>
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const clearReconnectTimer = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // Tenta reconectar ao stream com backoff exponencial. Chamada quando o
  // <audio> dispara error/stalled enquanto o utilizador queria estar a ouvir.
  // Quando `immediate` é true, pula o delay da primeira tentativa — útil
  // ao recuperar de um evento `online` (a rede acabou de voltar).
  const attemptReconnect = useCallback((immediate = false) => {
    if (!audioRef.current || !radio.streamUrl) return;
    if (!isPlayingRef.current) return;

    const attempt = reconnectAttemptsRef.current;
    if (attempt >= RECONNECT_BACKOFF.length) {
      // Desistimos: avisamos o utilizador parando o player
      setIsReconnecting(false);
      setIsPlaying(false);
      setPlayingStartedAtMs(null);
      reconnectAttemptsRef.current = 0;
      return;
    }

    const delay = immediate && attempt === 0 ? 0 : RECONNECT_BACKOFF[attempt];
    reconnectAttemptsRef.current = attempt + 1;
    setIsReconnecting(true);

    clearReconnectTimer();
    reconnectTimeoutRef.current = setTimeout(async () => {
      reconnectTimeoutRef.current = null;
      if (!audioRef.current || !isPlayingRef.current) return;
      try {
        audioRef.current.src = radio.streamUrl;
        audioRef.current.load();
        await audioRef.current.play();
        // sucesso é confirmado pelo evento "playing" (limpa estado lá)
      } catch {
        // Falha — agenda próxima tentativa
        attemptReconnect();
      }
    }, delay);
  }, [radio.streamUrl]);

  // Listeners de saúde do <audio>: detectar drops e recuperar automaticamente
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      reconnectAttemptsRef.current = 0;
      clearReconnectTimer();
      setIsReconnecting(false);
      // Marca o início real da reprodução — o useNowPlaying usa para o burst
      setPlayingStartedAtMs(Date.now());
    };
    const onWaiting = () => {
      // Buffering puro — mostra feedback mas não força reconexão
      if (isPlayingRef.current) setIsReconnecting(true);
    };
    const onError = () => {
      if (isPlayingRef.current) attemptReconnect();
    };
    const onStalled = () => {
      if (isPlayingRef.current) attemptReconnect();
    };
    const onEnded = () => {
      // Live stream não devia "acabar"; tratar como drop
      if (isPlayingRef.current) attemptReconnect();
    };
    const onPause = () => {
      // Distingue pause externo (browser/SO) do pause iniciado pelo utilizador.
      // Se foi externo enquanto isPlayingRef ainda é true, sincroniza o estado.
      if (userActionRef.current) {
        userActionRef.current = false;
        return;
      }
      if (isPlayingRef.current) {
        setIsPlaying(false);
        setPlayingStartedAtMs(null);
        clearReconnectTimer();
        reconnectAttemptsRef.current = 0;
        setIsReconnecting(false);
      }
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onStalled);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onStalled);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
    };
  }, [attemptReconnect]);

  // Reconexão imediata quando a rede volta após uma quebra
  useEffect(() => {
    const onOnline = () => {
      if (isPlayingRef.current) {
        reconnectAttemptsRef.current = 0;
        attemptReconnect(true);
      }
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [attemptReconnect]);

  // Cleanup do timer ao desmontar
  useEffect(() => () => clearReconnectTimer(), []);

  const togglePlay = async () => {
    if (!canPlay) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userActionRef.current = true;
      audio.pause();
      lastPauseAtRef.current = Date.now();
      setIsPlaying(false);
      setPlayingStartedAtMs(null);
      clearReconnectTimer();
      reconnectAttemptsRef.current = 0;
      setIsReconnecting(false);
      return;
    }

    try {
      // Reload obrigatório se: nunca tocou, deu erro, pause longo. Em
      // pause/play rápido evita destruir o pipeline (eliminando a "trinca"
      // do play e o tilt visual). Erro pendente sempre força reload —
      // antes podia ficar em loop sem reload com `currentSrc` setado.
      const sincePause = Date.now() - lastPauseAtRef.current;
      const needsReload =
        !audio.currentSrc ||
        audio.error !== null ||
        (lastPauseAtRef.current > 0 && sincePause > STALE_BUFFER_MS);

      if (needsReload) {
        audio.src = radio.streamUrl;
        audio.load();
      }
      await audio.play();
      setIsPlaying(true);
      reconnectAttemptsRef.current = 0;
      // playingStartedAtMs é setado no listener `onPlaying` (mais preciso
      // que aqui — `play()` resolve antes de o áudio começar de facto).
    } catch {
      // Browser blocked autoplay — user interaction required
      setIsPlaying(false);
      setPlayingStartedAtMs(null);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) setIsMuted(false);
  };

  return (
    <section id="radio" className="py-12 md:py-20 bg-beige-dark text-cream selection:bg-amarelo selection:text-charcoal">
      <div className="container mx-auto px-4">
        {/* Faixa de tempo nas principais cidades — utilitário compacto */}
        <WeatherStrip />

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
              {/* Album art / podcast art / announcement art background blur */}
              {artSrc ? (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={artSrc}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    loading="eager"
                    className="w-full h-full object-cover scale-150 blur-3xl opacity-30 transition-all duration-300 will-change-transform"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-vermelho/80 via-vermelho/70 to-vermelho-dark/90" />
                </div>
              ) : (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-amarelo/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 opacity-40 group-hover:opacity-20 transition-opacity duration-500" />

              <CardContent className="p-6 md:p-8 flex flex-col h-full relative z-10">
                {radio.streamUrl && (
                  <audio
                    ref={audioRef}
                    src={radio.streamUrl}
                    preload="none"
                    aria-label={`Stream da ${radio.name}`}
                  />
                )}

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
                          decoding="async"
                          className="w-full h-full object-cover transition-all duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : isPodcast && podcastArt ? (
                        <img
                          src={podcastArt}
                          alt={podcastName}
                          decoding="async"
                          className="w-full h-full object-cover transition-all duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : isAnnouncement && announcementArt ? (
                        <img
                          src={announcementArt}
                          alt={announcementName}
                          decoding="async"
                          className="w-full h-full object-cover transition-all duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center p-4">
                          <img src={radioLogo} alt={radio.name} decoding="async" className="w-full h-full object-contain opacity-70" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                      {/* Play/Pause overlay */}
                      <button
                        onClick={togglePlay}
                        disabled={!canPlay}
                        aria-label={isPlaying ? "Pausar rádio" : "Ouvir rádio"}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 disabled:hover:bg-black/0 disabled:cursor-not-allowed transition-all duration-300 group/play"
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          !canPlay
                            ? 'bg-white/40 text-vermelho/60'
                            : isPlaying
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
                        {equalizerHeights.map((h, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-full bg-amarelo/70"
                            style={{
                              height: `${h}%`,
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
                    {isReconnecting && isPlaying ? (
                      <>
                        <p className="text-base font-display font-bold truncate">{radio.name}</p>
                        <p className="text-sm opacity-60 mt-1 truncate">A reconectar…</p>
                      </>
                    ) : isLiveShow ? (
                      <>
                        <p className="text-base font-display font-bold truncate" title={liveShowName}>{liveShowName}</p>
                        <p className="text-sm opacity-60 mt-1">Programa ao Vivo</p>
                      </>
                    ) : isPodcast ? (
                      <>
                        <p className="text-base font-display font-bold truncate" title={podcastName}>{podcastName}</p>
                        <p className="text-sm opacity-60 mt-1">Podcast</p>
                      </>
                    ) : isAnnouncement ? (
                      <>
                        <p className="text-base font-display font-bold truncate" title={announcementName}>{announcementName}</p>
                        <p className="text-sm opacity-60 mt-1">Anúncio</p>
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
            <DailySoundtrackPanel
              dailySchedule={dailySchedule}
              currentPeriod={currentPeriod}
            />
            <WeeklySchedulePanel schedule={schedule} loading={loading} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
