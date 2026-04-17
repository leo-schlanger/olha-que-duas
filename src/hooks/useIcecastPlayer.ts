import { useEffect, useRef, useState, useCallback } from "react";
import IcecastMetadataPlayer from "icecast-metadata-player";
import { parseIcyStreamTitle } from "@/hooks/useNowPlaying";

export interface IcyMeta {
  artist: string;
  title: string;
  raw: string;
}

interface UseIcecastPlayerOptions {
  /** URL do stream Icecast (MP3) */
  streamUrl: string | undefined;
  /** Volume inicial 0-100 */
  initialVolume?: number;
  /** Chamado quando ICY metadata muda (sincronizado com áudio) */
  onMetadata?: (meta: IcyMeta) => void;
  /** Chamado quando ocorre erro */
  onError?: (message: string) => void;
}

interface UseIcecastPlayerReturn {
  play: () => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  isBuffering: boolean;
  isReconnecting: boolean;
  /** Último ICY metadata parseado */
  icyMeta: IcyMeta | null;
  /** Controlar volume (0-100) */
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  /** Audio element para leitura de buffered, etc */
  audioElement: HTMLAudioElement | null;
  /** Player state string */
  state: string;
  /** Se o browser suporta a lib (false = usar fallback <audio>) */
  supported: boolean;
}

/**
 * Encapsula o `icecast-metadata-player` num hook React. Gere o ciclo de
 * vida do player (criar no mount, destruir no unmount), expõe controles
 * simples (play/stop/volume), e emite `onMetadata` sincronizado com o
 * áudio — o título muda no instante exacto em que a faixa muda nos
 * auriculares.
 *
 * Se o browser não suportar a lib (raro), `supported` é false e o
 * caller deve usar `<audio>` como fallback.
 */
export function useIcecastPlayer({
  streamUrl,
  initialVolume = 80,
  onMetadata,
  onError,
}: UseIcecastPlayerOptions): UseIcecastPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [icyMeta, setIcyMeta] = useState<IcyMeta | null>(null);
  const [volume, setVolumeState] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [state, setState] = useState("stopped");
  const [supported, setSupported] = useState(true);

  const playerRef = useRef<IcecastMetadataPlayer | null>(null);
  const onMetadataRef = useRef(onMetadata);
  onMetadataRef.current = onMetadata;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  // Guardar volume anterior para restore no unmute
  const prevVolumeRef = useRef(initialVolume);

  // Verificar suporte do browser
  useEffect(() => {
    try {
      const support = IcecastMetadataPlayer.canPlayType("audio/mpeg");
      const canPlay = !!(support.mediasource || support.html5 || support.webaudio);
      setSupported(canPlay);
      if (!canPlay) {
        console.warn("[IcecastPlayer] browser não suporta — usar fallback <audio>");
      }
    } catch {
      setSupported(false);
    }
  }, []);

  // Criar player quando streamUrl muda
  useEffect(() => {
    if (!streamUrl || !supported) return;

    const player = new IcecastMetadataPlayer(streamUrl, {
      metadataTypes: ["icy"],
      bufferLength: 2,
      retryTimeout: 30,
      retryDelayMin: 1,
      retryDelayMax: 8,
      enableLogging: false,

      onMetadata: (metadata: Record<string, string>) => {
        const raw = metadata?.StreamTitle ?? "";
        const parsed = parseIcyStreamTitle(raw);
        if (parsed) {
          const meta: IcyMeta = { ...parsed, raw };
          setIcyMeta(meta);
          onMetadataRef.current?.(meta);
        }
      },

      onPlay: () => {
        setIsPlaying(true);
        setIsBuffering(false);
        setIsReconnecting(false);
      },

      onStreamStart: () => {
        setIsBuffering(false);
        setState("playing");
      },

      onBuffer: () => {
        setIsBuffering(true);
      },

      onStop: () => {
        setIsPlaying(false);
        setIsBuffering(false);
        setIsReconnecting(false);
        setState("stopped");
      },

      onRetry: () => {
        setIsReconnecting(true);
        setState("retrying");
      },

      onRetryTimeout: () => {
        setIsReconnecting(false);
        setIsPlaying(false);
        setState("stopped");
        onErrorRef.current?.("Falha na reconexão — tenta novamente.");
      },

      onError: (message: string) => {
        onErrorRef.current?.(message);
      },
    });

    playerRef.current = player;

    return () => {
      player.stop().catch(() => {});
      player.detachAudioElement().catch(() => {});
      playerRef.current = null;
    };
  }, [streamUrl, supported]);

  // Sync volume com o audio element
  useEffect(() => {
    const audio = playerRef.current?.audioElement;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const play = useCallback(async () => {
    if (!playerRef.current) return;
    try {
      setIsBuffering(true);
      setState("loading");
      await playerRef.current.play();
    } catch {
      setIsPlaying(false);
      setIsBuffering(false);
      setState("stopped");
    }
  }, []);

  const stop = useCallback(() => {
    playerRef.current?.stop().catch(() => {});
    setIsPlaying(false);
    setIsBuffering(false);
    setIsReconnecting(false);
    setIcyMeta(null);
    setState("stopped");
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
    prevVolumeRef.current = clamped;
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
  }, []);

  return {
    play,
    stop,
    isPlaying,
    isBuffering,
    isReconnecting,
    icyMeta,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    audioElement: playerRef.current?.audioElement ?? null,
    state,
    supported,
  };
}
