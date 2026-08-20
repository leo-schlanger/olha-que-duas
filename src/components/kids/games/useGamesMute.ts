import { useCallback, useEffect, useState } from 'react';
import { isGamesMuted, KIDS_MUTE_EVENT, toggleGamesMuted } from './gameSounds';

export function useGamesMute() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isGamesMuted());
    const on = () => setMuted(isGamesMuted());
    window.addEventListener(KIDS_MUTE_EVENT, on);
    return () => window.removeEventListener(KIDS_MUTE_EVENT, on);
  }, []);

  const toggle = useCallback(() => {
    setMuted(toggleGamesMuted());
  }, []);

  return { muted, toggle };
}
