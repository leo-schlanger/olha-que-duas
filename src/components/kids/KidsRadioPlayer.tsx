import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Clock, Radio, Music } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useRadioSync } from '@/hooks/useRadioSync';
import { useKidsSchedule } from '@/hooks/useKidsSchedule';

const EQUALIZER_BARS = 5;
const BAR_COLORS = [
  'bg-white/90',
  'bg-yellow-200/90',
  'bg-white/90',
  'bg-pink-200/90',
  'bg-white/90',
];

export default function KidsRadioPlayer() {
  const { isLive, countdown, nextSlotLabel } = useKidsSchedule();
  const {
    play, stop, isPlaying, isBuffering,
    volume, setVolume, isMuted, toggleMute,
    song, contentType,
  } = useRadioSync(siteConfig.radio.streamUrl);

  const isMusic = contentType === 'music';
  const artSrc = isMusic && song?.art ? song.art : null;

  // Auto-stop when program ends
  const wasLiveRef = useRef(isLive);
  const [endedMessage, setEndedMessage] = useState(false);

  useEffect(() => {
    if (wasLiveRef.current && !isLive && isPlaying) {
      stop();
      setEndedMessage(true);
      const t = setTimeout(() => setEndedMessage(false), 5000);
      return () => clearTimeout(t);
    }
    wasLiveRef.current = isLive;
  }, [isLive, isPlaying, stop]);

  const togglePlay = async () => {
    if (!isLive) return;
    if (isPlaying) {
      stop();
    } else {
      await play();
    }
  };

  // --- STATE A: Off-air ---
  if (!isLive) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-pink-50 via-amber-50 to-sky-50 border-2 border-pink-200 p-5 shadow-md">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow">
            <Radio className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-pink-600 text-sm">
            O Cantinho da Pequenada
          </span>
        </div>

        {/* Message */}
        <p className="text-charcoal/60 text-sm mb-4">
          {endedMessage ? 'O programa acabou! Até à próxima!' : 'O programa volta em breve!'}
        </p>

        {/* Countdown */}
        {countdown && !endedMessage && (
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-100 border-2 border-pink-200">
              <Clock className="w-4 h-4 text-pink-500" />
              <span className="font-extrabold text-pink-600 text-xl md:text-2xl">
                {countdown.hours > 0 && `${countdown.hours}h `}
                {countdown.minutes}min
              </span>
            </div>
          </div>
        )}

        {/* Next slot */}
        {nextSlotLabel && !endedMessage && (
          <p className="text-center text-xs text-charcoal/50">
            Próximo episódio: <span className="font-semibold">{nextSlotLabel}</span>
          </p>
        )}
      </div>
    );
  }

  // --- STATE B & C: Live ---
  return (
    <div className="rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-amber-300 border-4 border-white p-5 shadow-xl">
      {/* Live badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-white font-extrabold text-xs uppercase tracking-widest">
          No Ar!
        </span>
      </div>

      {/* Now playing artwork + info */}
      {isPlaying && (
        <div className="flex items-center gap-3 mb-4 bg-white/15 rounded-xl p-2.5">
          {/* Album art */}
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/20 flex-shrink-0 shadow-md">
            {artSrc ? (
              <img
                src={artSrc}
                alt={song?.title || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white/60" />
              </div>
            )}
          </div>
          {/* Song info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">
              {song?.title || 'Cantinho da Pequenada'}
            </p>
            {song?.artist && (
              <p className="text-white/70 text-xs truncate">{song.artist}</p>
            )}
          </div>
        </div>
      )}

      {/* Equalizer (only when playing) */}
      {isPlaying && (
        <div className="flex items-end justify-center gap-1 h-8 mb-4">
          {Array.from({ length: EQUALIZER_BARS }).map((_, i) => (
            <span
              key={i}
              className={`w-2 rounded-full ${BAR_COLORS[i]} origin-bottom`}
              style={{
                animation: `equalizer 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                height: '100%',
              }}
            />
          ))}
        </div>
      )}

      {/* Play/Pause button */}
      <div className="flex justify-center mb-3">
        <button
          onClick={togglePlay}
          disabled={isBuffering}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_0_rgba(190,24,93,0.5)] hover:shadow-[0_5px_0_rgba(190,24,93,0.5)] hover:translate-y-[3px] active:translate-y-[6px] active:shadow-[0_2px_0_rgba(190,24,93,0.5)] transition-all disabled:opacity-60"
          aria-label={isPlaying ? 'Parar' : 'Ouvir'}
        >
          {isBuffering ? (
            <div className="w-6 h-6 border-3 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-7 h-7 text-pink-500" />
          ) : (
            <Play className="w-7 h-7 text-pink-500 ml-1" />
          )}
        </button>
      </div>

      {/* CTA text */}
      <p className="text-center text-white font-bold text-sm mb-3">
        {isBuffering
          ? 'A ligar...'
          : isPlaying
            ? 'A tocar agora!'
            : 'Carrega para ouvir!'}
      </p>

      {/* Volume (only when playing) */}
      {isPlaying && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={toggleMute}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="kids-volume-slider flex-1 h-2 appearance-none rounded-full bg-white/30 outline-none cursor-pointer"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}
