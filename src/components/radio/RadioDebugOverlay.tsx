import { useEffect, useState, type RefObject } from "react";
import type { DebugSnapshot } from "@/hooks/useNowPlaying";

interface Props {
  debugRef: RefObject<DebugSnapshot | null>;
}

/**
 * Overlay diagnóstico para a sincronização áudio↔imagem da rádio. Activa-se
 * com `?debug=radio` na URL. Atualiza a cada 500ms via polling do
 * `debugRef` — não acopla a re-renders do hook nem do RadioPlayer.
 *
 * Uso típico para calibração: lê os campos `bufferEst`, `serverOffsetSec` e
 * `secondsUntilTransition`. Se a capa atrasa face ao áudio, baixar o buffer
 * via `localStorage.setItem('radio.bufferSec', '3')` e recarregar.
 */
export function RadioDebugOverlay({ debugRef }: Props) {
  const [snapshot, setSnapshot] = useState<DebugSnapshot | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setEnabled(params.get("debug") === "radio");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => setSnapshot(debugRef.current);
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [enabled, debugRef]);

  if (!enabled) return null;

  const fmtTime = (epochSec: number | null) =>
    epochSec === null ? "—" : new Date(epochSec * 1000).toISOString().slice(11, 23);
  const fmtSec = (s: number | null) =>
    s === null ? "—" : `${s.toFixed(2)}s`;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] bg-black/85 text-green-400 font-mono text-[10px] leading-tight rounded-lg p-3 shadow-2xl border border-green-500/30 max-w-xs backdrop-blur-sm"
      role="status"
      aria-label="Radio debug overlay"
    >
      <div className="text-amarelo font-bold mb-1.5 flex items-center justify-between">
        <span>RADIO DEBUG</span>
        <button
          onClick={() => setEnabled(false)}
          className="text-green-400/60 hover:text-green-400"
          aria-label="Fechar overlay"
        >
          ×
        </button>
      </div>
      {!snapshot ? (
        <div className="text-green-400/60">A aguardar primeiro fetch…</div>
      ) : (
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
          <dt className="text-green-400/60">category</dt>
          <dd className="text-amarelo">{snapshot.category}</dd>
          <dt className="text-green-400/60">audible</dt>
          <dd className="truncate" title={snapshot.audibleTitle ?? "—"}>{snapshot.audibleTitle ?? "—"}</dd>
          <dt className="text-green-400/60">played_at</dt>
          <dd>{fmtTime(snapshot.audiblePlayedAt)}</dd>
          <dt className="text-green-400/60">serverNow</dt>
          <dd>{fmtTime(snapshot.serverNow)}</dd>
          <dt className="text-green-400/60">listenerWC</dt>
          <dd>{fmtTime(snapshot.listenerWallClock)}</dd>
          <dt className="text-green-400/60">offsetSrv</dt>
          <dd>{fmtSec(snapshot.serverOffsetSec)}</dd>
          <dt className="text-green-400/60">bufferEst</dt>
          <dd>
            {fmtSec(snapshot.bufferEst)}{" "}
            <span className="text-green-400/40">({snapshot.bufferSource})</span>
          </dd>
          <dt className="text-green-400/60">bufferReal</dt>
          <dd>{fmtSec(snapshot.bufferReal)}</dd>
          <dt className="text-green-400/60">untilNext</dt>
          <dd>{fmtSec(snapshot.secondsUntilTransition)}</dd>
          <dt className="text-green-400/60">srvTrans</dt>
          <dd className={snapshot.serverTransition ? "text-amarelo" : ""}>
            {snapshot.serverTransition ? "YES" : "no"}
          </dd>
          <dt className="text-green-400/60">anticipated</dt>
          <dd className={snapshot.anticipated ? "text-amarelo" : ""}>
            {snapshot.anticipated ? "LOCKED" : "no"}
          </dd>
          <dt className="text-green-400/60">snapAge</dt>
          <dd>{((Date.now() - snapshot.timestamp) / 1000).toFixed(1)}s</dd>
        </dl>
      )}
      <div className="mt-2 pt-2 border-t border-green-500/20 text-green-400/40 text-[9px]">
        Calibrar: <code className="text-green-400/60">localStorage.setItem('radio.bufferSec','5')</code>
      </div>
    </div>
  );
}

export default RadioDebugOverlay;
