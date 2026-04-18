import { useEffect, useRef, useState, useCallback } from "react";
import IcecastMetadataPlayer from "icecast-metadata-player";
import { parseIcyStreamTitle } from "@/hooks/useNowPlaying";
import type { RefObject } from "react";

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
  /** Audio element para leitura pontual (pode ser null no primeiro render) */
  audioElement: HTMLAudioElement | null;
  /** Ref estável para o audio element — disponível logo após o efeito de criação */
  audioElementRef: RefObject<HTMLAudioElement | null>;
  /** Player state string */
  state: string;
  /** Se o browser suporta a lib (false = usar fallback <audio>) */
  supported: boolean;
}

// Persistência de volume no localStorage
const LS_VOLUME_KEY = "radio.volume";
const LS_MUTED_KEY = "radio.muted";

function readStoredVolume(fallback: number): number {
  try {
    const raw = localStorage.getItem(LS_VOLUME_KEY);
    if (raw === null) return fallback;
    const num = Number(raw);
    return Number.isFinite(num) && num >= 0 && num <= 100 ? num : fallback;
  } catch { return fallback; }
}

function readStoredMuted(): boolean {
  try { return localStorage.getItem(LS_MUTED_KEY) === "true"; }
  catch { return false; }
}

/**
 * Encapsula o `icecast-metadata-player` num hook React. Gere o ciclo de
 * vida do player (criar no mount, destruir no unmount), expõe controles
 * simples (play/stop/volume), e emite `onMetadata` sincronizado com o
 * áudio — o título muda no instante exacto em que a faixa muda nos
 * auriculares.
 *
 * Se o browser não suportar a lib (raro), `supported` é false e um
 * `<audio>` HTML nativo é criado como fallback (sem ICY metadata, mas
 * com áudio funcional).
 *
 * Volume e mute são persistidos em localStorage — sobrevivem a reloads.
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
  const [volume, setVolumeState] = useState(() => readStoredVolume(initialVolume));
  const [isMuted, setIsMuted] = useState(readStoredMuted);
  const [state, setState] = useState("stopped");
  const [supported, setSupported] = useState(true);

  const playerRef = useRef<IcecastMetadataPlayer | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const onMetadataRef = useRef(onMetadata);
  onMetadataRef.current = onMetadata;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  // Guardar volume anterior para restore no unmute
  const prevVolumeRef = useRef(volume);

  // Persistir volume no localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_VOLUME_KEY, String(volume)); } catch {}
  }, [volume]);

  useEffect(() => {
    try { localStorage.setItem(LS_MUTED_KEY, String(isMuted)); } catch {}
  }, [isMuted]);

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

  // Criar ICY player quando streamUrl muda (se suportado)
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
    audioElementRef.current = player.audioElement;

    return () => {
      player.stop().catch(() => {});
      player.detachAudioElement().catch(() => {});
      playerRef.current = null;
      audioElementRef.current = null;
    };
  }, [streamUrl, supported]);

  // Fallback <audio> para browsers que não suportam icecast-metadata-player.
  // Sem ICY metadata, mas o utilizador consegue ouvir a rádio.
  useEffect(() => {
    if (!streamUrl || supported) return;

    const audio = new Audio();
    audio.preload = "none";
    fallbackAudioRef.current = audio;
    audioElementRef.current = audio;

    const onPlayEvt = () => { setIsPlaying(true); setIsBuffering(false); setState("playing"); };
    const onPauseEvt = () => { setIsPlaying(false); setState("stopped"); };
    const onWaitingEvt = () => { setIsBuffering(true); };
    const onPlayingEvt = () => { setIsBuffering(false); setState("playing"); };

    audio.addEventListener("play", onPlayEvt);
    audio.addEventListener("pause", onPauseEvt);
    audio.addEventListener("waiting", onWaitingEvt);
    audio.addEventListener("playing", onPlayingEvt);

    return () => {
      audio.removeEventListener("play", onPlayEvt);
      audio.removeEventListener("pause", onPauseEvt);
      audio.removeEventListener("waiting", onWaitingEvt);
      audio.removeEventListener("playing", onPlayingEvt);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      fallbackAudioRef.current = null;
      audioElementRef.current = null;
    };
  }, [streamUrl, supported]);

  // Sync volume com o audio element (ICY player ou fallback)
  useEffect(() => {
    const audio = playerRef.current?.audioElement ?? fallbackAudioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const play = useCallback(async () => {
    if (playerRef.current) {
      // ICY player
      setIsBuffering(true);
      setState("loading");
      try {
        await playerRef.current.play();
      } catch {
        setIsPlaying(false);
        setIsBuffering(false);
        setState("stopped");
      }
    } else if (fallbackAudioRef.current && streamUrl) {
      // Fallback <audio> nativo
      setIsBuffering(true);
      setState("loading");
      try {
        fallbackAudioRef.current.src = streamUrl;
        await fallbackAudioRef.current.play();
      } catch {
        setIsPlaying(false);
        setIsBuffering(false);
        setState("stopped");
      }
    }
  }, [streamUrl]);

  const stop = useCallback(() => {
    playerRef.current?.stop().catch(() => {});
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause();
      fallbackAudioRef.current.removeAttribute("src");
      fallbackAudioRef.current.load();
    }
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
    audioElement: playerRef.current?.audioElement ?? fallbackAudioRef.current ?? null,
    audioElementRef,
    state,
    supported,
  };
}
