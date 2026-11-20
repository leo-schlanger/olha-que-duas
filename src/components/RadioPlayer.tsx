import { useEffect, useMemo, useState, memo, type ReactNode } from "react";
import {
  Music, Play, Pause,
  Volume2, VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useSchedule } from "@/hooks/useSchedule";
import {
  useDailySchedule,
  getCurrentPeriodFromSchedule,
  getPeriodBoundaries,
} from "@/hooks/useDailySchedule";
import { useClockTick } from "@/hooks/useClockTick";
import { useRadioSync } from "@/hooks/useRadioSync";
import DailySoundtrackPanel from "@/components/radio/DailySoundtrackPanel";
import RadioDebugOverlay from "@/components/radio/RadioDebugOverlay";
import radioLogo from "@/assets/logo-olha-que-duas.webp";

import { mergeTodayPrograms } from "@/lib/mergeTodayPrograms";
import { radioUpNext, slotMinutes } from "@/lib/radioUpNext";
import type { DailyPeriod } from "@/hooks/useDailySchedule";

// Quantidade de barras do equalizer.
const EQUALIZER_BARS = 8;

/**
 * Background blur da album art com crossfade. Quando a capa muda, o
 * background anterior faz fade-out enquanto o novo faz fade-in (600ms).
 */
const AlbumArtBackground = memo(function AlbumArtBackground({ artSrc }: { artSrc: string | null }) {
  const [current, setCurrent] = useState(artSrc);
  const [prev, setPrev] = useState<string | null | false>(false);

  if (artSrc !== current) {
    setPrev(current);
    setCurrent(artSrc);
  }

  useEffect(() => {
    if (prev === false) return;
    const t = setTimeout(() => setPrev(false), 700);
    return () => clearTimeout(t);
  }, [prev]);

  const renderBg = (src: string | null, animClass: string) => {
    if (!src) {
      return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${animClass}`}>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amarelo/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </div>
      );
    }
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${animClass}`}>
        <img
          src={src}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover scale-150 blur-3xl opacity-30 will-change-transform"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-vermelho/80 via-vermelho/70 to-vermelho-dark/90" />
      </div>
    );
  };

  const isTransitioning = prev !== false;
  return (
    <>
      {renderBg(current, isTransitioning ? "animate-[fadeIn_600ms_ease-in-out]" : "")}
      {prev !== false && renderBg(prev, "animate-[fadeOut_600ms_ease-in-out_forwards]")}
    </>
  );
});

/**
 * Crossfade suave entre artwork. Quando `src` muda, a imagem anterior
 * faz fade-out (por cima) enquanto a nova faz fade-in (por baixo) — 500ms.
 * Quando `src` é null, mostra o `fallback` (logo da rádio).
 */
const ArtCrossfade = memo(function ArtCrossfade({
  src,
  alt,
  fallback,
}: {
  src: string | null;
  alt: string;
  fallback: ReactNode;
}) {
  const [current, setCurrent] = useState(src);
  const [prev, setPrev] = useState<string | null | false>(false);

  if (src !== current) {
    setPrev(current);
    setCurrent(src);
  }

  useEffect(() => {
    if (prev === false) return;
    const t = setTimeout(() => setPrev(false), 600);
    return () => clearTimeout(t);
  }, [prev]);

  const renderLayer = (layerSrc: string | null, isMain: boolean, animClass: string) => {
    if (layerSrc) {
      return (
        <img
          key={layerSrc}
          src={layerSrc}
          alt={isMain ? alt : ""}
          aria-hidden={!isMain}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover ${animClass}`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      );
    }
    return (
      <div key="fallback" className={`absolute inset-0 w-full h-full ${animClass}`}>
        {fallback}
      </div>
    );
  };

  const isTransitioning = prev !== false;
  return (
    <div className="relative w-full h-full">
      {renderLayer(current, true, isTransitioning ? "animate-[fadeIn_500ms_ease-in-out]" : "")}
      {prev !== false && renderLayer(prev, false, "animate-[fadeOut_500ms_ease-in-out_forwards]")}
    </div>
  );
});

/** How long a click on «Ouvir a rádio agora» waits for the player chunk. */
const PLAY_PENDING_MS = 30_000;

/** «Hoje na rádio»: what is on now and the next three (full grid below, in a <details>). */
function TodayOnAir({ schedule }: { schedule: DailyPeriod[] | undefined }) {
  const { current, next } = radioUpNext(schedule);
  if (!current) return null;
  const rows = [{ slot: current, now: true }, ...next.map((slot) => ({ slot, now: false }))];
  return (
    <div className="rounded-2xl border border-cream/10 bg-cream/5 p-4 md:p-5">
      <h3 className="font-display text-xl font-semibold">Hoje na rádio</h3>
      <ol className="mt-3 divide-y divide-cream/10">
        {rows.map(({ slot, now }, i) => (
          <li
            key={`${slot.time}-${slot.name}-${i}`}
            className={`flex items-start gap-4 py-3 ${now ? "-mx-2 rounded-xl bg-amarelo/10 px-2" : ""}`}
          >
            <span className="w-[4.5rem] shrink-0 pt-0.5 font-mono text-sm text-cream/80">
              {slot.time}
              {slot.endTime ? `–${slot.endTime}` : ""}
            </span>
            <span className="min-w-0">
              {now && (
                <span className="block text-xs font-bold uppercase tracking-wider text-amarelo">Agora</span>
              )}
              <span className="block break-words font-semibold text-cream">{slot.name}</span>
              {slot.genres && <span className="block break-words text-sm text-cream/70">{slot.genres}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Player da rádio. Usa `useRadioSync` que combina:
 *  - icecast-metadata-player (ICY in-band) para timing perfeito
 *  - API JSON (polling/SSE) para artwork e classificação
 *  - playing_next prefetch para transição visual instantânea
 *
 * Toda a lógica de áudio, reconexão, e metadados está encapsulada nos
 * hooks — o componente é puramente UI.
 */
const RadioPlayer = () => {
  const { radio } = siteConfig;
  const {
    // Now playing state
    song, isMusic, isLiveShow, liveShowName,
    isPodcast, podcastName, podcastArt,
    isAnnouncement, announcementName, announcementArt,
    // Player controls
    play, stop, isPlaying, isBuffering, isReconnecting,
    // Volume
    volume, setVolume, isMuted, toggleMute,
    // Debug
    debugRef,
  } = useRadioSync(radio.streamUrl, {
    announcementPlaylists: radio.announcementPlaylists,
  });

  const { schedule, error: scheduleError } = useSchedule();
  const { data: dailySchedule } = useDailySchedule();

  // Avisa em dev se o schedule do Supabase falhou
  useEffect(() => {
    if (scheduleError) {
      console.warn("[RadioPlayer] schedule fetch failed, using fallback:", scheduleError);
    }
  }, [scheduleError]);

  // Merge today's special programs into daily schedule
  const mergedSchedule = useMemo(
    () => dailySchedule ? mergeTodayPrograms(dailySchedule, schedule) : undefined,
    [dailySchedule, schedule],
  );

  // Período actual derivado do dailySchedule. Re-render nas viragens de período.
  const periodBoundaries = useMemo(
    () => getPeriodBoundaries(dailySchedule),
    [dailySchedule]
  );
  // Re-render at period and slot changes (keeps «Hoje na rádio» current).
  const slotBoundaries = useMemo(
    () => (mergedSchedule ?? []).flatMap((p) => p.slots.map((s) => slotMinutes(s.time))).filter((m): m is number => m !== null),
    [mergedSchedule],
  );
  useClockTick(useMemo(() => [...periodBoundaries, ...slotBoundaries], [periodBoundaries, slotBoundaries]));
  const currentPeriod = getCurrentPeriodFromSchedule(dailySchedule);

  const canPlay = !!radio.isLive && !!radio.streamUrl;

  // Artwork centralizada
  const artSrc = isMusic && song?.art ? song.art
    : isPodcast && podcastArt ? podcastArt
    : isAnnouncement && announcementArt ? announcementArt
    : null;

  const artAlt = isMusic && song ? `${song.title} - ${song.artist}`
    : isPodcast ? podcastName
    : isAnnouncement ? announcementName
    : radio.name;

  // Equalizer estável
  const equalizerHeights = useMemo(
    () => Array.from({ length: EQUALIZER_BARS }, () => 20 + Math.random() * 80),
    []
  );

  const equalizerElements = useMemo(
    () => equalizerHeights.map((h, i) => (
      <div
        key={i}
        className="w-[3px] rounded-full bg-amarelo/70"
        style={{
          height: `${h}%`,
          animation: `equalizer 0.4s ease-in-out infinite`,
          animationDelay: `${i * 0.05}s`,
        }}
      />
    )),
    [equalizerHeights]
  );

  const togglePlay = async () => {
    if (!canPlay) return;
    if (isPlaying) {
      stop();
    } else {
      try {
        await play();
      } catch (err) {
        console.error("[RadioPlayer] play failed:", err);
        toast.error("Não foi possível iniciar a rádio. Tenta novamente.");
      }
    }
  };

  // Hero button «Ouvir a rádio agora» dispatches oqd:play in the same click
  // (user gesture) and leaves window.__oqdPlayPending; if this chunk arrived
  // after the click, the pending request (≤ 30 s old) starts the radio on mount.
  // Never toggles off.
  useEffect(() => {
    const onPlay = () => {
      window.__oqdPlayPending = undefined;
      if (!canPlay || isPlaying) return;
      play().catch((err) => {
        console.error("[RadioPlayer] play failed:", err);
        toast.error("Não foi possível iniciar a rádio. Tenta novamente.");
      });
    };
    const pending = window.__oqdPlayPending;
    if (pending && Date.now() - pending < PLAY_PENDING_MS) onPlay();
    window.addEventListener("oqd:play", onPlay);
    return () => window.removeEventListener("oqd:play", onPlay);
  }, [canPlay, isPlaying, play]);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <section id="radio" className="py-12 md:py-20 bg-beige-dark text-cream selection:bg-amarelo selection:text-charcoal">
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-6xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-amarelo">Rádio Olha que Duas</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-display font-semibold">Está a tocar agora</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-start">

          <div className="lg:col-span-4 flex flex-col lg:sticky lg:top-[calc(6rem_+_var(--seasonal-bar-h,0px))]">
            <Card className="bg-gradient-to-br from-vermelho via-vermelho to-vermelho-dark border-0 text-cream shadow-2xl overflow-hidden relative group">
              <AlbumArtBackground artSrc={artSrc} />
              <div className="absolute inset-0 bg-black/10 opacity-40 group-hover:opacity-20 transition-opacity duration-500" />

              <CardContent className="p-6 md:p-8 flex flex-col h-full relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg">
                      <Music className="w-5 h-5 text-amarelo" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl leading-tight">{radio.name}</h3>
                      <p className="text-[10px] text-white/50 tracking-widest font-medium">
                        AO VIVO 24H
                      </p>
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
                    <div className={`w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border-2 border-white/10 transition-all duration-300 ${isPlaying ? 'scale-100' : 'scale-95 opacity-90'}`}>
                      <ArtCrossfade
                        src={artSrc}
                        alt={artAlt}
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center p-4">
                            <img src={radioLogo} alt={radio.name} decoding="async" className="w-full h-full object-contain opacity-70" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                        }
                      />
                      {/* Play/Pause overlay */}
                      <button
                        onClick={togglePlay}
                        disabled={!canPlay}
                        aria-label={isPlaying ? "Pausar rádio" : "Ouvir rádio"}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/30 disabled:hover:bg-black/0 disabled:cursor-not-allowed transition-all duration-300 group/play"
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

                    {/* Equalizer */}
                    {isPlaying && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-4">
                        {equalizerElements}
                      </div>
                    )}
                  </div>

                  {/* Now playing info */}
                  <div className="mt-6 text-center w-full min-w-0 px-2">
                    {(isReconnecting || isBuffering) && isPlaying ? (
                      <>
                        <p className="text-base font-display font-bold truncate">{radio.name}</p>
                        <p className="text-sm opacity-60 mt-1 truncate">
                          {isReconnecting ? "A reconectar…" : "A carregar…"}
                        </p>
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

          {/* Today: now + next three; the full grid stays in the DOM (SEO), closed */}
          <div className="lg:col-span-8 flex min-w-0 flex-col gap-4">
            <TodayOnAir schedule={mergedSchedule} />
            <details className="group rounded-2xl border border-cream/10">
              <summary className="cursor-pointer list-none rounded-2xl px-4 py-3 font-semibold text-amarelo hover:bg-cream/5 [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Ver a programação completa de hoje</span>
                <span className="hidden group-open:inline">Fechar a programação completa</span>
              </summary>
              <div className="p-2 pt-0">
                <DailySoundtrackPanel dailySchedule={mergedSchedule} currentPeriod={currentPeriod} />
              </div>
            </details>
          </div>

        </div>

        {/* App: once on the page, next to the radio */}
        <div id="app" className="max-w-6xl mx-auto mt-6 flex flex-wrap items-center gap-4 scroll-mt-32">
          <p className="text-base text-cream/85">Ouça também no telemóvel</p>
          <a
            href={siteConfig.app.androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descarregar a app Olha que Duas na Google Play"
            className="inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amarelo/60"
          >
            <img src="/badges/google-play-pt.png" alt="Disponível no Google Play" width={119} height={46} className="h-[46px] w-auto" loading="lazy" />
          </a>
        </div>
      </div>

      <RadioDebugOverlay debugRef={debugRef} />
    </section>
  );
};

export default RadioPlayer;
