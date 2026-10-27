/**
 * Kids Halloween dress-up: magic night sky, night hill with lit pumpkins,
 * bunting and treats. Friendly on purpose (ages 3–12): every face smiles,
 * nothing has teeth. One lazy chunk; it also brings kids-halloween.css.
 */
import type { CSSProperties } from "react";
import { GhostShape, PumpkinShape } from "../art";
import { KH } from "./palette";
import "./kids-halloween.css";

/* ---------- small shapes ---------- */

function Bat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 48" className={className} aria-hidden="true" focusable="false">
      <g strokeLinejoin="round">
        <path
          d="M40 18C33 8 20 4 4 10c6 3 8 8 7 13 4-3 9-3 12 1 2-4 7-5 10-2 2-2 4-3 7-4Z"
          fill={KH.batWing}
        />
        <path
          d="M40 18c7-10 20-14 36-8-6 3-8 8-7 13-4-3-9-3-12 1-2-4-7-5-10-2-2-2-4-3-7-4Z"
          fill={KH.batWing}
        />
        <path d="M31 12l2-9 5 6M49 12l-2-9-5 6" fill={KH.batBody} />
        <ellipse cx="40" cy="22" rx="11" ry="12" fill={KH.batBody} />
        <circle cx="35.5" cy="20" r="3.6" fill="#fff" />
        <circle cx="44.5" cy="20" r="3.6" fill="#fff" />
        <circle cx="36" cy="20.6" r="1.8" fill={KH.ink} />
        <circle cx="45" cy="20.6" r="1.8" fill={KH.ink} />
        <circle cx="32.5" cy="25.5" r="2" fill={KH.pink} opacity=".8" />
        <circle cx="47.5" cy="25.5" r="2" fill={KH.pink} opacity=".8" />
        <path d="M37.5 26.5q2.5 2.2 5 0" fill="none" stroke={KH.ink} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Moon({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className="relative">
        <div className="absolute inset-0 rounded-full scale-[1.6] blur-2xl" style={{ background: KH.moonGlow }} />
        <svg viewBox="0 0 120 120" className="relative w-full h-auto kh-moon">
          <circle cx="60" cy="60" r="54" fill={KH.moon} />
          <circle cx="38" cy="36" r="9" fill={KH.moonShade} />
          <circle cx="86" cy="46" r="6" fill={KH.moonShade} />
          <circle cx="78" cy="88" r="8" fill={KH.moonShade} />
          <path d="M40 60q6-7 12 0M68 60q6-7 12 0" fill="none" stroke={KH.ink} strokeWidth="4" strokeLinecap="round" />
          <path d="M48 74q12 11 24 0" fill="none" stroke={KH.ink} strokeWidth="4" strokeLinecap="round" />
          <circle cx="36" cy="72" r="6" fill={KH.pink} opacity=".55" />
          <circle cx="84" cy="72" r="6" fill={KH.pink} opacity=".55" />
        </svg>
      </div>
    </div>
  );
}

function Candy({ color, className = "", style }: { color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 30" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M14 15L2 5v20ZM46 15l12-10v20Z" fill={color} stroke={KH.ink} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="30" cy="15" rx="17" ry="11" fill={color} stroke={KH.ink} strokeWidth="2" />
      <path d="M22 9q-4 6 0 12M30 6q-4 9 0 18M38 9q-4 6 0 12" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Lollipop({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 70" className={className} aria-hidden="true" focusable="false">
      <path d="M20 36v32" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="20" r="17" fill={color} stroke={KH.ink} strokeWidth="2" />
      <path d="M20 20m0-3a3 3 0 1 1-3 3 6 6 0 1 1 6 6 9 9 0 1 1-9-9 12 12 0 1 1 12 12" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function Ghost({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 76" className={className} aria-hidden="true" focusable="false">
      <GhostShape kids wave />
    </svg>
  );
}

/* ---------- pieces ---------- */

// Fixed star field (percent positions) so SSR/hydration and screenshots are stable.
const STARS: [number, number, number][] = [
  [6, 12, 3], [14, 30, 2], [22, 8, 2.5], [31, 22, 2], [41, 6, 3], [48, 34, 2], [57, 14, 2.5],
  [66, 28, 2], [74, 9, 2], [83, 36, 2.5], [92, 18, 3], [9, 48, 2], [27, 54, 2.5], [38, 44, 2],
  [62, 50, 2], [79, 58, 2.5], [95, 46, 2], [52, 62, 2], [18, 70, 2], [88, 72, 2],
];

function Sky({ variant }: { variant: "hero" | "shell" }) {
  const hero = variant === "hero";
  return (
    <div className="kh-sky absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: KH.skyGradient }} />
      <div className="absolute inset-x-0 top-0 h-2/3 opacity-70" style={{ background: KH.skyAurora }} />
      {STARS.map(([x, y, r], i) => (
        <span
          key={i}
          className={`absolute rounded-full kh-twinkle ${i % 3 === 0 ? "" : "hidden sm:block"}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: r * 2,
            height: r * 2,
            background: i % 4 === 0 ? KH.lime : KH.star,
            animationDelay: `${(i % 5) * 0.7}s`,
          }}
        />
      ))}
      <Moon
        className={
          hero
            ? "absolute top-[8.75rem] left-3 w-14 sm:w-20 md:top-44 md:left-[6%] md:w-28 lg:w-32"
            : "absolute top-[11.5rem] right-[8%] w-12 md:top-[15rem] md:right-[4%] md:w-24"
        }
      />
      <Bat className="absolute kh-flap top-[12rem] left-[34%] w-10 md:top-44 md:left-[20%] md:w-20" />
      <Bat className="absolute kh-flap kh-flap-late top-[22rem] right-[5%] w-9 md:top-[17rem] md:right-[24%] md:w-14" />
      <Bat className="absolute kh-flap hidden md:block top-[26rem] left-[8%] w-12 -scale-x-100" />
      {hero && (
        <>
          <Ghost className="absolute hidden sm:block top-[30rem] left-[3%] w-12 md:w-16 kh-float opacity-95" />
          <Ghost className="absolute hidden md:block top-[34rem] right-[4%] w-14 kh-float kh-float-late opacity-95" />
        </>
      )}
    </div>
  );
}

function Hill({ variant }: { variant: "hero" | "shell" }) {
  return (
    <div className="kh-night-hill absolute bottom-0 left-0 right-0 z-0 pointer-events-none" aria-hidden="true">
      {/* lit pumpkins and treats on the right side; the left belongs to the easter egg */}
      <div className="absolute z-[1] bottom-[42%] right-[4%] md:bottom-[30%] md:right-[9%] flex items-end gap-1 md:gap-2">
        <Lollipop color={KH.pink} className="w-5 md:w-7 -mb-1 hidden sm:block" />
        <svg viewBox="0 0 80 68" className="w-10 md:w-16 kh-glow">
          <PumpkinShape tone="red" face lit />
        </svg>
        <svg viewBox="0 0 80 68" className="w-8 md:w-12 kh-glow">
          <PumpkinShape tone="yellow" face lit />
        </svg>
        <Candy color={KH.lime} className="w-7 md:w-10" />
      </div>
      {variant === "hero" && (
        <div className="absolute z-[1] bottom-[40%] left-[46%] hidden md:flex items-end gap-2">
          <Candy color={KH.orange} className="w-10 rotate-12" />
          <svg viewBox="0 0 80 68" className="w-12 kh-glow">
            <PumpkinShape tone="red" face lit />
          </svg>
        </div>
      )}
      <svg viewBox="0 0 1440 180" className="relative w-full h-auto block" preserveAspectRatio="none">
        <path fill={KH.hillBack} d="M0 90 C240 30, 480 150, 720 90 S1200 30, 1440 90 L1440 180 L0 180 Z" />
        <path fill={KH.hillFront} d="M0 130 C240 80, 520 180, 760 130 S1220 80, 1440 130 L1440 180 L0 180 Z" />
        <path
          d="M0 130 C240 80, 520 180, 760 130 S1220 80, 1440 130"
          fill="none"
          stroke={KH.lime}
          strokeOpacity=".55"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

const FLAGS = [KH.orange, KH.violet, KH.lime, KH.pink];

function Garland({ className = "" }: { className?: string }) {
  const n = 18;
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-[1] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-12 md:h-20">
        <path d="M0 6 Q720 64 1440 6" fill="none" stroke={KH.ink} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {Array.from({ length: n }, (_, i) => {
          const t = (i + 0.5) / n;
          const x = t * 1440;
          const y = 6 + 2 * t * (1 - t) * 58; // quadratic bezier, control at the middle
          const c = FLAGS[i % FLAGS.length];
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M-26 0H26L0 36Z" fill={c} stroke={KH.ink} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {i % 4 === 0 && <circle cx="0" cy="12" r="5" fill="#fff" opacity=".9" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Treats and little ghosts in the side margins of a light section. */
function Treats() {
  return (
    // lg+ only: below that the text runs edge to edge and the treats would sit on it
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block" aria-hidden="true">
      <Candy color={KH.orange} className="absolute top-[14%] left-[2%] w-9 md:w-12 -rotate-12 kh-float" />
      <Lollipop color={KH.violet} className="absolute top-[42%] right-[2%] w-6 md:w-9 rotate-12 kh-float kh-float-late" />
      <Candy color={KH.lime} className="absolute bottom-[18%] left-[3%] w-8 md:w-11 rotate-6 hidden sm:block" />
      <Ghost className="absolute bottom-[10%] right-[3%] w-10 md:w-14 kh-float hidden sm:block" />
      <Candy color={KH.pink} className="absolute top-[70%] right-[6%] w-8 -rotate-6 hidden lg:block" />
    </div>
  );
}

export type KidsHalloweenPiece =
  | { piece: "sky"; variant: "hero" | "shell" }
  | { piece: "hill"; variant: "hero" | "shell" }
  | { piece: "garland"; className?: string }
  | { piece: "treats" };

export default function KidsHalloweenArt(props: KidsHalloweenPiece) {
  switch (props.piece) {
    case "sky":
      return <Sky variant={props.variant} />;
    case "hill":
      return <Hill variant={props.variant} />;
    case "garland":
      return <Garland className={props.className} />;
    case "treats":
      return <Treats />;
  }
}
