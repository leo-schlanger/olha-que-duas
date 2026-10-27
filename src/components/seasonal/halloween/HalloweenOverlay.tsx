import { useState } from "react";
import { useLocation } from "react-router-dom";
import { GhostShape } from "./art";
import "./halloween.css";

// Game screens need focus: no drifting ghost there.
const GAME_ROUTE = /^\/kids\/jogos\/.+/;

function seen(key: string) {
  try {
    if (sessionStorage.getItem(key) === "1") return true;
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
  return false;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One ghost (two in Kids) drifts up the edge of the screen once per session,
 * then unmounts. Purely decorative: fixed, pointer-events-none, aria-hidden.
 */
const HalloweenOverlay = () => {
  const { pathname } = useLocation();
  const kids = pathname.startsWith("/kids");
  const [show] = useState(() => !prefersReducedMotion() && !GAME_ROUTE.test(pathname) && !seen(kids ? "hw-ghost-kids" : "hw-ghost-site"));
  const [done, setDone] = useState(false);

  if (!show || done || GAME_ROUTE.test(pathname)) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 64 76"
        className="hw-drift absolute bottom-[14%] right-[6%] w-11 md:w-16 opacity-0"
        onAnimationEnd={kids ? undefined : () => setDone(true)}
      >
        <GhostShape kids={kids} wave />
      </svg>
      {kids && (
        <svg
          viewBox="0 0 64 76"
          className="hw-drift absolute bottom-[8%] left-[7%] w-8 md:w-12 opacity-0"
          style={{ animationDelay: "3.2s" }}
          onAnimationEnd={() => setDone(true)}
        >
          <GhostShape kids />
        </svg>
      )}
    </div>
  );
};

export default HalloweenOverlay;
