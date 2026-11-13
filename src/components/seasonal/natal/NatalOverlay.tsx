import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion, setSnowing, snowOffThisSession, useSnow } from "./snowStore";
import "./natal.css";

// Game screens need focus: no snow there.
const GAME_ROUTE = /^\/kids\/jogos\/.+/;

/**
 * Light snowfall over the whole site for ~32 s after load (and again when the
 * banner button asks). Fixed, pointer-events-none, aria-hidden, transform-only
 * animation: no layout shift and nothing to click through.
 */
const NatalOverlay = () => {
  const { pathname } = useLocation();
  const { snowing, run } = useSnow();

  useEffect(() => {
    if (!prefersReducedMotion() && !snowOffThisSession()) setSnowing(true);
  }, []);

  if (!snowing || GAME_ROUTE.test(pathname)) return null;

  return (
    <div
      key={run}
      className="nt-snow"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setSnowing(false);
      }}
    >
      <div className="nt-snow-sway">
        <div className="nt-snow-layer nt-snow-b" />
        <div className="nt-snow-layer nt-snow-a" />
        <div className="nt-snow-layer nt-snow-c" />
      </div>
    </div>
  );
};

export default NatalOverlay;
