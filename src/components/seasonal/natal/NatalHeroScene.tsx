import { GiftShape, NT, OrnamentShape, PineShape, SnowflakeShape, StarShape } from "./art";
import "./natal.css";

// Fixed star field (percent positions): no randomness, no layout work.
const STARS: Array<[number, number, number]> = [
  [5, 16, 2], [12, 34, 1], [19, 10, 1.5], [27, 24, 1], [35, 7, 2], [44, 19, 1], [51, 9, 1.5],
  [60, 28, 1], [67, 13, 2], [75, 6, 1], [82, 21, 1.5], [90, 11, 1], [96, 30, 2], [8, 46, 1],
  [24, 41, 1], [56, 44, 1], [86, 39, 1], [41, 34, 1.5],
];

const FLAKES: Array<{ c: string; o: number }> = [
  { c: "top-[22%] left-[6%] w-5 md:w-7", o: 0.55 },
  { c: "top-[38%] left-[46%] hidden lg:block w-5", o: 0.4 },
  { c: "top-[58%] left-[3%] w-4 md:w-6", o: 0.45 },
  { c: "top-[30%] right-[4%] w-4 md:w-6", o: 0.5 },
  { c: "top-[64%] right-[8%] hidden md:block w-7", o: 0.4 },
];

// Trees on the snowy hill: edges only, the middle stays free for the CTAs.
const TREES: Array<{ c: string; lights?: boolean; star?: boolean; fill?: string }> = [
  { c: "left-[-8px] w-16 md:w-24 bottom-[18px] md:bottom-[30px]", lights: true, star: true },
  { c: "left-[11%] w-10 md:w-14 bottom-[12px] md:bottom-[22px]", fill: NT.pinheiroClaro },
  { c: "left-[19%] w-7 md:w-10 bottom-[10px] md:bottom-[16px] hidden sm:block" },
  { c: "right-[13%] w-9 md:w-14 bottom-[12px] md:bottom-[24px]", fill: NT.pinheiroClaro },
  { c: "right-[-6px] w-20 md:w-28 bottom-[16px] md:bottom-[26px]", lights: true, star: true },
];

/**
 * Christmas night over the home Hero: stars, a big golden star, baubles hanging
 * from the top, snowflakes and a snowy hill with pines and gifts. Sits under the
 * content (z-0) and never takes pointer events.
 */
const NatalHeroScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    {STARS.map(([x, y, s], i) => (
      <span
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: s * 1.6,
          height: s * 1.6,
          background: i % 3 === 0 ? NT.dourado : "#fff8e7",
          opacity: 0.4 + (i % 4) * 0.15,
        }}
      />
    ))}

    {/* big golden star: between the lights and the photo on phones, behind the photo's corner on desktop */}
    <svg viewBox="0 0 24 24" className="nt-star-glow absolute top-[100px] left-[calc(50%-20px)] w-10 sm:w-12 md:top-[104px] md:left-auto md:right-[8%] md:w-16 lg:right-[38%] lg:w-20">
      <StarShape />
    </svg>

    {/* baubles hanging from the top edge */}
    <div className="absolute top-0 left-[4%] hidden sm:flex items-start gap-6 md:left-[3%]">
      <svg viewBox="0 0 40 120" className="nt-swing w-8 md:w-10">
        <path d="M20 0v72" stroke={NT.douradoEsc} strokeWidth={1.2} />
        <g transform="translate(0 70)">
          <OrnamentShape />
        </g>
      </svg>
      <svg viewBox="0 0 40 120" className="nt-swing w-6 md:w-8 [animation-delay:1.6s]">
        <path d="M20 0v40" stroke={NT.douradoEsc} strokeWidth={1.2} />
        <g transform="translate(0 38)">
          <OrnamentShape fill={NT.dourado} band={NT.vivo} />
        </g>
      </svg>
    </div>

    {FLAKES.map((f, i) => (
      <svg key={i} viewBox="0 0 24 24" className={`absolute ${f.c}`} style={{ opacity: f.o }}>
        <SnowflakeShape />
      </svg>
    ))}

    {/* snowy hill with pines and gifts */}
    <div className="absolute inset-x-0 bottom-0 h-[92px] md:h-[132px]">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 74C180 44 360 50 560 76S980 110 1180 78 1380 50 1440 56V140H0Z" fill={NT.neveSombra} />
        <path d="M0 102C220 80 420 88 640 106S1060 128 1260 102 1420 90 1440 92V140H0Z" fill={NT.neve} />
      </svg>
      {TREES.map((t, i) => (
        <svg key={i} viewBox="0 -4 60 94" className={`absolute ${t.c}`}>
          <PineShape fill={t.fill} lights={t.lights} star={t.star} />
        </svg>
      ))}
      <div className="absolute bottom-[6px] left-[24%] hidden md:flex items-end gap-1">
        <svg viewBox="0 0 48 48" className="w-9">
          <GiftShape />
        </svg>
        <svg viewBox="0 0 48 48" className="w-7">
          <GiftShape box={NT.pinheiroClaro} ribbon={NT.vivo} />
        </svg>
      </div>
      <div className="absolute bottom-[4px] right-[21%] flex items-end gap-1 md:bottom-[8px]">
        <svg viewBox="0 0 48 48" className="w-7 md:w-10">
          <GiftShape box={NT.dourado} ribbon={NT.vivo} />
        </svg>
        <svg viewBox="0 0 48 48" className="w-6 md:w-8">
          <GiftShape />
        </svg>
      </div>
    </div>
  </div>
);

export default NatalHeroScene;
