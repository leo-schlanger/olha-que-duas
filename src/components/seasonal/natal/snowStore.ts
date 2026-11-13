import { useSyncExternalStore } from "react";

/**
 * Shared on/off switch for the snowfall: the overlay starts it, the banner
 * button stops or restarts it. `run` changes on every start so the overlay
 * remounts and the finite animation plays again.
 */
type State = { snowing: boolean; run: number };

let state: State = { snowing: false, run: 0 };
const listeners = new Set<() => void>();

export const SNOW_OFF_KEY = "nt-snow-off";

export function setSnowing(snowing: boolean) {
  if (snowing === state.snowing) return;
  state = { snowing, run: snowing ? state.run + 1 : state.run };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useSnow(): State {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

export function snowOffThisSession() {
  try {
    return sessionStorage.getItem(SNOW_OFF_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberSnowChoice(on: boolean) {
  try {
    if (on) sessionStorage.removeItem(SNOW_OFF_KEY);
    else sessionStorage.setItem(SNOW_OFF_KEY, "1");
  } catch {
    /* private mode: choice lasts for this view */
  }
}
