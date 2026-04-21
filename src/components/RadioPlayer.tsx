import { useEffect, useMemo, useState, memo, type ReactNode } from "react";
import {
  Music, Radio, Play, Pause,
  Volume2, VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useSchedule } from "@/hooks/useSchedule";
import {
  useDailySchedule,
  getCurrentPeriodFromSchedule,
  getPeriodBoundaries,
  parsePeriodRange,
  parseSlotTime,
  addDurations,
} from "@/hooks/useDailySchedule";
import type { DailyPeriod, DailySlot } from "@/hooks/useDailySchedule";
import type { GroupedSchedule } from "@/hooks/useSchedule";
import { useClockTick } from "@/hooks/useClockTick";
import { useRadioSync } from "@/hooks/useRadioSync";
import WeatherStrip from "@/components/WeatherStrip";
import DailySoundtrackPanel from "@/components/radio/DailySoundtrackPanel";
import RadioDebugOverlay from "@/components/radio/RadioDebugOverlay";
import radioLogo from "@/assets/logo-olha-que-duas.webp";

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/**
 * Merge today's special programs (from weekly schedule) into the daily
 * periods. Special programs get an `iconUrl` to render their logo; routine
 * slots remain icon-less.
 */
/** Format minutes-from-midnight as "12h" or "12h30" */
function formatMinsToSlotTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return m
    ? `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`
    : `${String(h).padStart(2, '0')}h`;
}

function mergeTodayPrograms(
  periods: DailyPeriod[],
  weekly: GroupedSchedule[],
): DailyPeriod[] {
  const todayName = DAY_NAMES[new Date().getDay()];
  const todayPrograms = weekly.filter((p) => p.day === todayName);
  if (todayPrograms.length === 0) return periods;

  // Keep original periods for gap-filling (find what routine was playing at a given time)
  const originalPeriods = periods;

  // Clone periods and strip routine durations (recalculated by addDurations at end)
  const merged: DailyPeriod[] = periods.map((p) => ({
    ...p,
    slots: p.slots.map(({ duration, ...rest }) => rest),
  }));

  // Check if there's an all-day event today
  const allDayProg = todayPrograms.find((p) => p.isAllDay);

  // If all-day event exists, remove routine slots from all periods
  if (allDayProg) {
    const allDaySlot: DailySlot = {
      time: '—',
      name: allDayProg.show,
      iconUrl: allDayProg.iconUrl,
      isAllDay: true,
    };
    for (const period of merged) {
      period.slots = period.slots.filter((s) => !!s.iconUrl);
      period.slots.unshift({ ...allDaySlot });
    }
  }

  // Collect all specials with their end times for gap-filling later
  const specialsWithEnd: { periodIdx: number; startMins: number; endMins: number }[] = [];

  for (const prog of todayPrograms) {
    if (prog.isAllDay) continue;

    for (let i = 0; i < prog.times.length; i++) {
      const rawTime = prog.times[i];
      const rawEndTime = prog.endTimes?.[i] ?? null;

      const [h, m] = rawTime.split(':').map(Number);
      const mins = h * 60 + (m || 0);

      const periodIdx = merged.findIndex((p) => {
        const range = parsePeriodRange(p.range);
        return range ? mins >= range.start && mins < range.end : false;
      });
      if (periodIdx < 0) continue;
      const target = merged[periodIdx];

      const formatted = formatMinsToSlotTime(mins);

      // Compute duration from end_time if available
      let duration: string | undefined;
      let endMins: number | undefined;
      if (rawEndTime) {
        const [eh, em] = rawEndTime.split(':').map(Number);
        endMins = eh * 60 + (em || 0);
        let diff = endMins - mins;
        if (diff <= 0) diff += 24 * 60;
        const dh = Math.floor(diff / 60);
        const dm = diff % 60;
        duration = dh === 0 ? `${dm}min` : dm > 0 ? `${dh}h${String(dm).padStart(2, '0')}` : `${dh}h`;
      }

      // Replace routine slot at the same time, or add new
      const existingIdx = target.slots.findIndex((s) => !s.isAllDay && parseSlotTime(s.time) === mins);
      const specialSlot: DailySlot = {
        time: formatted,
        name: prog.show,
        iconUrl: prog.iconUrl,
        ...(duration && { duration }),
      };

      if (existingIdx >= 0) {
        target.slots[existingIdx] = specialSlot;
      } else {
        target.slots.push(specialSlot);
      }

      if (endMins !== undefined) {
        specialsWithEnd.push({ periodIdx, startMins: mins, endMins });
      }
    }
  }

  // Remove routine slots that fall inside a special's time range
  for (const period of merged) {
    period.slots = period.slots.filter((slot) => {
      if (slot.iconUrl) return true;
      const t = parseSlotTime(slot.time);
      return !specialsWithEnd.some((r) => t > r.startMins && t < r.endMins);
    });
  }

  // Sort all periods
  for (const period of merged) {
    period.slots.sort((a, b) => {
      if (a.isAllDay) return -1;
      if (b.isAllDay) return 1;
      return parseSlotTime(a.time) - parseSlotTime(b.time);
    });
  }

  // Gap-fill: after each special with end_time, insert a "resume" slot if there's dead air
  for (const { periodIdx, endMins } of specialsWithEnd) {
    const target = merged[periodIdx];
    const range = parsePeriodRange(target.range);
    if (!range) continue;

    // Check if endMins falls outside this period (crosses into next)
    if (endMins >= range.end || endMins < range.start) continue;

    // Check if there's already a slot at endMins
    const alreadyExists = target.slots.some((s) => !s.isAllDay && parseSlotTime(s.time) === endMins);
    if (alreadyExists) continue;

    // Find the next slot after endMins
    const nextSlot = target.slots.find((s) => !s.isAllDay && parseSlotTime(s.time) > endMins);
    const nextStart = nextSlot ? parseSlotTime(nextSlot.time) : range.end;

    // Only insert if there's actually a gap
    if (endMins >= nextStart) continue;

    // Determine what should resume
    let resumeSlot: DailySlot;
    if (allDayProg) {
      resumeSlot = {
        time: formatMinsToSlotTime(endMins),
        name: allDayProg.show,
        iconUrl: allDayProg.iconUrl,
      };
    } else {
      // Find original routine slot that was playing at this time
      const origPeriod = originalPeriods.find((p) => {
        const r = parsePeriodRange(p.range);
        return r ? endMins >= r.start && endMins < r.end : false;
      });
      const origSlots = origPeriod?.slots ?? [];
      const covering = origSlots.filter((s) => parseSlotTime(s.time) <= endMins);
      const origSlot = covering[covering.length - 1];

      resumeSlot = {
        time: formatMinsToSlotTime(endMins),
        name: origSlot?.name ?? 'Programação',
        ...(origSlot?.genres && { genres: origSlot.genres }),
      };
    }

    target.slots.push(resumeSlot);

    // Re-sort after insertion
    target.slots.sort((a, b) => {
      if (a.isAllDay) return -1;
      if (b.isAllDay) return 1;
      return parseSlotTime(a.time) - parseSlotTime(b.time);
    });
  }

  return addDurations(merged);
}

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
    debugRef, syncSource, icyMeta,
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
  useClockTick(periodBoundaries);
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
      await play();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <section id="radio" className="py-12 md:py-20 bg-beige-dark text-cream selection:bg-amarelo selection:text-charcoal">
      <div className="container mx-auto px-4">
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
                        {syncSource === "icy" ? "ICY SYNC" : "LIVE STREAM"}
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

          {/* Schedule Section */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <DailySoundtrackPanel
              dailySchedule={mergedSchedule}
              currentPeriod={currentPeriod}
            />
          </div>

        </div>
      </div>

      <RadioDebugOverlay debugRef={debugRef} />
    </section>
  );
};

export default RadioPlayer;
