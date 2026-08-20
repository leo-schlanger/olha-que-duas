import { useCallback, useEffect, useState } from 'react';

export function useHighScore(key: string) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(key) || 0);
      if (Number.isFinite(stored)) setHighScore(stored);
    } catch {
      /* ignore */
    }
  }, [key]);

  const updateHighScore = useCallback(
    (score: number) => {
      setHighScore((prev) => {
        const next = Math.max(prev, score);
        try {
          localStorage.setItem(key, String(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key],
  );

  return { highScore, updateHighScore };
}
