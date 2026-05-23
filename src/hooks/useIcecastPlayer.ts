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
  /** Se o browser suporta a lib ICY */
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
 * Hook de áudio para stream Icecast.
 *
 * Estratégia "icy-first":
 *   1. PLAY tenta o ICY player (IcecastMetadataPlayer) com o <audio>
 *      element partilhado — áudio e metadata sincronizados, sem duplicação.
 *   2. Se ICY falhar (browser antigo, CORS, etc.), cai para <audio> nativo
 *      directo — sem metadata ICY, mas o polling da API AzuraCast cobre.
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const onMetadataRef = useRef(onMetadata);
  onMetadataRef.current = onMetadata;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const prevVolumeRef = useRef(volume);

  // Persistir volume no localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_VOLUME_KEY, String(volume)); } catch {}
  }, [volume]);

  useEffect(() => {
    try { localStorage.setItem(LS_MUTED_KEY, String(isMuted)); } catch {}
  }, [isMuted]);

  // Verificar suporte ICY
  useEffect(() => {
    try {
      const support = IcecastMetadataPlayer.canPlayType("audio/mpeg");
      const canPlay = !!(support.mediasource || support.html5 || support.webaudio);
      setSupported(canPlay);
    } catch {
      setSupported(false);
    }
  }, []);

  // Criar <audio> nativo (principal — sempre disponível)
  useEffect(() => {
    if (!streamUrl) return;

    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;
    audioElementRef.current = audio;

    const onPlayEvt = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setState("playing");
    };
    const onPauseEvt = () => {
      setIsPlaying(false);
      setState("stopped");
    };
    const onWaitingEvt = () => { setIsBuffering(true); };
    const onPlayingEvt = () => { setIsBuffering(false); setState("playing"); };
    const onErrorEvt = () => {
      setIsPlaying(false);
      setIsBuffering(false);
      setState("stopped");
      onErrorRef.current?.("Erro no stream de áudio.");
    };

    audio.addEventListener("play", onPlayEvt);
    audio.addEventListener("pause", onPauseEvt);
    audio.addEventListener("waiting", onWaitingEvt);
    audio.addEventListener("playing", onPlayingEvt);
    audio.addEventListener("error", onErrorEvt);

    return () => {
      audio.removeEventListener("play", onPlayEvt);
      audio.removeEventListener("pause", onPauseEvt);
      audio.removeEventListener("waiting", onWaitingEvt);
      audio.removeEventListener("playing", onPlayingEvt);
      audio.removeEventListener("error", onErrorEvt);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
      audioElementRef.current = null;
    };
  }, [streamUrl]);

  // Criar ICY player com audioElement partilhado (áudio + metadata no mesmo stream)
  useEffect(() => {
    if (!streamUrl || !supported) return;

    const player = new IcecastMetadataPlayer(streamUrl, {
      audioElement: audioRef.current ?? undefined,
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

      onRetry: () => { setIsReconnecting(true); },
      onRetryTimeout: () => { setIsReconnecting(false); },
      onError: (message: string) => { onErrorRef.current?.(message); },
      // Estado gerido pelos event listeners do <audio> element partilhado
      // (play/pause/waiting/playing/error). Callbacks do ICY são no-op.
      onPlay: () => {},
      onStop: () => {},
      onBuffer: () => {},
      onStreamStart: () => {},
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
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // ─── PLAY: ICY primeiro (áudio + metadata), fallback nativo ───
  const play = useCallback(async () => {
    if (!audioRef.current || !streamUrl) {
      console.warn("[IcecastPlayer] no audio element or streamUrl");
      return;
    }

    setIsBuffering(true);
    setState("loading");

    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume / 100;

    // 1. ICY player (áudio + metadata pelo audioElement partilhado)
    if (playerRef.current && supported) {
      try {
        await playerRef.current.play();
        return;
      } catch (err) {
        console.warn("[IcecastPlayer] ICY player failed, falling back to native:", err);
      }
    }

    // 2. Fallback: áudio nativo (sem ICY metadata — polling da API cobre)
    audio.src = streamUrl;
    try {
      await audio.play();
    } catch (err) {
      console.error("[IcecastPlayer] native audio play failed:", err);
      setIsPlaying(false);
      setIsBuffering(false);
      setState("stopped");
      onErrorRef.current?.("Falha ao iniciar a rádio.");
    }
  }, [streamUrl, volume, isMuted, supported]);

  const stop = useCallback(() => {
    // Parar ICY player primeiro (gere o audioElement quando activo)
    playerRef.current?.stop().catch(() => {});
    // Limpar áudio nativo (garante que qualquer playback pára)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
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
    audioElement: audioRef.current,
    audioElementRef,
    state,
    supported,
  };
}
