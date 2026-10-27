import { BatShape, GhostShape, MoonShape, NIGHT_INK, PumpkinShape } from "./art";
import "./halloween.css";

// Fixed star field (percent positions) — no randomness, no layout work.
const STARS: Array<[number, number, number]> = [
  [6, 14, 2], [14, 30, 1], [22, 9, 1.5], [31, 22, 1], [38, 6, 2], [46, 17, 1],
  [53, 8, 1.5], [61, 26, 1], [68, 12, 2], [76, 5, 1], [83, 19, 1.5], [91, 10, 1],
  [96, 28, 2], [9, 44, 1], [27, 38, 1], [57, 41, 1], [88, 36, 1], [42, 33, 1.5],
];

const BATS: Array<{ x: string; y: string; w: string; r: number; o: number }> = [
  { x: "right-[49%]", y: "top-[170px]", w: "w-10 xl:w-12", r: -8, o: 1 },
  { x: "right-[54%]", y: "top-[205px]", w: "w-6 xl:w-8", r: 10, o: 0.9 },
  { x: "right-[45%]", y: "top-[236px]", w: "w-5 xl:w-7", r: -14, o: 0.85 },
];

const PATCH: Array<{ left: string; size: string; tone: "red" | "yellow"; lit: boolean; z?: string }> = [
  { left: "left-[3%]", size: "w-11 md:w-16", tone: "yellow", lit: false },
  { left: "left-[13%]", size: "w-16 md:w-24", tone: "red", lit: true },
  { left: "left-[56%] md:left-[44%]", size: "w-9 md:w-12", tone: "red", lit: false },
  { left: "left-[74%] md:left-[80%]", size: "w-20 md:w-28", tone: "red", lit: true, z: "z-[1]" },
  { left: "left-[89%] md:left-[91%]", size: "w-10 md:w-14", tone: "yellow", lit: false },
];

/**
 * Night sky for the home Hero: stars, moon, bats and a pumpkin patch on a
 * dark hill. Sits under the content (z-0), never takes pointer events.
 */
const HalloweenHeroScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    {/* stars */}
    {STARS.map(([x, y, s], i) => (
      <span
        key={i}
        className="absolute rounded-full bg-[hsl(45_60%_92%)]"
        style={{ left: `${x}%`, top: `${y}%`, width: s * 1.6, height: s * 1.6, opacity: 0.35 + (i % 4) * 0.15 }}
      />
    ))}

    {/* moon: behind the photo's top-left corner on desktop, top-right on mobile */}
    <svg
      viewBox="0 0 100 100"
      className="absolute top-[88px] right-[2%] w-32 sm:w-40 md:top-[96px] lg:right-[36%] lg:w-56"
    >
      <MoonShape id="hw-hero-moon" />
    </svg>

    {/* bats crossing the moon */}
    {BATS.map((b, i) => (
      <svg
        key={i}
        viewBox="0 0 64 28"
        className={`absolute hidden lg:block ${b.x} ${b.y} ${b.w}`}
        style={{ transform: `rotate(${b.r}deg)`, opacity: b.o }}
      >
        <BatShape />
      </svg>
    ))}
    <svg viewBox="0 0 64 28" className="absolute top-[150px] right-[22%] w-7 lg:hidden" style={{ transform: "rotate(-10deg)" }}>
      <BatShape />
    </svg>
    <svg viewBox="0 0 64 28" className="absolute top-[124px] right-[34%] w-5 lg:hidden" style={{ transform: "rotate(12deg)" }}>
      <BatShape />
    </svg>

    {/* hill + pumpkin patch */}
    <div className="absolute inset-x-0 bottom-0 h-[92px] md:h-[132px]">
      {/* bare tree, desktop only */}
      <svg viewBox="0 0 120 200" className="absolute bottom-[38px] left-[-10px] hidden w-[150px] md:block lg:w-[190px]">
        <g fill="none" stroke={NIGHT_INK} strokeLinecap="round">
          <path d="M58 200C60 160 54 130 60 100" strokeWidth={11} />
          <path d="M60 104C48 86 30 80 16 62" strokeWidth={6} />
          <path d="M59 112C74 92 92 88 104 70" strokeWidth={6} />
          <path d="M60 100C62 76 56 50 66 22" strokeWidth={5} />
          <path d="M30 80C24 74 22 64 26 54M88 88c8-6 10-14 8-24M64 40c-8-8-10-16-6-26M23 66c-8 0-14-4-18-10M101 74c6-2 12-6 14-14" strokeWidth={2.6} />
        </g>
      </svg>
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 70C180 40 360 46 560 72S980 108 1180 74 1380 46 1440 52V140H0Z" fill="hsl(268 45% 9%)" />
        <path d="M0 100C220 78 420 86 640 104S1060 126 1260 100 1420 88 1440 90V140H0Z" fill={NIGHT_INK} />
      </svg>
      {/* ghost peeking behind the big pumpkin */}
      <svg viewBox="0 0 64 76" className="absolute bottom-[34px] left-[84%] w-10 md:bottom-[52px] md:left-[86%] md:w-14">
        <g className="hw-peek">
          <g className="hw-bob">
            <GhostShape wave />
          </g>
        </g>
      </svg>
      {PATCH.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 80 68"
          className={`absolute bottom-[6px] md:bottom-[10px] ${p.left} ${p.size} ${p.z ?? ""} ${p.lit ? "hw-lit" : ""}`}
        >
          <PumpkinShape tone={p.tone} face={p.lit} lit={p.lit} />
        </svg>
      ))}
    </div>
  </div>
);

export default HalloweenHeroScene;
