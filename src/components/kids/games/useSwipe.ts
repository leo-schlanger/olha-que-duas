import { useCallback, useRef } from 'react';

export type Cardinal = 'up' | 'down' | 'left' | 'right';

const THRESHOLD = 28;

export function useSwipe(onDir: (dir: Cardinal) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!start.current) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        onDir(dx > 0 ? 'right' : 'left');
      } else {
        onDir(dy > 0 ? 'down' : 'up');
      }
    },
    [onDir],
  );

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
