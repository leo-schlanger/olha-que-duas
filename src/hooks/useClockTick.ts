import { useEffect, useState } from "react";

/**
 * Dispara um re-render exactamente quando o relógio cruza qualquer uma
 * das fronteiras (em minutos a contar da meia-noite local). Devolve um
 * contador que muda em cada cruzamento — usar como dependência ou apenas
 * forçar re-render do componente.
 *
 * Exemplo: `useClockTick([0, 7*60, 12*60, 18*60])` re-renderiza às 00:00,
 * 07:00, 12:00 e 18:00 sem precisar de polling de minuto a minuto.
 *
 * Se a lista de fronteiras for vazia ou inválida, o hook não agenda nada.
 */
export function useClockTick(boundariesInMinutes: number[]): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!Array.isArray(boundariesInMinutes) || boundariesInMinutes.length === 0) {
      return;
    }

    // Normaliza, deduplica e ordena as fronteiras (0..1439)
    const normalized = Array.from(
      new Set(
        boundariesInMinutes
          .map((b) => Math.floor(b))
          .filter((b) => Number.isFinite(b) && b >= 0 && b < 24 * 60)
      )
    ).sort((a, b) => a - b);

    if (normalized.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      const now = new Date();
      const minutesNow = now.getHours() * 60 + now.getMinutes();
      const secondsNow = now.getSeconds();
      const msNow = now.getMilliseconds();

      // Próxima fronteira hoje (estritamente maior que minutesNow), senão
      // a primeira fronteira de amanhã.
      const next = normalized.find((b) => b > minutesNow);
      const targetMinutes = next ?? normalized[0] + 24 * 60;

      const minutesUntil = targetMinutes - minutesNow;
      // +500ms de margem para garantir que Date.now() já cruzou
      const msUntil = minutesUntil * 60_000 - secondsNow * 1000 - msNow + 500;

      timeoutId = setTimeout(() => {
        setTick((t) => t + 1);
        scheduleNext();
      }, Math.max(msUntil, 1000));
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
    // Stable deps via JSON serialization — array literals geralmente mudam
    // por referência mas não por conteúdo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(boundariesInMinutes)]);

  return tick;
}
