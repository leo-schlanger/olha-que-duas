import { useCallback, useRef, useEffect } from "react";
import { useIcecastPlayer, type IcyMeta } from "@/hooks/useIcecastPlayer";
import {
  useNowPlaying,
  matchPlayingNext,
  type NowPlayingState,
  type DebugSnapshot,
} from "@/hooks/useNowPlaying";
import type { RefObject } from "react";

/**
 * Hook unificado que combina 3 sinais para sincronização áudio↔metadados:
 *
 *  1. **ICY in-band** (via `icecast-metadata-player`) — timing perfeito,
 *     mas só dá StreamTitle ("Artist - Title"), sem artwork.
 *  2. **API JSON** (via `useNowPlaying`) — artwork, playlist, album,
 *     mas com delay de polling.
 *  3. **playing_next prefetch** — artwork pré-carregada para transição
 *     visual instantânea.
 *
 * Workflow em cada transição:
 *   ICY muda StreamTitle → fetch imediato da API → match com playing_next
 *   → artwork já em cache → setState instantâneo.
 *
 * Se ICY não disponível (browser antigo, CORS), cai automaticamente para
 * polling API (comportamento anterior).
 */

interface UseRadioSyncOptions {
  announcementPlaylists?: readonly string[];
}

interface UseRadioSyncReturn extends NowPlayingState {
  // Player controls
  play: () => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  isBuffering: boolean;
  isReconnecting: boolean;
  // Volume
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  // Debug
  debugRef: RefObject<DebugSnapshot | null>;
  /** Sinal activo: 'icy' | 'sse' | 'polling' */
  syncSource: "icy" | "polling";
  /** ICY metadata raw (para debug overlay) */
  icyMeta: IcyMeta | null;
  refetch: () => void;
}

export function useRadioSync(
  streamUrl: string | undefined,
  options: UseRadioSyncOptions = {},
): UseRadioSyncReturn {
  const { announcementPlaylists } = options;

  // Ref para o playing started at (usado pelo useNowPlaying para burst)
  const playingStartedAtRef = useRef<number | null>(null);

  // 1. ICY player — sinal primário para timing de transições
  const icyPlayer = useIcecastPlayer({
    streamUrl,
    onMetadata: () => {
      // Quando ICY muda, disparar fetch imediato da API para obter
      // artwork/playlist. O useNowPlaying vai detectar a transição
      // no próximo poll (que forçamos via refetchRef).
      refetchRef.current?.();
    },
    onError: (msg) => {
      console.warn("[RadioSync] ICY error:", msg);
    },
  });

  // Marcar playingStartedAt quando ICY começa a tocar
  useEffect(() => {
    playingStartedAtRef.current = icyPlayer.isPlaying ? Date.now() : null;
  }, [icyPlayer.isPlaying]);

  // 2. API polling/SSE — sinal secundário para artwork e classificação.
  // Quando ICY está activo, o polling baixa para 15s (backup). Quando
  // ICY muda metadata, forçamos refetch imediato.
  const nowPlaying = useNowPlaying(streamUrl, icyPlayer.isPlaying, {
    audioRef: icyPlayer.audioElementRef,
    playingStartedAtRef,
    announcementPlaylists,
  });

  const refetchRef = useRef(nowPlaying.refetch);
  refetchRef.current = nowPlaying.refetch;

  // Quando ICY muda, forçar refetch imediato
  const prevIcyRef = useRef<string | null>(null);
  useEffect(() => {
    const raw = icyPlayer.icyMeta?.raw ?? null;
    if (raw && raw !== prevIcyRef.current) {
      prevIcyRef.current = raw;
      // Pequeno delay para dar tempo ao AzuraCast de publicar o now_playing
      // (~100ms é suficiente na maioria dos casos)
      setTimeout(() => refetchRef.current?.(), 150);
    }
  }, [icyPlayer.icyMeta]);

  // Se ICY não suportado, usamos fallback (useNowPlaying já faz polling)
  const syncSource = icyPlayer.supported ? "icy" as const : "polling" as const;

  // Play/Stop — useIcecastPlayer gere tanto o ICY player como o
  // fallback <audio> nativo (quando ICY não suportado).
  const play = useCallback(async () => {
    await icyPlayer.play();
  }, [icyPlayer.play]);

  const stop = useCallback(() => {
    icyPlayer.stop();
  }, [icyPlayer.stop]);

  return {
    // NowPlaying state (artwork, classificação, etc)
    ...nowPlaying,
    // Player controls
    play,
    stop,
    isPlaying: icyPlayer.isPlaying,
    isBuffering: icyPlayer.isBuffering,
    isReconnecting: icyPlayer.isReconnecting,
    // Volume
    volume: icyPlayer.volume,
    setVolume: icyPlayer.setVolume,
    isMuted: icyPlayer.isMuted,
    toggleMute: icyPlayer.toggleMute,
    // Debug
    debugRef: nowPlaying.debugRef,
    syncSource,
    icyMeta: icyPlayer.icyMeta,
    refetch: nowPlaying.refetch,
  };
}
