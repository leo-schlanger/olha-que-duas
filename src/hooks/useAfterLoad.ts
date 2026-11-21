import { useEffect, useState } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

/**
 * True once the page has loaded and the main thread is idle: below-the-fold
 * sections and overlays mount then, so their chunks, data and images do not
 * compete with the first paint and the hero photo (LCP). `now` short-cuts the
 * wait (e.g. the URL points at the section); any of `events` on window too.
 * perf, 21/11/2026.
 */
export function useAfterLoad(now = false, events: readonly string[] = []) {
  const [ready, setReady] = useState(now);
  const eventKey = events.join(" ");
  useEffect(() => {
    if (ready) return;
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const whenIdle = () => {
      const w = window as IdleWindow;
      if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(go, { timeout: 2000 });
      else setTimeout(go, 200);
    };
    const names = eventKey ? eventKey.split(" ") : [];
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    for (const name of names) window.addEventListener(name, go);
    return () => {
      done = true;
      window.removeEventListener("load", whenIdle);
      for (const name of names) window.removeEventListener(name, go);
    };
  }, [ready, eventKey]);
  return ready;
}
