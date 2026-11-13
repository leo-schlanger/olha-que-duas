/**
 * Kids Christmas dress-up: starry bordô night (like the wreath logo), snowy
 * hill with pines and gifts, bunting and treats in the margins. Friendly on
 * purpose (ages 3–12). One lazy chunk; it also brings kids-natal.css.
 */
import { GiftShape, NT, OrnamentShape, PineShape, SnowflakeShape, SnowmanShape, StarShape } from "../art";
import "../natal.css";
import "./kids-natal.css";

const SKY = "linear-gradient(180deg, #2b0710 0%, #5c0f1f 40%, #8c1c33 78%, #b3263f 100%)";
const GLOW =
  "radial-gradient(60% 50% at 25% 30%, rgba(242, 193, 78, 0.22), transparent 70%), radial-gradient(50% 45% at 80% 20%, rgba(63, 184, 113, 0.16), transparent 70%)";

const STARS: [number, number, number][] = [
  [6, 12, 3], [14, 30, 2], [22, 8, 2.5], [31, 22, 2], [41, 6, 3], [48, 34, 2], [57, 14, 2.5],
  [66, 28, 2], [74, 9, 2], [83, 36, 2.5], [92, 18, 3], [9, 48, 2], [27, 54, 2.5], [38, 44, 2],
  [62, 50, 2], [79, 58, 2.5], [95, 46, 2], [52, 62, 2], [18, 70, 2], [88, 72, 2],
];

function CandyCane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 64" className={className} aria-hidden="true">
      <defs>
        <pattern id="nt-cane" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <rect width="8" height="8" fill="#fff" />
          <rect width="4" height="8" fill={NT.vivo} />
        </pattern>
      </defs>
      <path d="M8 62V18a8 8 0 0 1 16 0v4" fill="none" stroke="#5c0f1f" strokeWidth="10" strokeLinecap="round" />
      <path d="M8 62V18a8 8 0 0 1 16 0v4" fill="none" stroke="url(#nt-cane)" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Sky({ variant }: { variant: "hero" | "shell" }) {
  const hero = variant === "hero";
  return (
    <div className="kh-sky absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: SKY }} />
      <div className="absolute inset-x-0 top-0 h-2/3 opacity-80" style={{ background: GLOW }} />
      {STARS.map(([x, y, r], i) => (
        <span
          key={i}
          className={`absolute rounded-full kh-twinkle ${i % 3 === 0 ? "" : "hidden sm:block"}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: r * 2,
            height: r * 2,
            background: i % 4 === 0 ? NT.dourado : "#fff8e7",
            animationDelay: `${(i % 5) * 0.7}s`,
          }}
        />
      ))}
      <svg
        viewBox="0 0 24 24"
        className={`nt-star-glow absolute ${
          hero
            ? "top-[8.75rem] left-3 w-14 sm:w-20 md:top-44 md:left-[6%] md:w-28 lg:w-32"
            : "top-[11.5rem] right-[8%] w-12 md:top-[15rem] md:right-[4%] md:w-24"
        }`}
      >
        <StarShape />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute top-[12rem] left-[34%] w-8 md:top-44 md:left-[20%] md:w-12 opacity-70">
        <SnowflakeShape />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute top-[22rem] right-[5%] w-7 md:top-[17rem] md:right-[24%] md:w-10 opacity-60">
        <SnowflakeShape />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute hidden md:block top-[26rem] left-[8%] w-10 opacity-60">
        <SnowflakeShape />
      </svg>
      {hero && (
        <>
          <svg viewBox="0 0 40 48" className="absolute hidden sm:block top-[30rem] left-[3%] w-10 md:w-14 kh-float">
            <OrnamentShape />
          </svg>
          <svg viewBox="0 0 40 48" className="absolute hidden md:block top-[34rem] right-[4%] w-12 kh-float kh-float-late">
            <OrnamentShape fill={NT.dourado} band={NT.vivo} />
          </svg>
        </>
      )}
    </div>
  );
}

function Hill({ variant }: { variant: "hero" | "shell" }) {
  return (
    <div className="kh-night-hill absolute bottom-0 left-0 right-0 z-0 pointer-events-none" aria-hidden="true">
      {/* pines, a snowman and gifts on the right; the left belongs to the easter egg */}
      <div className="absolute z-[1] bottom-[40%] right-[3%] md:bottom-[30%] md:right-[8%] flex items-end gap-0.5 md:gap-1">
        <svg viewBox="0 -10 56 92" className="w-8 md:w-12 hidden sm:block">
          <SnowmanShape />
        </svg>
        <svg viewBox="0 -4 60 94" className="w-10 md:w-16">
          <PineShape lights star />
        </svg>
        <svg viewBox="0 -4 60 94" className="w-8 md:w-12">
          <PineShape fill={NT.pinheiroClaro} />
        </svg>
        <svg viewBox="0 0 48 48" className="w-7 md:w-10 -ml-2">
          <GiftShape />
        </svg>
      </div>
      {variant === "hero" && (
        <div className="absolute z-[1] bottom-[40%] left-[46%] hidden md:flex items-end gap-1">
          <svg viewBox="0 0 48 48" className="w-10 rotate-6">
            <GiftShape box={NT.dourado} ribbon={NT.vivo} />
          </svg>
          <svg viewBox="0 -4 60 94" className="w-12">
            <PineShape lights />
          </svg>
        </div>
      )}
      <svg viewBox="0 0 1440 180" className="relative w-full h-auto block" preserveAspectRatio="none">
        <path fill="#dfe8ef" d="M0 90 C240 30, 480 150, 720 90 S1200 30, 1440 90 L1440 180 L0 180 Z" />
        <path fill="#ffffff" d="M0 130 C240 80, 520 180, 760 130 S1220 80, 1440 130 L1440 180 L0 180 Z" />
        <path d="M0 130 C240 80, 520 180, 760 130 S1220 80, 1440 130" fill="none" stroke={NT.dourado} strokeOpacity=".6" strokeWidth="3" />
      </svg>
    </div>
  );
}

const FLAGS = [NT.vivo, NT.pinheiroClaro, NT.dourado, "#ffffff"];

function Garland({ className = "" }: { className?: string }) {
  const n = 18;
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-[1] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-12 md:h-20">
        <path d="M0 6 Q720 64 1440 6" fill="none" stroke={NT.noite} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {Array.from({ length: n }, (_, i) => {
          const t = (i + 0.5) / n;
          const x = t * 1440;
          const y = 6 + 2 * t * (1 - t) * 58; // quadratic bezier, control at the middle
          const c = FLAGS[i % FLAGS.length];
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M-26 0H26L0 36Z" fill={c} stroke={NT.noite} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {i % 4 === 0 && <circle cx="0" cy="12" r="5" fill={NT.dourado} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Candy canes, baubles, gifts and a snowman in the side margins of a light section. */
function Treats() {
  return (
    // lg+ only: below that the text runs edge to edge and the treats would sit on it
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block" aria-hidden="true">
      <CandyCane className="absolute top-[14%] left-[2%] w-7 md:w-9 -rotate-12 kh-float" />
      <svg viewBox="0 0 40 48" className="absolute top-[42%] right-[2%] w-8 md:w-11 rotate-12 kh-float kh-float-late">
        <OrnamentShape fill={NT.pinheiroClaro} />
      </svg>
      <svg viewBox="0 0 48 48" className="absolute bottom-[18%] left-[3%] w-10 md:w-12 rotate-6">
        <GiftShape />
      </svg>
      <svg viewBox="0 -10 56 92" className="absolute bottom-[8%] right-[3%] w-12 md:w-14 kh-float">
        <SnowmanShape />
      </svg>
      <CandyCane className="absolute top-[70%] right-[6%] w-6 rotate-6" />
    </div>
  );
}

export type KidsNatalPiece =
  | { piece: "sky"; variant: "hero" | "shell" }
  | { piece: "hill"; variant: "hero" | "shell" }
  | { piece: "garland"; className?: string }
  | { piece: "treats" };

export default function KidsNatalArt(props: KidsNatalPiece) {
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
