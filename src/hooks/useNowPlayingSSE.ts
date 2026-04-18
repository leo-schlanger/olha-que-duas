import { useEffect, useRef, useState } from "react";
import type { AzuraResponse } from "@/hooks/useNowPlaying";

/**
 * AzuraCast SSE (Server-Sent Events) para now-playing em tempo real.
 * Usa o endpoint Centrifugo do AzuraCast que envia push quando a faixa
 * muda — detecção de transição em <1s vs polling 3s.
 *
 * Se o endpoint não estiver disponível (CORS, não habilitado, erro de
 * rede), retorna `supported: false` e o caller deve usar polling.
 *
 * Fixes vs versão anterior:
 *  - `connected`/`supported` são agora state (não refs) → re-render do
 *    caller quando SSE conecta/desconecta → polling interval ajusta-se.
 *  - `reconnectKey` state força reconexão após heartbeat timeout —
 *    antes, `cleanup()` não disparava re-run do useEffect.
 */

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
  const [connected, setConnected] = useState(false);
  const [supported, setSupported] = useState(true);
  // Incrementar para forçar reconexão (heartbeat timeout). Adicionado
  // como dep do useEffect — quando muda, o efeito limpa o EventSource
  // antigo e cria um novo.
  const [reconnectKey, setReconnectKey] = useState(0);

  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    if (!enabled || !streamUrl) {
      setConnected(false);
      return;
    }

    const sseUrl = buildSSEUrl(streamUrl);
    if (!sseUrl) {
      setSupported(false);
      return;
    }

    let es: EventSource;
    try {
      es = new EventSource(sseUrl);
    } catch {
      setSupported(false);
      return;
    }

    let heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
    let connectTimer: ReturnType<typeof setTimeout> | null = null;
    let cleaned = false;

    const clearTimers = () => {
      if (heartbeatTimer) { clearTimeout(heartbeatTimer); heartbeatTimer = null; }
      if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
    };

    // Timeout: se não receber nenhum evento em 10s, SSE provavelmente
    // não é suportado neste servidor. Marca como não-suportado e fecha.
    connectTimer = setTimeout(() => {
      if (!cleaned && es.readyState !== EventSource.OPEN) {
        console.warn("[SSE] connect timeout — falling back to polling");
        setSupported(false);
        es.close();
      }
    }, SSE_CONNECT_TIMEOUT_MS);

    const resetHeartbeat = () => {
      if (heartbeatTimer) clearTimeout(heartbeatTimer);
      heartbeatTimer = setTimeout(() => {
        if (!cleaned) {
          console.warn("[SSE] heartbeat timeout — reconnecting");
          es.close();
          setConnected(false);
          // Incrementar key → useEffect cleanup + re-run → novo EventSource
          setReconnectKey(k => k + 1);
        }
      }, SSE_HEARTBEAT_TIMEOUT_MS);
    };

    es.onopen = () => {
      setConnected(true);
      if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
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
        setSupported(false);
        setConnected(false);
      }
    };

    return () => {
      cleaned = true;
      clearTimers();
      es.close();
      setConnected(false);
    };
  }, [enabled, streamUrl, reconnectKey]);

  return { connected, supported };
}
