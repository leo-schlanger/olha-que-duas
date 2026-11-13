import { useEffect, useState } from "react";
import { GiftShape, NT, SnowmanShape, StarShape } from "./art";
import "./natal.css";

const GIFTS = [
  { box: NT.vivo, ribbon: NT.dourado, size: "w-12 sm:w-14 md:w-16" },
  { box: NT.pinheiroClaro, ribbon: NT.vivo, size: "w-10 sm:w-11 md:w-12" },
  { box: NT.dourado, ribbon: NT.vivo, size: "w-11 sm:w-12 md:w-14" },
] as const;

/** Easter egg: open the three gifts and a snowman wishes Merry Christmas. */
function GiftPile() {
  const [open, setOpen] = useState<boolean[]>([false, false, false]);
  const [snowman, setSnowman] = useState(false);
  const allOpen = open.every(Boolean);

  useEffect(() => {
    if (!allOpen) return;
    setSnowman(true);
    const t = window.setTimeout(() => {
      setSnowman(false);
      setOpen([false, false, false]);
    }, 4200);
    return () => window.clearTimeout(t);
  }, [allOpen]);

  const toggle = (i: number) => setOpen((prev) => prev.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="absolute bottom-1 left-2 sm:left-6 md:left-[7%] z-20 font-kids">
      {/* snowman + speech to the right of the gifts, on the hill: never over the CTAs */}
      <div className="absolute left-full bottom-0 ml-1 w-[13.5rem] md:w-60 pointer-events-none" role="status" aria-live="polite">
        {snowman && (
          <div className="nt-pop flex items-end gap-1">
            <svg viewBox="0 -10 56 92" className="w-10 md:w-12 shrink-0" aria-hidden="true">
              <SnowmanShape />
            </svg>
            <span className="mb-7 rounded-2xl rounded-bl-sm bg-white px-2.5 py-1.5 text-[13px] md:text-sm font-extrabold leading-tight whitespace-nowrap text-[#b3122a] shadow-[0_4px_0_rgba(92,15,31,0.25)]">
              Ho, ho, ho!<br />Feliz Natal!
            </span>
          </div>
        )}
      </div>
      <div className="flex items-end gap-0.5">
        {GIFTS.map((g, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={open[i]}
            aria-label={open[i] ? `Fechar o presente ${i + 1}` : `Abrir o presente ${i + 1}`}
            className={`${g.size} min-h-[44px] flex items-end cursor-pointer transition-transform active:scale-95 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg`}
          >
            <svg viewBox="-8 -14 56 62" className="w-full h-auto" aria-hidden="true">
              {open[i] && (
                <g transform="translate(12 0) scale(1)">
                  <StarShape />
                </g>
              )}
              <GiftShape box={g.box} ribbon={g.ribbon} open={open[i]} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Smiling golden star in the sky of the games hub. */
function SkyStar() {
  return (
    <div
      className="pointer-events-none absolute top-[9.5rem] right-[24%] sm:right-[20%] md:top-40 md:right-[14%] z-0 w-10 md:w-14"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="nt-star-glow w-full h-auto">
        <StarShape />
        <circle cx={10} cy={11.5} r={0.9} fill={NT.noite} />
        <circle cx={14} cy={11.5} r={0.9} fill={NT.noite} />
        <path d="M10.2 13.8q1.8 1.6 3.6 0" fill="none" stroke={NT.noite} strokeWidth={0.8} strokeLinecap="round" />
      </svg>
    </div>
  );
}

const NatalKidsAccent = ({ variant }: { variant: "patch" | "sky" }) =>
  variant === "patch" ? <GiftPile /> : <SkyStar />;

export default NatalKidsAccent;
