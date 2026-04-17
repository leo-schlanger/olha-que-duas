import { useEffect, useRef, useCallback } from "react";
import type { AzuraResponse } from "@/hooks/useNowPlaying";

/**
 * AzuraCast SSE (Server-Sent Events) para now-playing em tempo real.
 * Usa o endpoint Centrifugo do AzuraCast que envia push quando a faixa
 * muda — detecção de transição em <1s vs polling 3s.
 *
 * Se o endpoint não estiver disponível (CORS, não habilitado, erro de
 * rede), retorna `supported: false` e o caller deve usar polling.
 */

// AzuraCast usa Centrifugo para SSE. O endpoint padrão é:
// /api/live/nowplaying/sse?cf_connect={"subs":{"station:<name>":{}}}
function buildSSEUrl(streamUrl: string): string | null {
  try {
    const url = new URL(streamUrl);
    const subs = JSON.stringify({ subs: { "station:olha_que_duas": {} } });
    return `${url.protocol}//${url.host}/api/live/nowplaying/sse?cf_connect=${encodeURIComponent(subs)}`;
  } catch {
    return null;
  }
}

interface UseNowPlayingSSEOptions {
  /** Callback quando recebe dados novos de now-playing */
  onData: (data: AzuraResponse) => void;
  /** Se true, tenta conectar; se false, desliga */
  enabled: boolean;
  /** URL do stream (para derivar o host da SSE) */
  streamUrl: string | undefined;
}

interface UseNowPlayingSSEReturn {
  /** SSE está conectado e a receber dados */
  connected: boolean;
  /** SSE é suportado pelo servidor (false = usar polling) */
  supported: boolean;
}

// Timeout para considerar SSE como não-suportado se não receber dados
const SSE_CONNECT_TIMEOUT_MS = 10_000;
// Se não receber evento em 60s, reconectar (heartbeat check)
const SSE_HEARTBEAT_TIMEOUT_MS = 60_000;

export function useNowPlayingSSE({
  onData,
  enabled,
  streamUrl,
}: UseNowPlayingSSEOptions): UseNowPlayingSSEReturn {
  const connectedRef = useRef(false);
  const supportedRef = useRef(true);
  const esRef = useRef<EventSource | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  const cleanup = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    if (heartbeatRef.current) {
      clearTimeout(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
    connectedRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled || !streamUrl) {
      cleanup();
      return;
    }

    const sseUrl = buildSSEUrl(streamUrl);
    if (!sseUrl) {
      supportedRef.current = false;
      return;
    }

    // Tenta abrir o EventSource
    let es: EventSource;
    try {
      es = new EventSource(sseUrl);
    } catch {
      // Browser não suporta EventSource ou URL inválida
      supportedRef.current = false;
      return;
    }
    esRef.current = es;

    // Timeout: se não receber nenhum evento em 10s, SSE provavelmente
    // não é suportado neste servidor. Marca como não-suportado e fecha.
    connectTimeoutRef.current = setTimeout(() => {
      if (!connectedRef.current) {
        console.warn("[SSE] connect timeout — falling back to polling");
        supportedRef.current = false;
        cleanup();
      }
    }, SSE_CONNECT_TIMEOUT_MS);

    const resetHeartbeat = () => {
      if (heartbeatRef.current) clearTimeout(heartbeatRef.current);
      heartbeatRef.current = setTimeout(() => {
        console.warn("[SSE] heartbeat timeout — reconnecting");
        cleanup();
        // O useEffect vai re-executar e reconectar
      }, SSE_HEARTBEAT_TIMEOUT_MS);
    };

    es.onopen = () => {
      connectedRef.current = true;
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
        connectTimeoutRef.current = null;
      }
      resetHeartbeat();
    };

    es.onmessage = (event) => {
      resetHeartbeat();
      try {
        // AzuraCast Centrifugo envia JSON com structure:
        // { "connect": { "subs": { "station:xxx": { "publications": [{ "data": { "np": {...} } }] } } } }
        // ou em updates: { "push": { "pub": { "data": { "np": {...} } } } }
        const parsed = JSON.parse(event.data);

        // Conexão inicial — pode ter dados nas publications
        const subs = parsed?.connect?.subs;
        if (subs) {
          const stationSub = subs["station:olha_que_duas"];
          if (stationSub?.publications?.length > 0) {
            const last = stationSub.publications[stationSub.publications.length - 1];
            const np = last?.data?.np;
            if (np) onDataRef.current(np);
          }
          return;
        }

        // Push update
        const np = parsed?.push?.pub?.data?.np;
        if (np) {
          onDataRef.current(np);
          return;
        }

        // Fallback: tentar como JSON directo
        if (parsed?.now_playing) {
          onDataRef.current(parsed);
        }
      } catch {
        // JSON malformado — ignorar
      }
    };

    es.onerror = () => {
      // EventSource reconecta automaticamente em erros transitórios.
      // Se o endpoint não existe (404), fecha definitivamente.
      if (es.readyState === EventSource.CLOSED) {
        console.warn("[SSE] connection closed permanently — falling back to polling");
        supportedRef.current = false;
        cleanup();
      }
    };

    return cleanup;
  }, [enabled, streamUrl, cleanup]);

  return {
    connected: connectedRef.current,
    supported: supportedRef.current,
  };
}
