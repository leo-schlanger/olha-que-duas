const MUTE_KEY = 'oqd-kids-games-muted';
export const KIDS_MUTE_EVENT = 'oqd-kids-mute';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

export function isGamesMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setGamesMuted(value: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(KIDS_MUTE_EVENT));
  }
}

export function toggleGamesMuted(): boolean {
  const next = !isGamesMuted();
  setGamesMuted(next);
  return next;
}

type Wave = OscillatorType;

function beep(freq: number, duration: number, type: Wave = 'sine', gain = 0.08, slideTo?: number) {
  if (isGamesMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (slideTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), ctx.currentTime + duration);
  }
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const kidsSfx = {
  tap: () => beep(520, 0.08, 'triangle', 0.05),
  flip: () => beep(420, 0.12, 'triangle', 0.06),
  match: () => {
    beep(523, 0.12, 'sine', 0.07);
    window.setTimeout(() => beep(659, 0.14, 'sine', 0.07), 80);
    window.setTimeout(() => beep(784, 0.18, 'sine', 0.07), 160);
  },
  mismatch: () => beep(220, 0.22, 'sawtooth', 0.04, 110),
  correct: () => {
    beep(587, 0.1, 'sine', 0.07);
    window.setTimeout(() => beep(784, 0.16, 'sine', 0.07), 90);
  },
  wrong: () => beep(196, 0.28, 'square', 0.035, 140),
  collect: () => beep(880, 0.1, 'triangle', 0.05, 1320),
  hit: () => beep(140, 0.3, 'sawtooth', 0.05, 80),
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      window.setTimeout(() => beep(f, 0.18, 'sine', 0.07), i * 110),
    );
  },
  lose: () => beep(196, 0.45, 'triangle', 0.05, 98),
};
