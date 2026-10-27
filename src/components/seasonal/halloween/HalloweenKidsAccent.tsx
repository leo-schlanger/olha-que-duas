import { useEffect, useState } from "react";
import { GhostShape, PumpkinShape } from "./art";
import "./halloween.css";

const PUMPKINS = [
  { tone: "red", size: "w-12 sm:w-14 md:w-16" },
  { tone: "yellow", size: "w-10 sm:w-11 md:w-12" },
  { tone: "red", size: "w-11 sm:w-12 md:w-14" },
] as const;

/** Easter egg: light the three pumpkins and a friendly ghost asks for Pão-por-Deus. */
function PumpkinPatch() {
  const [lit, setLit] = useState<boolean[]>([false, false, false]);
  const [ghost, setGhost] = useState(false);
  const allLit = lit.every(Boolean);

  useEffect(() => {
    if (!allLit) return;
    setGhost(true);
    const t = window.setTimeout(() => {
      setGhost(false);
      setLit([false, false, false]);
    }, 4200);
    return () => window.clearTimeout(t);
  }, [allLit]);

  const toggle = (i: number) => setLit((prev) => prev.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="absolute bottom-1 left-2 sm:left-6 md:left-[7%] z-20 font-kids">
      {/* ghost + speech to the right of the pumpkins, on the hill: never over the CTAs */}
      <div className="absolute left-full bottom-0 ml-1 w-[13.5rem] md:w-60 pointer-events-none" role="status" aria-live="polite">
        {ghost && (
          <div className="hw-pop flex items-end gap-1">
            <svg viewBox="0 0 64 76" className="w-10 md:w-12 shrink-0" aria-hidden="true">
              <GhostShape kids wave />
            </svg>
            <span className="mb-7 rounded-2xl rounded-bl-sm bg-white px-2.5 py-1.5 text-[13px] md:text-sm font-extrabold leading-tight whitespace-nowrap text-pink-700 shadow-[0_4px_0_rgba(3,105,161,0.2)]">
              Bu!<br />Dás-me Pão-por-Deus?
            </span>
          </div>
        )}
      </div>
      <div className="flex items-end gap-0.5">
        {PUMPKINS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={lit[i]}
            aria-label={lit[i] ? `Apagar a abóbora ${i + 1}` : `Acender a abóbora ${i + 1}`}
            className={`${p.size} min-h-[44px] flex items-end rounded-full cursor-pointer transition-transform active:scale-95 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white`}
          >
            <svg viewBox="0 0 80 68" className={`w-full h-auto ${lit[i] ? "hw-lit" : ""}`} aria-hidden="true">
              <PumpkinShape tone={p.tone} face lit={lit[i]} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Friendly ghost peeking near the sun on the games hub. */
function SkyGhost() {
  return (
    <div
      className="pointer-events-none absolute top-[9.5rem] right-[24%] sm:right-[20%] md:top-40 md:right-[14%] z-0 w-10 md:w-14"
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 76" className="hw-peek w-full h-auto">
        <g className="hw-bob">
          <GhostShape kids wave />
        </g>
      </svg>
    </div>
  );
}

const HalloweenKidsAccent = ({ variant }: { variant: "patch" | "sky" }) =>
  variant === "patch" ? <PumpkinPatch /> : <SkyGhost />;

export default HalloweenKidsAccent;
